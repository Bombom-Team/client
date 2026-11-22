import styled from '@emotion/styled';
import type { SignupRecommendation } from '@/apis/signupSource/signupSource.api';
import type { KeyboardEvent } from 'react';
import CalendarIcon from '#/assets/svg/calendar.svg';

interface RecommendItemProps {
  newsletter: SignupRecommendation;
  isExpanded: boolean;
  isOpened: boolean;
  isFocusable: boolean;
  onExpand: () => void;
  onSubscribe: () => void;
}

const RecommendItem = ({
  newsletter,
  isExpanded,
  isOpened,
  isFocusable,
  onExpand,
  onSubscribe,
}: RecommendItemProps) => {
  const tabIndex = isFocusable ? 0 : -1;

  const handleHeadKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onExpand();
  };

  return (
    <Container isExpanded={isExpanded}>
      <Head
        role="button"
        tabIndex={tabIndex}
        aria-expanded={isExpanded}
        isExpanded={isExpanded}
        onClick={onExpand}
        onKeyDown={handleHeadKeyDown}
      >
        <Logo
          src={newsletter.imageUrl ?? ''}
          alt={`${newsletter.name} 로고`}
          isExpanded={isExpanded}
          draggable={false}
        />
        <Meta isExpanded={isExpanded}>
          <NameRow>
            <Name>{newsletter.name}</Name>
            {isOpened && <OpenedBadge>열어봤어요</OpenedBadge>}
          </NameRow>
          <SubInfo>
            {newsletter.arrivalDays && (
              <>
                <ArrivalDays>
                  <CalendarIcon width={12} height={12} />
                  {newsletter.arrivalDays}
                </ArrivalDays>
                {' · '}
              </>
            )}
            <SubscriberCount>{newsletter.subscriberCount}명</SubscriberCount>{' '}
            구독 중
          </SubInfo>
        </Meta>
        <MiniSubscribeButton
          type="button"
          tabIndex={isExpanded ? -1 : tabIndex}
          aria-hidden={isExpanded}
          isHidden={isExpanded}
          onClick={(e) => {
            e.stopPropagation();
            onSubscribe();
          }}
        >
          구독
        </MiniSubscribeButton>
      </Head>
      <Body isExpanded={isExpanded}>
        <BodyInner>
          <BodyContent isExpanded={isExpanded}>
            <Description>{newsletter.description}</Description>
            <SubscribeButton
              type="button"
              tabIndex={isExpanded ? tabIndex : -1}
              onClick={onSubscribe}
            >
              구독
            </SubscribeButton>
          </BodyContent>
        </BodyInner>
      </Body>
    </Container>
  );
};

export default RecommendItem;

const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const Container = styled.div<{ isExpanded: boolean }>`
  border: 1px solid
    ${({ theme, isExpanded }) =>
      isExpanded ? theme.colors.primaryLight : 'transparent'};
  border-radius: 16px;

  background-color: ${({ theme, isExpanded }) =>
    isExpanded ? theme.colors.primaryInfo : 'transparent'};

  transition:
    background-color 0.32s ease,
    border-color 0.32s ease;
`;

const Head = styled.div<{ isExpanded: boolean }>`
  position: relative;
  padding: ${({ isExpanded }) => (isExpanded ? '12px 12px 8px' : '8px')};
  border-radius: 16px;

  display: grid;
  gap: 12px;
  align-items: center;

  cursor: ${({ isExpanded }) => (isExpanded ? 'default' : 'pointer')};
  grid-template-columns: auto minmax(0, 1fr);
  transition: padding 0.32s ${EASE};

  &:hover {
    background-color: ${({ theme, isExpanded }) =>
      isExpanded ? 'transparent' : theme.colors.backgroundHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 1px;
  }
`;

const Logo = styled.img<{ isExpanded: boolean }>`
  width: ${({ isExpanded }) => (isExpanded ? '44px' : '36px')};
  height: ${({ isExpanded }) => (isExpanded ? '44px' : '36px')};
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: ${({ isExpanded }) => (isExpanded ? '12px' : '8px')};

  background-color: ${({ theme }) => theme.colors.white};

  object-fit: contain;
  pointer-events: none;
  transition:
    width 0.32s ${EASE},
    height 0.32s ${EASE},
    border-radius 0.32s ease;
`;

const Meta = styled.div<{ isExpanded: boolean }>`
  min-width: 0;
  padding-right: ${({ isExpanded }) => (isExpanded ? '0' : '64px')};

  display: flex;
  gap: 4px;
  flex-direction: column;

  transition: padding-right 0.32s ${EASE};
`;

const NameRow = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  align-items: center;
`;

const Name = styled.strong`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const OpenedBadge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t1Bold};
`;

const SubInfo = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const ArrivalDays = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const SubscriberCount = styled.em`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t3Bold};
  font-style: normal;
`;

const MiniSubscribeButton = styled.button<{ isHidden: boolean }>`
  position: absolute;
  top: 50%;
  right: 8px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t4Bold};

  cursor: pointer;
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  pointer-events: ${({ isHidden }) => (isHidden ? 'none' : 'auto')};
  transform: translateY(-50%) scale(${({ isHidden }) => (isHidden ? 0.85 : 1)});
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
`;

const Body = styled.div<{ isExpanded: boolean }>`
  display: grid;

  grid-template-rows: ${({ isExpanded }) => (isExpanded ? '1fr' : '0fr')};

  transition: grid-template-rows 0.34s ${EASE};
`;

const BodyInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const BodyContent = styled.div<{ isExpanded: boolean }>`
  padding: 0 12px 12px;

  display: flex;
  gap: 8px;
  flex-direction: column;

  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  transform: translateY(${({ isExpanded }) => (isExpanded ? '0' : '-4px')});
  transition:
    opacity 0.28s ease ${({ isExpanded }) => (isExpanded ? '0.08s' : '0s')},
    transform 0.34s ${EASE};
`;

const Description = styled.p`
  overflow: hidden;
  margin: 0;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const SubscribeButton = styled.button`
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t5Bold};

  cursor: pointer;
`;
