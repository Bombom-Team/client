import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import MaeilMailEditModal from './MaeilMailEditModal';
import NewsletterUnsubscribeModal from './NewsletterUnsubscribeModal';
import { useUnsubscribeMaeilMailSubscriptionMutations } from '../../hooks/useUnsubscribeMaeilMailSubscriptionMutations';
import { useUpdateMaeilMailSubscriptionMutations } from '../../hooks/useUpdateMaeilMailSubscriptionMutations';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import type { SubscribedNewsletterResponse } from '@/apis/members/members.api';

interface MaeilMailSubscriptionCardProps {
  newsletter: SubscribedNewsletterResponse;
}

const MaeilMailSubscriptionCard = ({
  newsletter,
}: MaeilMailSubscriptionCardProps) => {
  const { data: subscription } = useQuery(
    queries.nativeMaeilMailSubscription(),
  );
  const { mutate: updateSubscription, isPending: isUpdatePending } =
    useUpdateMaeilMailSubscriptionMutations();
  const { mutate: removeSubscription, isPending: isRemovePending } =
    useUnsubscribeMaeilMailSubscriptionMutations();

  const {
    modalRef: editModalRef,
    openModal: openEditModal,
    closeModal: closeEditModal,
    isOpen: isEditOpen,
  } = useModal();

  const {
    modalRef: cancelModalRef,
    openModal: openCancelModal,
    closeModal: closeCancelModal,
    isOpen: isCancelOpen,
  } = useModal();

  return (
    <>
      <Container>
        <NewsletterContent>
          <NewsletterImage
            src={newsletter.imageUrl ?? ''}
            alt={newsletter.name}
            width={60}
            height={60}
          />
          <NewsletterInfo>
            <NewsletterName>{newsletter.name}</NewsletterName>
            <NewsletterDescription>
              {newsletter.description}
            </NewsletterDescription>
          </NewsletterInfo>
        </NewsletterContent>
        <ActionWrapper>
          <ActionButton variant="outlined" onClick={openEditModal}>
            수정
          </ActionButton>
          <ActionButton
            variant="filled"
            onClick={openCancelModal}
            disabled={isRemovePending}
          >
            구독 취소
          </ActionButton>
        </ActionWrapper>
      </Container>

      {createPortal(
        <Modal
          modalRef={editModalRef}
          closeModal={closeEditModal}
          isOpen={isEditOpen}
          showCloseButton={false}
        >
          <MaeilMailEditModal
            initialTracks={subscription?.tracks ?? []}
            isPending={isUpdatePending}
            onSave={(tracks) => {
              updateSubscription({ tracks });
              closeEditModal();
            }}
            onClose={closeEditModal}
          />
        </Modal>,
        document.body,
      )}

      {createPortal(
        <Modal
          modalRef={cancelModalRef}
          closeModal={closeCancelModal}
          isOpen={isCancelOpen}
          showCloseButton={false}
        >
          <NewsletterUnsubscribeModal
            type="UNSUBSCRIBE"
            onUnsubscribe={removeSubscription}
            onClose={closeCancelModal}
          />
        </Modal>,
        document.body,
      )}
    </>
  );
};

export default MaeilMailSubscriptionCard;

const Container = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  transition: all 0.2s ease-in-out;
`;

const NewsletterContent = styled.div`
  height: 72px;

  display: flex;
  gap: 12px;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 60px;
  height: 60px;
  border-radius: 8px;

  flex-shrink: 0;

  object-fit: cover;
`;

const NewsletterInfo = styled.div`
  overflow: hidden;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const NewsletterName = styled.h3`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  font-weight: 600;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NewsletterDescription = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ActionWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled(Button)`
  padding: 6px 10px;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t3Regular};

  &:disabled {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 1;
  }
`;
