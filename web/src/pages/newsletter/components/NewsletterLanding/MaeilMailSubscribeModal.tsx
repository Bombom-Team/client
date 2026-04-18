import styled from '@emotion/styled';
import { useState } from 'react';
import { useSubscribeNewsletterMutation } from './hooks/useSubscribeNewsletterMutation';
import { TRACKS, WEEKLY_ISSUE_COUNTS } from '../../constants/subscribe';
import Checkbox from '@/components/Checkbox/Checkbox';
import Flex from '@/components/Flex';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import type { WeeklyIssueCount } from '../../types/subscribe';
import type { Ref } from 'react';

interface Props {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  newsletterId: number;
  closeModal: () => void;
  onSubscribeSuccess: () => void;
}

const MaeilMailSubscribeModal = ({
  modalRef,
  isOpen,
  newsletterId,
  closeModal,
  onSubscribeSuccess,
}: Props) => {
  const device = useDevice();
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedWeeklyIssueCount, setSelectedWeeklyIssueCount] =
    useState<WeeklyIssueCount | null>(null);
  const [tracksError, setTracksError] = useState<string | null>(null);
  const [weeklyIssueCountError, setWeeklyIssueCountError] = useState<
    string | null
  >(null);

  const { mutate: subscribeNewsletter, isPending } =
    useSubscribeNewsletterMutation({
      newsletterId,
      onSubscribeSuccess,
    });

  const toggleTrack = (value: string) => {
    setSelectedTracks((prev) =>
      prev.includes(value)
        ? prev.filter((track) => track !== value)
        : [...prev, value],
    );
    setTracksError(null);
  };

  const handleWeeklyIssueCountChange = (value: WeeklyIssueCount) => {
    setSelectedWeeklyIssueCount(value);
    setWeeklyIssueCountError(null);
  };

  const confirmSubscription = () => {
    const hasTracksError = selectedTracks.length === 0;
    const hasWeeklyIssueCountError = selectedWeeklyIssueCount === null;

    if (hasTracksError) {
      setTracksError('분야를 선택해 주세요.');
    }
    if (hasWeeklyIssueCountError) {
      setWeeklyIssueCountError('발행 주기를 선택해 주세요.');
    }

    if (hasTracksError || hasWeeklyIssueCountError) return;

    subscribeNewsletter({
      tracks: selectedTracks,
      weeklyIssueCount: selectedWeeklyIssueCount!,
    });
  };

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={device === 'mobile' ? 'bottom' : 'center'}
    >
      <ModalContent>
        <Title>사전 구독</Title>

        <Flex direction="column" gap={28}>
          <Section>
            <Flex align="center" gap={4}>
              <SectionLabel>
                분야<Highlight>*</Highlight>
              </SectionLabel>
              <Highlight>(중복 선택 가능)</Highlight>
            </Flex>
            <TrackGrid>
              {TRACKS.map(({ value, label }) => (
                <Checkbox
                  key={value}
                  id={`track-${value}`}
                  checked={selectedTracks.includes(value)}
                  onChange={() => toggleTrack(value)}
                >
                  {label}
                </Checkbox>
              ))}
            </TrackGrid>
            <ErrorMessage>{tracksError}</ErrorMessage>
          </Section>

          <Section>
            <SectionLabel>
              발행 주기<Highlight>*</Highlight>
            </SectionLabel>
            <IssueCountGroup role="radiogroup" aria-label="발행 주기 선택">
              {WEEKLY_ISSUE_COUNTS.map(({ value, label }) => (
                <IssueCountItem key={value}>
                  <HiddenRadio
                    id={`weekly-issue-count-${value}`}
                    name="weeklyIssueCount"
                    value={value}
                    type="radio"
                    checked={selectedWeeklyIssueCount === value}
                    onChange={() => handleWeeklyIssueCountChange(value)}
                  />
                  <IssueCountLabel
                    selected={selectedWeeklyIssueCount === value}
                    htmlFor={`weekly-issue-count-${value}`}
                  >
                    {label}
                  </IssueCountLabel>
                </IssueCountItem>
              ))}
            </IssueCountGroup>
            <ErrorMessage>{weeklyIssueCountError}</ErrorMessage>
          </Section>
        </Flex>

        <ConfirmButton onClick={confirmSubscription} disabled={isPending}>
          {isPending ? '구독 중...' : '구독하기'}
        </ConfirmButton>
      </ModalContent>
    </Modal>
  );
};

export default MaeilMailSubscribeModal;

const ModalContent = styled.div`
  width: 480px;
  max-width: calc(90vw - 104px);

  display: flex;
  gap: 32px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;

const Section = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionLabel = styled.p`
  display: flex;
  align-items: flex-start;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const TrackGrid = styled.div`
  display: grid;
  gap: 12px;

  grid-template-columns: 1fr 1fr;
`;

const ErrorMessage = styled.p`
  min-height: 2em;

  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.body3};
`;

const IssueCountGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const IssueCountItem = styled.div`
  flex: 1;
`;

const HiddenRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;

  appearance: none;
  opacity: 0;
  pointer-events: none;

  &:focus-visible + label {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const IssueCountLabel = styled.label<{ selected: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};

  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease,
    color 150ms ease;
`;

const ConfirmButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;

  background-color: ${({ theme, disabled }) =>
    disabled ? `${theme.colors.black}66` : theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading6};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }
`;
