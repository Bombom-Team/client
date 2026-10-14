import { Text } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import type { Track } from '../../types/subscribeNewsletters';

const TRACKS: { value: Track; label: string }[] = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
];

interface MaeilMailEditModalProps {
  initialTracks: Track[];
  isPending: boolean;
  onSave: (tracks: Track[]) => void;
  onClose: () => void;
}

const MaeilMailEditModal = ({
  initialTracks,
  isPending,
  onSave,
  onClose,
}: MaeilMailEditModalProps) => {
  const [selectedTracks, setSelectedTracks] = useState(initialTracks);

  const handleToggleTrack = (track: Track) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track],
    );
  };

  return (
    <Container>
      <Title>구독 분야 수정</Title>
      <TrackGrid>
        {TRACKS.map(({ value, label }) => (
          <Checkbox
            key={value}
            id={`edit-track-${value}`}
            checked={selectedTracks.includes(value)}
            onChange={() => handleToggleTrack(value)}
          >
            {label}
          </Checkbox>
        ))}
      </TrackGrid>
      <Text color="primaryBomBom" font="t4Regular">
        * 최소 하나 이상의 분야를 선택해주세요.
        <br />
        수정 시, 다음 발행일부터 반영됩니다.
      </Text>
      <ButtonWrapper>
        <ModalButton
          variant="filled"
          onClick={() => onSave(selectedTracks)}
          disabled={selectedTracks.length === 0 || isPending}
        >
          수정
        </ModalButton>
        <ModalButton variant="outlined" onClick={onClose}>
          취소
        </ModalButton>
      </ButtonWrapper>
    </Container>
  );
};

export default MaeilMailEditModal;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const TrackGrid = styled.div`
  display: flex;
  gap: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)`
  height: 48px;
  min-width: 100px;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t5Regular};

  word-break: keep-all;
`;
