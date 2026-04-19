import { ApiError } from '@bombom/shared/apis';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  unsubscribePatternsQueries,
  useCreateUnsubscribePatternMutation,
  useUpdateUnsubscribePatternMutation,
} from '@/apis/unsubscribePatterns/unsubscribePatterns.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/resources/unsubscribe-pattern')({
  component: UnsubscribePatternPage,
});

const splitPatternValue = (value: string, delimiter: '|' | '?' | ',') => {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(delimiter)
    .map((token) => token.trim())
    .filter(Boolean);
};

const detectDelimiter = (value: string) => {
  const counts = {
    '|': (value.match(/\|/g) ?? []).length,
    '?': (value.match(/\?/g) ?? []).length,
    ',': (value.match(/,/g) ?? []).length,
  };

  const nextDelimiter = Object.entries(counts).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  if (!['|', '?', ','].includes(nextDelimiter)) {
    return '|';
  }

  return nextDelimiter as '|' | '?' | ',';
};

const PATTERN_KEY_GUIDES: Record<
  string,
  { label: string; description: string }
> = {
  'unsubscribe-pattern': {
    label: '해지 액션 감지',
    description:
      '구독 해지 페이지에서 실제 "해지하기" 버튼이나 링크를 찾기 위한 Selector 패턴입니다.',
  },
  'success-pattern': {
    label: '성공 상태 감지',
    description:
      '구독 해지가 성공적으로 처리되었을 때 나타나는 완료 메시지/요소를 감지하는 패턴입니다.',
  },
  'already-unsubscribed-pattern': {
    label: '기 처리 상태 감지',
    description:
      '이미 구독이 해지된 상태이거나, 이미 처리된 페이지임을 식별하기 위한 패턴입니다.',
  },
  'error-pattern': {
    label: '오류 상태 감지',
    description:
      '구독 해지 과정 중 페이지 내 오류 메시지가 발생했는지 확인하기 위한 패턴입니다.',
  },
  'ad-domains': {
    label: '광고/트래커 차단',
    description:
      '페이지 로딩 속도를 높이고 자동화 간섭을 줄이기 위해 로딩을 차단할 광고/트래커 도메인 리스트입니다.',
  },
};

const PATTERN_KEY_DELIMITER_OVERRIDES: Partial<
  Record<keyof typeof PATTERN_KEY_GUIDES, '|' | '?' | ','>
> = {
  'already-unsubscribed-pattern': '|',
};

function UnsubscribePatternPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, isFetching } = useQuery(
    unsubscribePatternsQueries.list(),
  );
  const { mutateAsync: createPatternMutation, isPending: isCreatePending } =
    useCreateUnsubscribePatternMutation();
  const { mutateAsync: updatePatternMutation, isPending: isUpdatePending } =
    useUpdateUnsubscribePatternMutation();

  const [newPatternKey, setNewPatternKey] = useState('');
  const [newPatternDelimiter, setNewPatternDelimiter] = useState<'|' | ','>(
    '|',
  );
  const [newTokenInput, setNewTokenInput] = useState('');
  const [newTokens, setNewTokens] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [patternValues, setPatternValues] = useState<Record<number, string>>(
    {},
  );
  const [patternDelimiters, setPatternDelimiters] = useState<
    Record<number, '|' | '?' | ','>
  >({});
  const [tokenInputs, setTokenInputs] = useState<Record<number, string>>({});
  const [editingPatternId, setEditingPatternId] = useState<number | null>(null);
  const createPatternPreview = useMemo(
    () => newTokens.join(newPatternDelimiter),
    [newPatternDelimiter, newTokens],
  );

  const errorMessage =
    error instanceof ApiError
      ? `조회 실패 (${error.status}): ${error.message}`
      : `조회 실패: ${(error as Error)?.message ?? '알 수 없는 오류'}`;

  useEffect(() => {
    if (!data) return;

    const nextValues = data.reduce<Record<number, string>>((acc, pattern) => {
      if (pattern.id) acc[pattern.id] = pattern.patternValue ?? '';
      return acc;
    }, {});
    const nextDelimiters = data.reduce<Record<number, '|' | '?' | ','>>(
      (acc, pattern) => {
        if (pattern.id) {
          const key = pattern.patternKey as keyof typeof PATTERN_KEY_GUIDES;
          acc[pattern.id] =
            PATTERN_KEY_DELIMITER_OVERRIDES[key] ??
            detectDelimiter(pattern.patternValue ?? '');
        }
        return acc;
      },
      {},
    );

    setPatternValues(nextValues);
    setPatternDelimiters(nextDelimiters);
  }, [data]);

  const tokensById = useMemo(() => {
    return Object.entries(patternValues).reduce<Record<number, string[]>>(
      (acc, [id, value]) => {
        const numericId = Number(id);
        const delimiter = patternDelimiters[numericId] ?? '|';
        acc[numericId] = splitPatternValue(value, delimiter);
        return acc;
      },
      {},
    );
  }, [patternDelimiters, patternValues]);

  const originalValuesById = useMemo(() => {
    return (data ?? []).reduce<Record<number, string>>((acc, pattern) => {
      if (pattern.id) {
        acc[pattern.id] = pattern.patternValue ?? '';
      }
      return acc;
    }, {});
  }, [data]);

  const handleAddCreateToken = () => {
    const token = newTokenInput.trim();
    if (!token) return;
    setNewTokens((prev) => [...prev, token]);
    setNewTokenInput('');
  };

  const handleRemoveCreateToken = (index: number) => {
    setNewTokens((prev) =>
      prev.filter((_, tokenIndex) => tokenIndex !== index),
    );
  };

  const handleCreateClick = async () => {
    if (!newPatternKey.trim() || newTokens.length === 0) {
      alert('patternKey와 최소 1개 이상의 토큰을 입력해주세요.');
      return;
    }

    try {
      await createPatternMutation({
        patternKey: newPatternKey.trim(),
        patternValue: newTokens.join(newPatternDelimiter),
      });
      setNewPatternKey('');
      setNewPatternDelimiter('|');
      setNewTokenInput('');
      setNewTokens([]);
      setIsCreateModalOpen(false);
      await queryClient.invalidateQueries({
        queryKey: unsubscribePatternsQueries.list().queryKey,
      });
      alert('패턴이 추가되었습니다.');
    } catch (saveError) {
      const saveErrorMessage =
        saveError instanceof ApiError
          ? `추가 실패 (${saveError.status}): ${saveError.message}`
          : `추가 실패: ${(saveError as Error)?.message ?? '알 수 없는 오류'}`;
      alert(saveErrorMessage);
    }
  };

  const handleAddPatternToken = (id: number) => {
    const token = (tokenInputs[id] ?? '').trim();
    if (!token) return;

    const delimiter = patternDelimiters[id] ?? '|';
    const nextTokens = [...(tokensById[id] ?? []), token];
    setPatternValues((prev) => ({
      ...prev,
      [id]: nextTokens.join(delimiter),
    }));
    setTokenInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const handleRemovePatternToken = (id: number, index: number) => {
    const delimiter = patternDelimiters[id] ?? '|';
    const nextTokens = (tokensById[id] ?? []).filter(
      (_, tokenIndex) => tokenIndex !== index,
    );

    setPatternValues((prev) => ({
      ...prev,
      [id]: nextTokens.join(delimiter),
    }));
  };

  const handleUpdateClick = async (id: number) => {
    const nextValue = patternValues[id] ?? '';

    if (!nextValue.trim()) {
      alert('patternValue는 비워둘 수 없습니다.');
      return;
    }

    try {
      await updatePatternMutation({
        id,
        patternValue: nextValue.trim(),
      });
      await queryClient.invalidateQueries({
        queryKey: unsubscribePatternsQueries.list().queryKey,
      });
      setEditingPatternId(null);
      alert('패턴이 수정되었습니다.');
    } catch (saveError) {
      const saveErrorMessage =
        saveError instanceof ApiError
          ? `수정 실패 (${saveError.status}): ${saveError.message}`
          : `수정 실패: ${(saveError as Error)?.message ?? '알 수 없는 오류'}`;
      alert(saveErrorMessage);
    }
  };

  const handleEditStart = (id: number) => {
    setPatternValues((prev) => ({
      ...prev,
      [id]: originalValuesById[id] ?? '',
    }));
    setTokenInputs((prev) => ({ ...prev, [id]: '' }));
    setEditingPatternId(id);
  };

  const handleEditCancel = (id: number) => {
    setPatternValues((prev) => ({
      ...prev,
      [id]: originalValuesById[id] ?? '',
    }));
    setTokenInputs((prev) => ({ ...prev, [id]: '' }));
    setEditingPatternId(null);
  };

  const handleRestoreOriginal = async (id: number) => {
    try {
      const patternDetail = await queryClient.fetchQuery(
        unsubscribePatternsQueries.detail(id),
      );
      setPatternValues((prev) => ({
        ...prev,
        [id]: patternDetail.patternValue ?? '',
      }));
      setTokenInputs((prev) => ({ ...prev, [id]: '' }));
    } catch (restoreError) {
      const restoreErrorMessage =
        restoreError instanceof ApiError
          ? `원상 복구 실패 (${restoreError.status}): ${restoreError.message}`
          : `원상 복구 실패: ${(restoreError as Error)?.message ?? '알 수 없는 오류'}`;
      alert(restoreErrorMessage);
    }
  };

  return (
    <Layout title="리소스 관리">
      <Container>
        <HeaderBox>
          <Title>구독 자동 취소 패턴</Title>
          <Description>
            토큰을 추가/삭제해 패턴을 관리합니다. 저장 시 기존 구분자는 그대로
            유지됩니다.
          </Description>
          <GuideTipBox>
            <strong>패턴 작성 가이드</strong>
            <GuideTipList>
              <GuideTipItem>
                <code>.?</code> 는 사이에 한 글자가 있을 수도, 없을 수도 있다는
                뜻입니다. 예) <code>no.?longer</code> 는 <code>nolonger</code>,{' '}
                <code>no longer</code>, <code>no-longer</code>를 모두 매칭할 수
                있습니다.
              </GuideTipItem>
              <GuideTipItem>
                토큰은 <code>의미 단위</code>로 추가하세요. 너무 짧은 토큰(한
                글자, 조사만 포함 등)은 오탐 가능성이 높습니다.
              </GuideTipItem>
              <GuideTipItem>
                유사 표현은 <code>토큰을 따로</code> 추가해야 합니다. 한 토큰은
                OR 조건으로 동작하므로, 완료 상태를 의미하는 문구를 여러 개 넣어
                누락을 줄입니다.
              </GuideTipItem>
              <GuideTipItem>
                저장 전 하단의 <code>원본 문자열 미리보기</code>를 확인해서
                의도한 패턴이 정확히 조합됐는지 점검하세요.
              </GuideTipItem>
            </GuideTipList>
          </GuideTipBox>
        </HeaderBox>

        <ListSection>
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderText>패턴 목록</ListHeaderText>
            </ListHeaderLeft>
            <ListHeaderRight>
              <ListSubText>{isFetching ? '새로고침 중...' : null}</ListSubText>
              <Button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(true);
                }}
              >
                추가
              </Button>
            </ListHeaderRight>
          </ListHeader>
          {isLoading ? <StateText>로딩 중...</StateText> : null}
          {isError ? <ErrorText>{errorMessage}</ErrorText> : null}
          {!isError && !isLoading ? (
            <PatternList>
              {(data ?? []).map((pattern) => {
                const id = pattern.id;
                const key = pattern.patternKey ?? '-';
                const value = id ? (patternValues[id] ?? '') : '';
                const delimiter = id ? (patternDelimiters[id] ?? '|') : '|';
                const tokens = id ? (tokensById[id] ?? []) : [];
                const guide = PATTERN_KEY_GUIDES[key];
                const isEditing = id ? editingPatternId === id : false;

                return (
                  <PatternCard key={id ?? key}>
                    <PatternHeader>
                      <PatternId>#{id ?? '-'}</PatternId>
                      <PatternKeyBadge>{key}</PatternKeyBadge>
                      {id ? (
                        <DelimiterText>
                          구분자 고정: <code>{delimiter}</code>
                        </DelimiterText>
                      ) : null}
                    </PatternHeader>
                    <PatternGuideBox>
                      <PatternGuideLabel>
                        탐지 목적 · {guide?.label ?? '커스텀 규칙'}
                      </PatternGuideLabel>
                      <PatternGuideDescription>
                        {guide?.description ??
                          '커스텀 패턴 키입니다. 운영 정책에 맞는 토큰을 관리하세요.'}
                      </PatternGuideDescription>
                    </PatternGuideBox>
                    {id ? (
                      <>
                        <TokenHint>토큰 {tokens.length}개</TokenHint>
                        {isEditing ? (
                          <TokenInputRow>
                            <Input
                              value={tokenInputs[id] ?? ''}
                              onChange={(e) => {
                                setTokenInputs((prev) => ({
                                  ...prev,
                                  [id]: e.target.value,
                                }));
                              }}
                              placeholder="토큰 입력"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddPatternToken(id);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                handleAddPatternToken(id);
                              }}
                            >
                              토큰 추가
                            </Button>
                          </TokenInputRow>
                        ) : null}
                        <TokenList>
                          {tokens.map((token, index) => (
                            <TokenChip key={`${id}-${token}-${index}`}>
                              <span>{token}</span>
                              {isEditing ? (
                                <TokenDeleteButton
                                  type="button"
                                  onClick={() => {
                                    handleRemovePatternToken(id, index);
                                  }}
                                >
                                  ×
                                </TokenDeleteButton>
                              ) : null}
                            </TokenChip>
                          ))}
                        </TokenList>
                        <RawValueBox>{value}</RawValueBox>
                      </>
                    ) : (
                      <PatternEmpty>patternValue가 없습니다.</PatternEmpty>
                    )}
                    <PatternActions>
                      {id ? (
                        isEditing ? (
                          <ActionButtonsBox>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                void handleRestoreOriginal(id);
                              }}
                              disabled={isUpdatePending}
                            >
                              원상 복구
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                handleEditCancel(id);
                              }}
                              disabled={isUpdatePending}
                            >
                              취소
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                void handleUpdateClick(id);
                              }}
                              disabled={isUpdatePending}
                            >
                              저장
                            </Button>
                          </ActionButtonsBox>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              handleEditStart(id);
                            }}
                            disabled={
                              isUpdatePending ||
                              (editingPatternId !== null &&
                                editingPatternId !== id)
                            }
                          >
                            수정하기
                          </Button>
                        )
                      ) : null}
                    </PatternActions>
                  </PatternCard>
                );
              })}
            </PatternList>
          ) : null}
        </ListSection>

        {isCreateModalOpen ? (
          <ModalBackdrop
            role="button"
            tabIndex={0}
            aria-label="create-pattern-modal-backdrop"
            onClick={() => {
              setIsCreateModalOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsCreateModalOpen(false);
              }
            }}
          >
            <ModalCard
              role="dialog"
              aria-modal="true"
              aria-label="패턴 추가 모달"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ModalHeader>
                <CreateTitle>패턴 추가</CreateTitle>
              </ModalHeader>
              <CreateForm>
                <Input
                  value={newPatternKey}
                  onChange={(e) => {
                    setNewPatternKey(e.target.value);
                  }}
                  placeholder="patternKey"
                />
                <DelimiterSelect
                  value={newPatternDelimiter}
                  onChange={(e) => {
                    setNewPatternDelimiter(e.target.value as '|' | ',');
                  }}
                >
                  <option value="|">
                    람다에서 OR 패턴으로 검사할 값 (구분자: |)
                  </option>
                  <option value=",">
                    람다에 목록(List)으로 전달할 값 (구분자: ,)
                  </option>
                </DelimiterSelect>
                <PreviewLabel>
                  OR 조건으로 문자열 매칭이면 <code>|</code>, 목록 데이터로
                  순회/비교할 값이면 <code>,</code>를 선택하세요.
                </PreviewLabel>
                <TokenInputRow>
                  <Input
                    value={newTokenInput}
                    onChange={(e) => {
                      setNewTokenInput(e.target.value);
                    }}
                    placeholder="토큰 입력"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCreateToken();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddCreateToken}
                  >
                    토큰 추가
                  </Button>
                </TokenInputRow>
                <TokenList>
                  {newTokens.map((token, index) => (
                    <TokenChip key={`${token}-${index}`}>
                      <span>{token}</span>
                      <TokenDeleteButton
                        type="button"
                        onClick={() => {
                          handleRemoveCreateToken(index);
                        }}
                      >
                        ×
                      </TokenDeleteButton>
                    </TokenChip>
                  ))}
                </TokenList>
                <PreviewLabel>원본 문자열 미리보기</PreviewLabel>
                <RawValueBox>{createPatternPreview || '-'}</RawValueBox>
              </CreateForm>
              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                  }}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    void handleCreateClick();
                  }}
                  disabled={isCreatePending}
                >
                  {isCreatePending ? '추가 중...' : '추가'}
                </Button>
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        ) : null}
      </Container>
    </Layout>
  );
}

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const HeaderBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Description = styled.p`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const GuideTipBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;

  background: #fffbeb;
  color: #78350f;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const GuideTipList = styled.ul`
  margin: 0;
  padding-left: 18px;

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const GuideTipItem = styled.li`
  line-height: 1.5;
`;

