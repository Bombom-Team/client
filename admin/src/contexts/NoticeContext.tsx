import { createContext, useContext, useState, useCallback } from 'react';
import type { Notice } from '@/types/notice';
import type { ReactNode } from 'react';

interface NoticeContextValue {
  notices: Notice[];
  getNotice: (id: number) => Notice | undefined;
  createNotice: (title: string, content: string) => void;
  deleteNotice: (id: number) => void;
  updateNotice: (id: number, title: string, content: string) => void;
}

const NoticeContext = createContext<NoticeContextValue | undefined>(undefined);

const initialNotices: Notice[] = [
  {
    id: 1,
    title: '서비스 점검 안내',
    content:
      '안녕하세요. BomBom 팀입니다.\n\n12월 20일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다.\n점검 시간 동안 서비스 이용이 일시적으로 중단될 수 있습니다.\n\n더 나은 서비스를 제공하기 위한 점검이오니 양해 부탁드립니다.\n감사합니다.',
    author: '관리자',
    createdAt: '2024-12-18',
    views: 245,
  },
  {
    id: 2,
    title: '새로운 기능 업데이트 안내',
    content:
      '안녕하세요.\n\n뉴스레터 자동 분류 기능이 추가되었습니다.\n이제 받은 뉴스레터가 자동으로 카테고리별로 분류됩니다.\n\n감사합니다.',
    author: '관리자',
    createdAt: '2024-12-15',
    views: 189,
  },
  {
    id: 3,
    title: '개인정보 처리방침 변경 안내',
    content:
      '개인정보 처리방침이 2024년 12월 10일부로 업데이트되었습니다.\n\n주요 변경 사항은 다음과 같습니다:\n1. 데이터 보관 기간 명시\n2. 제3자 제공 범위 구체화\n3. 사용자 권리 보장 강화\n\n자세한 내용은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.',
    author: '관리자',
    createdAt: '2024-12-10',
    views: 312,
  },
];

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [nextId, setNextId] = useState(4);

  const getNotice = useCallback(
    (id: number) => {
      return notices.find((notice) => notice.id === id);
    },
    [notices],
  );

  const createNotice = useCallback(
    (title: string, content: string) => {
      const newNotice: Notice = {
        id: nextId,
        title,
        content,
        author: '관리자',
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
      };
      setNotices((prev) => [newNotice, ...prev]);
      setNextId((prev) => prev + 1);
    },
    [nextId],
  );

  const deleteNotice = useCallback((id: number) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
  }, []);

  const updateNotice = useCallback(
    (id: number, title: string, content: string) => {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === id ? { ...notice, title, content } : notice,
        ),
      );
    },
    [],
  );

  return (
    <NoticeContext.Provider
      value={{ notices, getNotice, createNotice, deleteNotice, updateNotice }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
};
