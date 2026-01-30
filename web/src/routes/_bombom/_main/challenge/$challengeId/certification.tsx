import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { queries } from '@/apis/queries';
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
      <Certificate {...certificationInfo} ref={certificateRef} />
      <DownloadButton onClick={handleDownload}>
        이미지로 저장하기
      </DownloadButton>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
`;

const DownloadButton = styled.button`
  width: 100%;
  max-width: 480px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
