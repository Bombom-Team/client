import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import { calculateRate } from '@/utils/math';

interface StorageUsageBarProps {
  cur: number;
  max: number;
}

const StorageUsageBar = ({ cur, max }: StorageUsageBarProps) => {
  const rate = calculateRate(cur, max);

  return (
    <ProgressBar
      rate={rate}
      caption={`보관함 사용량 ${cur} / ${max}`}
      variant="rounded"
    />
  );
};

export default StorageUsageBar;
