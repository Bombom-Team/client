import styled from '@emotion/styled';
import { Certificate } from '../types/certificate';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type { CertificateMedal } from '../types/certificate';
import type { Device } from '@/hooks/useDevice';
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
  const device = useDevice();
  const isMobile = device === 'mobile';

  const formattedStartDate = formatDate(new Date(startDate));
  const formattedEndDate = formatDate(new Date(endDate));

  const issuedDate = new Date(endDate);
  issuedDate.setDate(issuedDate.getDate() + 1);
  const formattedIssuedDate = formatDate(issuedDate);

  const frameImage = FRAME_IMAGE[medal];

  return (
    <Container device={device}>
      {frameImage && <FrameImage src={frameImage} alt="" />}
      <Content isMobile={isMobile}>
        <Main isMobile={isMobile}>
          <Flex align="flex-start">
            <NicknameText>{nickname}</NicknameText>
          </Flex>

          <Flex direction="column" gap={6}>
            <MetaLine isMobile={isMobile}>
              <MetaLabel>프로그램</MetaLabel>
              <MetaValue>{challengeName}</MetaValue>
            </MetaLine>
            <MetaLine isMobile={isMobile}>
              <MetaLabel>기수</MetaLabel>
              <MetaValue>{generation}기</MetaValue>
            </MetaLine>
            <MetaLine isMobile={isMobile}>
              <MetaLabel>기간</MetaLabel>
              <MetaValue>
                {formattedStartDate} ~ {formattedEndDate}
              </MetaValue>
            </MetaLine>
          </Flex>

          <Description isMobile={isMobile}>
            {getMedalDescription(
              medal,
              medalCondition,
              challengeName,
              generation,
            )}
          </Description>
        </Main>

        <Bottom>
          <IssuedDate isMobile={isMobile}>{formattedIssuedDate}</IssuedDate>
        </Bottom>
      </Content>
    </Container>
  );
};

export default Certificate;

const Container = styled.div<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  min-width: 300px;
  max-width: ${({ device }) => {
    if (device === 'pc') return '560px';
    if (device === 'tablet') return '450px';
    return '360px';
  }};
`;

const FrameImage = styled.img`
  width: 100%;
  display: block;
`;

const Content = styled.div<{ isMobile: boolean }>`
  position: absolute;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '10px' : '24px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  inset: 0;
`;

const Main = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0px' : '16px')};
  flex-direction: column;
  align-items: flex-start;
`;

const NicknameText = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
  font-size: clamp(1.175rem, 3.5vw, 1.75rem);
`;

const MetaLine = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 8px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  font-size: clamp(0.65rem, 1.5vw, 0.875rem);
`;

const MetaLabel = styled.span`
  width: 64px;
  font-weight: 600;
`;

const MetaValue = styled.span`
  font-weight: 600;
`;

const Description = styled.p<{ isMobile: boolean }>`
  max-width: 360px;
  margin: ${({ isMobile }) => (isMobile ? '8px 0 0' : '12px 0 0')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  font-size: clamp(0.6875rem, 1.8vw, 1rem);
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IssuedDate = styled.div<{ isMobile: boolean }>`
  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  font-size: clamp(0.65rem, 1.5vw, 0.875rem);
  text-align: center;
`;
