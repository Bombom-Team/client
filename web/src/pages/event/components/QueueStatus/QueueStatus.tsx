import IssuedState from './IssuedState';
import ReadyState from './ReadyState';
import SoldOutState from './SoldOutState';
import WaitingState from './WaitingState';
import { QUEUE_STATUS_TYPE } from '../../constants/constants';
import type { QueueEntry } from '@/apis/event/event.api';

interface QueueStatusProps {
  queueEntry: QueueEntry | undefined;
}

const QueueStatus = ({ queueEntry }: QueueStatusProps) => {
  if (!queueEntry || queueEntry.status === QUEUE_STATUS_TYPE.unregistered) {
    return null;
  }

  switch (queueEntry.status) {
    case QUEUE_STATUS_TYPE.waiting:
      return <WaitingState queueEntry={queueEntry} />;

    case QUEUE_STATUS_TYPE.ready:
      return <ReadyState queueEntry={queueEntry} />;

    case QUEUE_STATUS_TYPE.issued:
      return <IssuedState />;

    case QUEUE_STATUS_TYPE.soldOut:
      return <SoldOutState />;

    default:
      return null;
  }
};

export default QueueStatus;
