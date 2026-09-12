import styled from '@emotion/styled';
import { INSTAGRAM_URL } from '@/constants/socialLinks';
import { openExternalLink } from '@/utils/externalLink';
import instagramPromotion from '#/assets/avif/instagram-promotion.avif';

const handleInstagramPromotionClick = () => {
  openExternalLink(INSTAGRAM_URL);
};

const InstagramPromotionBanner = () => {
  return (
    <Container onClick={handleInstagramPromotionClick}>
      <img src={instagramPromotion} alt="봄봄 인스타그램 바로가기" />
    </Container>
  );
};

export default InstagramPromotionBanner;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 24px;

  cursor: pointer;

  > img {
    width: 100%;
    height: 100%;

    object-fit: contain;
  }
`;
