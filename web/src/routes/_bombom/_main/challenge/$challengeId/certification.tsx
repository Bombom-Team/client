import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import Certificate from '@/pages/challenge/certification/components/Certificate';
import { isWebView } from '@/utils/device';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/certification',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 수료증',
      },
    ],
  }),
  component: ChallengeCertification,
});

function ChallengeCertification() {
  const { challengeId: stringChallengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/certification',
  });
  const challengeId = Number(stringChallengeId);
  const certificateRef = useRef<HTMLDivElement>(null);

  const { data: certificationInfo } = useQuery(
    queries.certificationInfo(challengeId),
  );

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: window.devicePixelRatio || 1,
    });
    const fileName = `${certificationInfo?.nickname}_수료증.png`;

    if (isWebView()) {
      const imageFileBase64 = canvas.toDataURL('image/png');
      sendMessageToRN({
        type: 'SAVE_IMAGE',
        payload: { imageFileBase64, fileName },
      });
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (!certificationInfo) {
    return null;
  }

  return (
    <Container>
      <Flex direction="column" align="center" gap={16}>
        <DownloadButton onClick={handleDownload}>
          💾 이미지로 저장하기
        </DownloadButton>
        <CertificateScaler ref={certificateRef}>
          <Certificate {...certificationInfo} />
        </CertificateScaler>
      </Flex>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CertificateScaler = styled.div``;

const DownloadButton = styled(Button)`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t3Regular};
  font-weight: 600;
  white-space: nowrap;
`;
