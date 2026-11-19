import styled from '@emotion/styled';
import {
  createFileRoute,
  Outlet,
  useMatches,
  useNavigate,
} from '@tanstack/react-router';

type SupportTab = 'FAQ' | 'INQUIRY';

export const Route = createFileRoute('/_bombom/_main/support')({
  component: SupportLayout,
});

function SupportLayout() {
  const navigate = useNavigate();
  const matches = useMatches();
  const isInquiryTabActive = matches.some((match) =>
    match.pathname.startsWith('/support/inquiry'),
  );
  const activeTab: SupportTab = isInquiryTabActive ? 'INQUIRY' : 'FAQ';

  const handleTabSelect = (tab: SupportTab) => {
    if (tab === activeTab) return;
    navigate({ to: tab === 'FAQ' ? '/support' : '/support/inquiry' });
  };

  return (
    <Container>
      <Title>고객센터</Title>

      <TabList role="tablist">
        <TabButton
          type="button"
          role="tab"
          aria-selected={activeTab === 'FAQ'}
          selected={activeTab === 'FAQ'}
          onClick={() => handleTabSelect('FAQ')}
        >
          FAQ
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={activeTab === 'INQUIRY'}
          selected={activeTab === 'INQUIRY'}
          onClick={() => handleTabSelect('INQUIRY')}
        >
          1:1 문의하기
        </TabButton>
      </TabList>

      <Outlet />
    </Container>
  );
}

const Container = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const TabList = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: 24px;
`;

const TabButton = styled.button<{ selected: boolean }>`
  margin-bottom: -1px;
  padding: 12px 4px;
  border-bottom: 2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primaryBomBom : 'transparent'};

  color: ${({ selected, theme }) =>
    selected ? theme.colors.textPrimary : theme.colors.textSecondary};
  font: ${({ selected, theme }) =>
    selected ? theme.fonts.t6Bold : theme.fonts.t6Regular};

  transition:
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
