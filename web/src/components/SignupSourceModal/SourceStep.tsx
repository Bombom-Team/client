import { Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import SourceIcon from './SourceIcon';
import { useAuth } from '@/contexts/AuthContext';
import { usePostSignupSourceMutation } from '@/hooks/usePostSignupSourceMutation';
import { trackSignupSourceEvent } from '@/utils/trackSignupSourceEvent';
import type { SignupSource } from '@/apis/signupSource/signupSource.api';

const SOURCE_OPTIONS: { source: SignupSource; label: string }[] = [
  { source: 'INSTAGRAM', label: '인스타그램' },
  { source: 'THREADS', label: '스레드' },
  { source: 'X', label: 'X' },
  { source: 'YOUTUBE', label: '유튜브' },
  { source: 'SEARCH', label: '검색' },
  { source: 'FRIEND', label: '지인 추천' },
  { source: 'BLOG_CAFE', label: '블로그·카페' },
  { source: 'NEWSLETTER', label: '다른 뉴스레터' },
  { source: 'APP_STORE', label: '앱 마켓' },
  { source: 'ETC', label: '기타' },
];

const DETAIL_MAX_LENGTH = 50;

interface SourceStepProps {
  onSaved: () => void;
}

const SourceStep = ({ onSaved }: SourceStepProps) => {
  const { userProfile } = useAuth();
  const [selectedSource, setSelectedSource] = useState<SignupSource | null>(
    null,
  );
  const [detail, setDetail] = useState('');
  const detailInputRef = useRef<HTMLInputElement>(null);
  const { mutate: saveSignupSource, isPending } = usePostSignupSourceMutation({
    onSuccess: () => {
      trackSignupSourceEvent({
        action: '가입 경로 저장',
        label: selectedSource ?? undefined,
      });
      onSaved();
    },
  });

  const isEtc = selectedSource === 'ETC';

  useEffect(() => {
    if (isEtc) detailInputRef.current?.focus();
  }, [isEtc]);
  const canSubmit =
    selectedSource !== null && (!isEtc || detail.trim() !== '') && !isPending;

  const handleSubmit = () => {
    if (!selectedSource) return;

    saveSignupSource({
      source: selectedSource,
      detail: isEtc ? detail.trim() : undefined,
    });
  };

  return (
    <Container>
      <Title>
        가입 완료!
        <br />
        {userProfile?.nickname}님 이메일이 생겼어요
      </Title>

      <MailCard>
        <MailLabel>BOMBOM MAIL</MailLabel>
        <MailAddress>{userProfile?.email}</MailAddress>
        <MailHint>구독한 뉴스레터가 모두 이 주소로 와요</MailHint>
      </MailCard>

      <QuestionSection>
        <Question>봄봄은 어디서 알게 되셨어요?</Question>
        <OptionGrid role="radiogroup" aria-label="가입 경로">
          {SOURCE_OPTIONS.map(({ source, label }) => {
            const isSelected = selectedSource === source;
            return (
              <OptionTile
                key={source}
                type="button"
                role="radio"
                aria-checked={isSelected}
                isSelected={isSelected}
                onClick={() => setSelectedSource(source)}
              >
                <IconBox isSelected={isSelected}>
                  <SourceIcon source={source} />
                </IconBox>
                {label}
              </OptionTile>
            );
          })}
        </OptionGrid>
        {isEtc && (
          <DetailInput
            ref={detailInputRef}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={DETAIL_MAX_LENGTH}
            placeholder="어디서 봤는지 알려주세요"
            aria-label="가입 경로 직접 입력"
          />
        )}
      </QuestionSection>

      <NextButton disabled={!canSubmit} onClick={handleSubmit}>
        다음
      </NextButton>
    </Container>
  );
};

export default SourceStep;

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t9Bold};
`;

const MailCard = styled.div`
  overflow: hidden;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 20px -12px rgb(254 94 4 / 70%);

  display: flex;
  gap: 4px;
  flex-direction: column;

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primaryBomBom} 0%,
    #ff8a3d 100%
  );
  color: ${({ theme }) => theme.colors.white};
`;

const MailLabel = styled.span`
  margin-bottom: 8px;

  font: ${({ theme }) => theme.fonts.t2Bold};
  letter-spacing: 0.14em;

  opacity: 0.85;
`;

const MailAddress = styled.strong`
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const MailHint = styled.span`
  font: ${({ theme }) => theme.fonts.t3Regular};
  opacity: 0.88;
`;

const QuestionSection = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Question = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const OptionGrid = styled.div`
  display: grid;
  gap: 8px;

  grid-template-columns: 1fr 1fr;
`;

const OptionTile = styled.button<{ isSelected: boolean }>`
  height: 48px;
  padding: 0 8px;
  border: none;
  border-radius: 16px;

  display: flex;
  gap: 8px;
  align-items: center;

  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primaryBomBom : theme.colors.backgroundHover};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
  text-align: left;
  white-space: nowrap;

  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.12s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const IconBox = styled.span<{ isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, isSelected }) =>
    isSelected ? 'rgb(255 255 255 / 22%)' : theme.colors.white};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.primaryBomBom};
`;

const DetailInput = styled.input`
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 52px;
  border-radius: 12px;

  font: ${({ theme }) => theme.fonts.t7Bold};
`;
