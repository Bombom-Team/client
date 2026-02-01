import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import Certificate from '@/pages/challenge/certification/components/Certificate';

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
  const device = useDevice();
  const isPC = device === 'pc';

  const { data: certificationInfo } = useQuery(
    queries.certificationInfo(challengeId),
  );

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.download = `${certificationInfo?.nickname}_수료증.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!certificationInfo) {
    return null;
  }

  return (
    <Container>
      <Flex direction={isPC ? 'row' : 'column'} align="flex-start" gap={16}>
        {!isPC && (
          <DownloadButton onClick={handleDownload}>
            💾 이미지로 저장하기
          </DownloadButton>
        )}
        <Certificate {...certificationInfo} ref={certificateRef} />
        {isPC && (
          <DownloadButton onClick={handleDownload}>
            💾 이미지로 저장하기
          </DownloadButton>
        )}
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

const DownloadButton = styled(Button)`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.caption};
  font-weight: 600;
  white-space: nowrap;
`;
