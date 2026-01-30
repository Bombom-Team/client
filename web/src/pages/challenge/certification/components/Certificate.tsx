import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { formatDate } from '@/utils/date';
import type { RefObject } from 'react';
import certificateFrame from '#/assets/avif/certificate-frame.avif';
import challengeGoldMedal from '#/assets/avif/challenge-gold-medal.avif';
import logo from '#/assets/avif/logo.avif';

interface CertificateProps {
  nickname: string;
  challengeName: string;
  generation: number;
  startDate: string;
  endDate: string;
  ref: RefObject<HTMLDivElement | null>;
}

const Certificate = ({
  nickname,
  challengeName,
  generation,
  startDate,
  endDate,
  // medal,
  // medalCondition,
  ref,
}: CertificateProps) => {
  const formattedStartDate = formatDate(new Date(startDate));
  const formattedEndDate = formatDate(new Date(endDate));

  const issuedDate = new Date(endDate);
  issuedDate.setDate(issuedDate.getDate() + 1);
  const formattedIssuedDate = formatDate(issuedDate);

  return (
    <CertificateWrapper ref={ref}>
      <TopTitle>[봄봄] 챌린지 수료증</TopTitle>

      <Main>
        <NameRow>
          <UserName title={nickname}>{nickname}</UserName>

          <MedalImg src={challengeGoldMedal} alt="" />
        </NameRow>

        <Flex direction="column" gap={6}>
          <MetaLine>
            <MetaLabel>프로그램:</MetaLabel>
            <MetaValue>{challengeName}</MetaValue>
          </MetaLine>
          <MetaLine>
            <MetaLabel>기수:</MetaLabel>
            <MetaValue>{generation}기</MetaValue>
          </MetaLine>
          <MetaLine>
            <MetaLabel>기간:</MetaLabel>
            <MetaValue>
              {formattedStartDate} ~ {formattedEndDate}
            </MetaValue>
          </MetaLine>
        </Flex>

        <Description>
          위 사람은 봄봄에서 진행한 {challengeName} {generation}기에
          <br />
          단 하루의 결석 없이 모든 일정을 성실히 완료하였으므로
          <br />이 금메달 수료증을 수여합니다.
        </Description>
      </Main>

      <Bottom>
        <BrandWrapper>
          <Text font="caption">뉴스레터 서비스</Text>
          <Flex align="center" gap={8}>
            <BrandMark src={logo} alt="봄봄 로고" />
            <Text font="body1">봄봄</Text>
          </Flex>
          <Text font="caption">www.bombom.news</Text>
        </BrandWrapper>
        <IssuedDate>{formattedIssuedDate}</IssuedDate>
        <EmptyBox />
      </Bottom>
    </CertificateWrapper>
  );
};

export default Certificate;

const CertificateWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 80px 60px;
  border-radius: 10px;

  background-image: url(${certificateFrame});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  aspect-ratio: 456 / 673;
`;

const TopTitle = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
  text-align: center;
`;

const Main = styled.div`
  margin-top: 32px;
`;

const NameRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
`;

const UserName = styled.h2`
  overflow: hidden;
  max-width: 260px;
  margin-left: 70px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
`;

const MedalImg = styled.img`
  width: 140px;
  height: 140px;

  display: block;

  object-fit: contain;
`;

const MetaLine = styled.div`
  display: flex;
  gap: 8px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const MetaLabel = styled.span`
  font-weight: 700;
  opacity: 0.95;
`;

const MetaValue = styled.span`
  font-weight: 600;
  opacity: 0.95;
`;

const Description = styled.p`
  max-width: 360px;
  margin: 44px 0 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const Bottom = styled.div`
  position: absolute;
  right: 44px;
  bottom: 50px;
  left: 44px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const EmptyBox = styled.div`
  flex: 1;
`;

const IssuedDate = styled.div`
  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;

const BrandWrapper = styled.div`
  display: flex;
  gap: 6px;
  flex: 1;
  flex-direction: column;
`;

const BrandMark = styled.img`
  width: 28px;
  height: 28px;
`;
