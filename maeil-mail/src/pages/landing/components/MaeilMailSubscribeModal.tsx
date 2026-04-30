import styled from '@emotion/styled';
import { useState } from 'react';
import { Flex, Modal, Text } from '@bombom/shared/ui-web';
import Checkbox from '@/components/Checkbox/Checkbox';
import { useDevice } from '@bombom/shared/ui-web';
import type { Device } from '@bombom/shared/ui-web';
import type { Ref } from 'react';
import type { SubscribeTrack } from '../types/subscribe';
import { useSubscribeNewsletterMutation } from '../hooks/useSubscribeNewsletterMutation';
import { TRACKS } from '../constants/subscribe';

interface Props {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
  onSubscribeSuccess: () => void;
}

const MaeilMailSubscribeModal = ({
  modalRef,
  isOpen,
  closeModal,
  onSubscribeSuccess,
}: Props) => {
  const [selectedTracks, setSelectedTracks] = useState<SubscribeTrack[]>([]);
  const [tracksError, setTracksError] = useState<string | null>(null);
  const device = useDevice();

  const { mutate: subscribeNewsletter, isPending } =
    useSubscribeNewsletterMutation({
      onSubscribeSuccess,
    });

  const toggleTrack = (value: SubscribeTrack) => {
    setSelectedTracks((prev) =>
      prev.includes(value)
        ? prev.filter((track) => track !== value)
        : [...prev, value],
    );
    setTracksError(null);
  };

  const confirmSubscription = () => {
    if (selectedTracks.length === 0) {
      setTracksError('분야를 선택해 주세요.');
      return;
    }

    subscribeNewsletter({ tracks: selectedTracks });
  };

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={device === 'mobile' ? 'bottom' : 'center'}
    >
      <ModalContent device={device}>
        <TitleGroup>
          <Title>사전 구독</Title>
        </TitleGroup>

        <Section>
          <Flex align="center" gap={4}>
            <SectionLabel>
              분야
              <Text color="primary" font="t5Regular">
                *
              </Text>
            </SectionLabel>
            <Text color="primary" font="t5Regular">
              (중복 선택 가능)
            </Text>
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
        <Flex direction="column" align="flex-start" gap={8}>
          <WarnText>* 구독한 매일메일은 봄봄에서만 읽을 수 있어요.</WarnText>
          <ConfirmButton onClick={confirmSubscription} disabled={isPending}>
            {isPending ? '구독 중...' : '구독하기'}
          </ConfirmButton>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default MaeilMailSubscribeModal;

const ModalContent = styled.div<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '100%' : '480px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '32px')};
  flex-direction: column;
`;

const TitleGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;
`;

const WarnText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.t5Regular};
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
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const TrackGrid = styled.div`
  display: flex;
  gap: 12px;

  & > * {
    flex: 1;
  }
`;

const ErrorMessage = styled.p`
  min-height: 2em;

  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const ConfirmButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;

  background-color: ${({ theme, disabled }) =>
    disabled ? `${theme.colors.black}66` : theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t6Bold};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }
`;
