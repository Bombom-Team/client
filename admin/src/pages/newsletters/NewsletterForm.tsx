import styled from '@emotion/styled';
import { useState } from 'react';
import { Button } from '@/components/Button';
import {
  NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  type NewsletterPreviousStrategy,
} from '@/types/newsletter';

export type NewsletterFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  email: string;
  category: string;
  mainPageUrl: string;
  subscribeUrl: string;
  issueCycle: string;
  sender: string;
  previousNewsletterUrl: string;
  subscribeMethod: string;
  previousAllowed: '' | 'true' | 'false';
  previousStrategy: NewsletterPreviousStrategy | '';
  previousFixedCount: string;
  previousRecentCount: string;
  previousExposureRatio: string;
};

interface NewsletterFormProps {
  mode: 'create' | 'edit';
  initialValues: NewsletterFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: NewsletterFormValues) => void;
  onCancel: () => void;
}

const NewsletterForm = ({
  mode,
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: NewsletterFormProps) => {
  const [values, setValues] = useState<NewsletterFormValues>(initialValues);

  const requiredFields: Array<{ key: keyof NewsletterFormValues; label: string }> =
    [
      { key: 'name', label: '뉴스레터 이름' },
      { key: 'description', label: '설명' },
      { key: 'imageUrl', label: '이미지 URL' },
      { key: 'email', label: '이메일' },
      { key: 'category', label: '카테고리' },
      { key: 'mainPageUrl', label: '메인 페이지' },
      { key: 'subscribeUrl', label: '구독 URL' },
      { key: 'issueCycle', label: '발행 주기' },
      { key: 'sender', label: '발신자' },
    ];

  const validateRequiredFields = () => {
    const missingField = requiredFields.find((field) => {
      const value = values[field.key];
      return typeof value === 'string' && value.trim().length === 0;
    });

    if (missingField) {
      alert(`${missingField.label}을(를) 입력해주세요.`);
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateRequiredFields()) return;
    onSubmit(values);
  };

  const previousStrategyOptions = Object.entries(
    NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  ).map(([value, label]) => ({
    value: value as NewsletterPreviousStrategy,
    label,
  }));

  return (
    <Form onSubmit={handleSubmit}>
      <SectionTitle>기본 정보</SectionTitle>
      <FieldGroup>
        <Label htmlFor="name">뉴스레터 이름</Label>
        <Input
          id="name"
          type="text"
          value={values.name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="imageUrl">이미지 URL</Label>
        <Input
          id="imageUrl"
          type="text"
          value={values.imageUrl}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, imageUrl: event.target.value }))
          }
        />
      </FieldGroup>
      <FieldRow>
        <FieldGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="sender">발신자</Label>
          <Input
            id="sender"
            type="text"
            value={values.sender}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, sender: event.target.value }))
            }
          />
        </FieldGroup>
      </FieldRow>
      <FieldRow>
        <FieldGroup>
          <Label htmlFor="category">카테고리</Label>
          <Input
            id="category"
            type="text"
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, category: event.target.value }))
            }
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="issueCycle">발행 주기</Label>
          <Input
            id="issueCycle"
            type="text"
            placeholder="예: 매주 월요일"
            value={values.issueCycle}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, issueCycle: event.target.value }))
            }
          />
        </FieldGroup>
      </FieldRow>

      <SectionTitle>구독 정보</SectionTitle>
      <FieldGroup>
        <Label htmlFor="mainPageUrl">메인 페이지</Label>
        <Input
          id="mainPageUrl"
          type="text"
          value={values.mainPageUrl}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, mainPageUrl: event.target.value }))
          }
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="subscribeUrl">구독 URL</Label>
        <Input
          id="subscribeUrl"
          type="text"
          value={values.subscribeUrl}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, subscribeUrl: event.target.value }))
          }
        />
      </FieldGroup>
      <FieldRow>
        <FieldGroup>
          <Label htmlFor="subscribeMethod">구독 방법</Label>
          <Input
            id="subscribeMethod"
            type="text"
            value={values.subscribeMethod}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, subscribeMethod: event.target.value }))
            }
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="previousNewsletterUrl">지난호 URL</Label>
          <Input
            id="previousNewsletterUrl"
            type="text"
            value={values.previousNewsletterUrl}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                previousNewsletterUrl: event.target.value,
              }))
            }
          />
        </FieldGroup>
      </FieldRow>

      {mode === 'edit' && (
        <>
          <SectionTitle>지난호 설정</SectionTitle>
          <FieldRow>
            <FieldGroup>
              <Label htmlFor="previousAllowed">지난호 노출 여부</Label>
              <Select
                id="previousAllowed"
                value={values.previousAllowed}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    previousAllowed: event.target.value as
                      | ''
                      | 'true'
                      | 'false',
                  }))
                }
              >
                <option value="">선택 안함</option>
                <option value="true">노출</option>
                <option value="false">미노출</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="previousStrategy">지난호 전략</Label>
              <Select
                id="previousStrategy"
                value={values.previousStrategy}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    previousStrategy: event.target.value as
                      | NewsletterPreviousStrategy
                      | '',
                  }))
                }
              >
                <option value="">선택 안함</option>
                {previousStrategyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          </FieldRow>
          <FieldRow>
            <FieldGroup>
              <Label htmlFor="previousFixedCount">고정 노출 수</Label>
              <Input
                id="previousFixedCount"
                type="number"
                min={0}
                value={values.previousFixedCount}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    previousFixedCount: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="previousRecentCount">최근 노출 수</Label>
              <Input
                id="previousRecentCount"
                type="number"
                min={0}
                value={values.previousRecentCount}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    previousRecentCount: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="previousExposureRatio">노출 비율(%)</Label>
              <Input
                id="previousExposureRatio"
                type="number"
                min={0}
                value={values.previousExposureRatio}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    previousExposureRatio: event.target.value,
                  }))
                }
              />
            </FieldGroup>
          </FieldRow>
        </>
      )}

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? `${submitLabel} 중...` : submitLabel}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default NewsletterForm;

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray800};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const FieldRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const FieldGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  min-height: 160px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;
