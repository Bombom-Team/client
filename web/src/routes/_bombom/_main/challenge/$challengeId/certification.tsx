import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Certificate from '@/pages/challenge/certification/components/Certificate';
import { useCertificateDownload } from '@/pages/challenge/certification/hooks/useCertificateDownload';

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

  const { data: certificationInfo } = useQuery(
    queries.certificationInfo(challengeId),
  );

  const { certificateRef, download } = useCertificateDownload(
    certificationInfo?.nickname,
  );

  if (!certificationInfo) {
    return null;
  }

  return (
    <Container>
      <Flex direction="column" align="center" gap={16}>
        <DownloadButton onClick={download}>💾 이미지로 저장하기</DownloadButton>
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
