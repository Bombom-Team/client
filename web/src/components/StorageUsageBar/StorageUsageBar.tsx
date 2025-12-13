import ProgressBar from '../ProgressBar/ProgressBar';

interface StorageUsageBarProps {
  cur: number;
  max: number;
}

const StorageUsageBar = ({ cur, max }: StorageUsageBarProps) => {
  const rate = Math.min(Math.round((cur / max) * 100), 100);

  return (
    <ProgressBar
      rate={rate}
      caption={`보관함 사용량 ${cur} / ${max}`}
      variant="rounded"
    />
  );
};

export default StorageUsageBar;
