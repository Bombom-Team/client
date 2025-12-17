import styled from '@emotion/styled';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice, type Device } from '@/hooks/useDevice';
import FeatureContent from '@/pages/landing/components/FeatureContent';
import highlight from '#/assets/avif/highlight.avif';
import navBar from '#/assets/avif/nav-bar.avif';
import newslettersCategory from '#/assets/avif/newsletters-category.avif';
import notification from '#/assets/avif/notification.avif';
import recommendNewsletters from '#/assets/avif/recommend-newsletters.avif';
import todayNewsletters from '#/assets/avif/today-newsletters.avif';
import BellIcon from '#/assets/svg/bell.svg';
import CompassIcon from '#/assets/svg/compass.svg';
import EditIcon from '#/assets/svg/edit.svg';
import MailIcon from '#/assets/svg/mail.svg';

const LandingFeatures = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <FeatureContent
        Icon={CompassIcon}
        title="취향에 맞는 뉴스레터를 찾아드려요"
        description={
          <>
            <p>다양한 카테고리에서 원하는 콘텐츠를 발견하고,</p>
            <p>새로운 주제의 뉴스레터도 탐색해보세요.</p>
          </>
        }
        previewComponent={
          <MultipleImageWrapper>
            <img src={recommendNewsletters} alt="뉴스레터 추천" width={360} />
            <CategoryImage src={newslettersCategory} alt="뉴스레터 카테고리" />
          </MultipleImageWrapper>
        }
        componentPosition="right"
      />
      <FeatureContent
        Icon={MailIcon}
        title="쌓인 뉴스레터는 걱정하지 마세요"
        description={
          <>
            <p>오늘 도착한 뉴스레터만 모아 보고,</p>
            <p>지난 뉴스레터를 안전하게 보관해요.</p>
            <p>스팸함에 묻히지 않도록, 빠짐없이 모아드려요.</p>
          </>
        }
        previewComponent={
          <MultipleImageWrapper>
            <img src={todayNewsletters} alt="오늘의 뉴스레터" />
            <NavBarImage src={navBar} alt="네비게이션 바" />
          </MultipleImageWrapper>
        }
        componentPosition="left"
      />
      <FeatureContent
        Icon={EditIcon}
        title="중요한 내용은 바로 기록하세요"
        description={
          <>
            <p>읽다가 중요한 부분을 하이라이트로 표시하고,</p>
            <p>떠오르는 생각과 아이디어를 메모로 남겨보세요.</p>
          </>
        }
        previewComponent={<img src={highlight} alt="하이라이트 & 메모" />}
        componentPosition="right"
      />
      <FeatureContent
        Icon={BellIcon}
        title="꼭 읽어야 할 소식을 놓치지 마세요"
        description={
          <>
            <p>중요한 뉴스레터가 도착하면 즉시 알림을 받아보세요.</p>
            <p>바쁜 일상에서 관심 있는 소식을 빠르게 확인하고,</p>
            <p>읽고 싶은 타이밍을 놓치지 않도록 알려드려요.</p>
          </>
        }
        previewComponent={<img src={notification} alt="뉴스레터 알림" />}
        componentPosition="left"
      />
    </Container>
  );
};

export default LandingFeatures;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1084px';
  }};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '84px' : '168px')};
  flex-direction: column;
`;

const MultipleImageWrapper = styled.div`
  position: relative;
`;

const CategoryImage = styled(ImageWithFallback)`
  position: absolute;
  top: 44%;
  left: 50%;
  width: 160px;
  border-radius: 16px;

  filter: drop-shadow(0 10px 15px rgb(0 0 0 / 10%))
    drop-shadow(0 4px 6px rgb(0 0 0 / 10%));

  transform: translate(-50%, -50%);
`;

const NavBarImage = styled(ImageWithFallback)`
  position: absolute;
  top: 80%;
  left: 50%;
  width: 160px;
  border-radius: 16px;

  filter: drop-shadow(0 10px 15px rgb(0 0 0 / 10%))
    drop-shadow(0 4px 6px rgb(0 0 0 / 10%));

  transform: translate(-50%, -50%);
`;
