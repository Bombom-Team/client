import Button from '@/components/Button/Button';
import ShareIcon from '#/assets/svg/share.svg';

const ShareButton = () => {
  return (
    <Button variant="outlined" onClick={() => {}}>
      <ShareIcon width={16} height={16} />글 공유하기
    </Button>
  );
};

export default ShareButton;
