import WaitingState from './WaitingState';
import type { QueueEntry } from '@/apis/event/event.api';

interface QueueStatusProps {
  queueData: QueueEntry | undefined;
}

const QueueStatus = ({ queueData }: QueueStatusProps) => {
  if (!queueData || queueData.status === 'NOT_IN_QUEUE') {
    return null;
  }

  switch (queueData.status) {
    case 'WAITING':
      return <WaitingState queueData={queueData} />;

    default:
      return null;
  }
};

export default QueueStatus;
