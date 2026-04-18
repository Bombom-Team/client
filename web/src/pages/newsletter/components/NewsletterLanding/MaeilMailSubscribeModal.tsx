import styled from '@emotion/styled';
import { useState } from 'react';
import { useSubscribeNewsletterMutation } from './hooks/useSubscribeNewsletterMutation';
import Checkbox from '@/components/Checkbox/Checkbox';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import type { Ref } from 'react';

const TRACKS = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
] as const;

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
  };

  const confirmSubscription = () => {
    if (selectedTracks.length === 0) return;
    subscribeNewsletter(selectedTracks);
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

        <Section>
          <SectionLabel>분야</SectionLabel>
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
          <Hint>*중복 선택 가능</Hint>
        </Section>

        <ConfirmButton
          onClick={confirmSubscription}
          disabled={selectedTracks.length === 0 || isPending}
        >
          {isPending ? '구독 중...' : '확인'}
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
  gap: 28px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;

const Section = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const SectionLabel = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const TrackGrid = styled.div`
  display: grid;
  gap: 12px;

  grid-template-columns: 1fr 1fr;
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
