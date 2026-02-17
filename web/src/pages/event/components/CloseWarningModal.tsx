import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Text from '@/components/Text';

interface CloseWarningModalProps {
  onDownload: () => Promise<void>;
  onClose: () => void;
}

const CloseWarningModal = ({ onDownload, onClose }: CloseWarningModalProps) => {
  const handleDownloadAndClose = async () => {
    try {
      await onDownload();
    } finally {
      onClose();
    }
  };

  return (
    <Flex direction="column" gap={24} align="center">
      <Flex direction="column" gap={8} align="center">
        <Text font="heading6">이미지를 저장하셨나요?</Text>
        <Description>
          지금 닫으면 나중에 생길 선물함에서 확인할 수 있지만,
          <br />
          이미지 다운로드를 권장해요.
        </Description>
      </Flex>
      <ButtonGroup direction="column" gap={8} align="center">
        <PrimaryButton onClick={handleDownloadAndClose}>
          💾 이미지 저장 후 닫기
        </PrimaryButton>
        <SecondaryButton variant="outlined" onClick={onClose}>
          그냥 닫기
        </SecondaryButton>
      </ButtonGroup>
    </Flex>
  );
};

export default CloseWarningModal;

const ButtonGroup = styled(Flex)`
  width: 100%;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
  line-height: 1.5;
`;

const PrimaryButton = styled(Button)`
  width: 100%;
  max-width: 200px;
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;
`;

const SecondaryButton = styled(Button)`
  width: 100%;
  max-width: 200px;
  font: ${({ theme }) => theme.fonts.body2};
`;
