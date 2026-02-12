import WaitingState from './WaitingState';
import type { QueueEntry } from '@/apis/event/event.api';

interface QueueStatusProps {
  queueEntry: QueueEntry | undefined;
}

const QueueStatus = ({ queueEntry }: QueueStatusProps) => {
  if (!queueEntry || queueEntry.status === 'NOT_IN_QUEUE') {
    return null;
  }

  switch (queueEntry.status) {
    case 'WAITING':
      return <WaitingState queueData={queueEntry} />;

    default:
      return null;
  }
};

export default QueueStatus;