const CreateTitle = styled.h4`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const CreateForm = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DelimiterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TokenInputRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  grid-template-columns: 1fr 120px;
`;

const TokenList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const TokenChip = styled.span`
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  gap: 6px;
  align-items: center;

  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const TokenDeleteButton = styled.button`
  border: none;

  background: transparent;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;

  cursor: pointer;
`;

const ListSection = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const ListHeader = styled.div`
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ListHeaderLeft = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const ListHeaderRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const ListHeaderText = styled.h4`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ListSubText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PatternList = styled.div`
  padding: 0;

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const PatternCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const PatternHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const PatternId = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PatternKeyBadge = styled.span`
  padding: 2px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  align-items: center;

  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.base};

  word-break: break-all;
`;

const DelimiterText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const TokenHint = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PreviewLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PatternGuideBox = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid #dbeafe;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
  gap: 2px;
  flex-direction: column;

  background: #eff6ff;
`;

const PatternGuideLabel = styled.span`
  color: #1e3a8a;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const PatternGuideDescription = styled.span`
  color: #1f2937;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.4;
`;

const PatternEmpty = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RawValueBox = styled.code`
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: block;

  color: ${({ theme }) => theme.colors.gray600};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;

  word-break: break-all;
`;

const PatternActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionButtonsBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StateText = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ErrorText = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(17 24 39 / 45%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(720px, calc(100vw - 32px));
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const ModalHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
