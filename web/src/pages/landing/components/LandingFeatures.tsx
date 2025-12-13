import styled from '@emotion/styled';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
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
  return (
    <>
      <FeatureContent
        Icon={CompassIcon}
        title="뉴스레터 추천"
        description={
          <>
            <p>취향에 맞는 뉴스레터를 손쉽게 발견하세요</p>
            <p>다양한 분야의 콘텐츠가 당신을 기다리고 있어요</p>
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
        title="오늘의 뉴스레터"
        description={
          <>
            <p>매일 새로운 뉴스레터를 만나고</p>
            <p>가볍게 인사이트를 쌓아보세요</p>
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
        title="하이라이트 & 메모"
        description={
          <>
            <p>읽는 흐름 속에서 중요한 부분을 표시하고</p>
            <p>아이디어와 생각을 즉시 메모로 정리해보세요</p>
          </>
        }
        previewComponent={<img src={highlight} alt="하이라이트 & 메모" />}
        componentPosition="right"
      />
      <FeatureContent
        Icon={BellIcon}
        title="뉴스레터 알림"
        description={
          <>
            <p>원하는 뉴스레터를 바로 알림으로</p>
            <p>중요한 소식을 놓치지 않도록 제때 알려드려요</p>
          </>
        }
        previewComponent={<img src={notification} alt="뉴스레터 알림" />}
        componentPosition="left"
      />
    </>
  );
};

export default LandingFeatures;

const MultipleImageWrapper = styled.div`
  position: relative;
`;

const CategoryImage = styled(ImageWithFallback)`
  position: absolute;
  top: 44%;
  left: 50%;
  width: 160px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);

  transform: translate(-50%, -50%);
`;

const NavBarImage = styled(ImageWithFallback)`
  position: absolute;
  top: 80%;
  left: 50%;
  width: 160px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);

  transform: translate(-50%, -50%);
`;
