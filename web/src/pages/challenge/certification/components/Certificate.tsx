import styled from '@emotion/styled';
import { Certificate } from '../types/certificate';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { formatDate } from '@/utils/date';
import type { CertificateMedal } from '../types/certificate';
import certificateFrameBronze from '#/assets/avif/certificate-frame-bronze.avif';
import certificateFrameGold from '#/assets/avif/certificate-frame-gold.avif';
import certificateFrameSilver from '#/assets/avif/certificate-frame-silver.avif';

const FRAME_IMAGE: Partial<Record<CertificateMedal, string>> = {
  GOLD: certificateFrameGold,
  SILVER: certificateFrameSilver,
  BRONZE: certificateFrameBronze,
};

const MEDAL_LABEL: Record<CertificateMedal, string> = {
  GOLD: '금메달',
  SILVER: '은메달',
  BRONZE: '동메달',
  FAIL: '',
};

const getMedalDescription = (
  medal: CertificateMedal,
  medalCondition: number,
  challengeName: string,
  generation: number,
) => {
  const firstLine = `위 사람은 봄봄에서 진행한 ${challengeName} ${generation}기에`;

  switch (medal) {
    case 'GOLD':
      return `${firstLine}\n단 하루의 결석 없이 모든 일정을 성실히 완료하였으므로\n이 ${MEDAL_LABEL[medal]} 수료증을 수여합니다.`;
    case 'SILVER':
      return `${firstLine}\n전체 일정 중 ${medalCondition}% 이상을 성실히 완료하였으므로\n이 ${MEDAL_LABEL[medal]} 수료증을 수여합니다.`;
    case 'BRONZE':
      return `${firstLine}\n전체 일정 중 ${medalCondition}% 이상을 성실히 완료하였으므로\n이 ${MEDAL_LABEL[medal]} 수료증을 수여합니다.`;
  }
};

type CertificateProps = Certificate;

const Certificate = ({
  nickname,
  challengeName,
  generation,
  startDate,
  endDate,
  medal,
  medalCondition,
}: CertificateProps) => {
  const formattedStartDate = formatDate(new Date(startDate));
  const formattedEndDate = formatDate(new Date(endDate));

  const issuedDate = new Date(endDate);
  issuedDate.setDate(issuedDate.getDate() + 1);
  const formattedIssuedDate = formatDate(issuedDate);

  return (
    <Container medal={medal}>
      <Main>
        <Flex align="flex-start">
          <Text color="textPrimary" font="t11Bold">
            {nickname}
          </Text>
        </Flex>

        <Flex direction="column" gap={6}>
          <MetaLine>
            <MetaLabel>프로그램</MetaLabel>
            <MetaValue>{challengeName}</MetaValue>
          </MetaLine>
          <MetaLine>
            <MetaLabel>기수</MetaLabel>
            <MetaValue>{generation}기</MetaValue>
          </MetaLine>
          <MetaLine>
            <MetaLabel>기간</MetaLabel>
            <MetaValue>
              {formattedStartDate} ~ {formattedEndDate}
            </MetaValue>
          </MetaLine>
        </Flex>

        <Description>
          {getMedalDescription(
            medal,
            medalCondition,
            challengeName,
            generation,
          )}
        </Description>
      </Main>

      <Bottom>
        <IssuedDate>{formattedIssuedDate}</IssuedDate>
      </Bottom>
    </Container>
  );
};

export default Certificate;

const Container = styled.div<{ medal: CertificateMedal }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 210px 70px 160px 90px;
  border-radius: 10px;

  background-image: ${({ medal }) =>
    FRAME_IMAGE[medal] ? `url(${FRAME_IMAGE[medal]})` : 'none'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  aspect-ratio: 1086 / 1448;
`;

const Main = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
`;

const MetaLine = styled.div`
  display: flex;
  gap: 8px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const MetaLabel = styled.span`
  width: 64px;
  font-weight: 600;
`;

const MetaValue = styled.span`
  font-weight: 600;
`;

const Description = styled.p`
  max-width: 360px;
  margin: 12px 0 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Bottom = styled.div`
  margin-top: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const IssuedDate = styled.div`
  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
