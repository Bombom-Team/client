import { createContext, useContext, useState, useCallback } from 'react';
import type { Notice, NoticeCategoryType } from '@/types/notice';
import type { ReactNode } from 'react';

interface NoticeContextValue {
  notices: Notice[];
  getNotice: (id: number) => Notice | undefined;
  createNotice: (
    title: string,
    content: string,
    noticeCategory: NoticeCategoryType,
  ) => void;
  deleteNotice: (id: number) => void;
  updateNotice: (id: number, title: string, content: string) => void;
}

const NoticeContext = createContext<NoticeContextValue | undefined>(undefined);

const initialNotices: Notice[] = [
  {
    id: 1,
    title: '새로운 기능 업데이트 안내',
    content:
      '안녕하세요.\n\n뉴스레터 자동 분류 기능이 추가되었습니다.\n이제 받은 뉴스레터가 자동으로 카테고리별로 분류됩니다.\n\n감사합니다.',
    author: '관리자',
    createdAt: '2024-12-15',
    views: 189,
    noticeCategory: 'NOTICE',
  },
  {
    id: 2,
    title: '개인정보 처리방침 변경 안내',
    content:
      '개인정보 처리방침이 2024년 12월 10일부로 업데이트되었습니다.\n\n주요 변경 사항은 다음과 같습니다:\n1. 데이터 보관 기간 명시\n2. 제3자 제공 범위 구체화\n3. 사용자 권리 보장 강화\n\n자세한 내용은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.',
    author: '관리자',
    createdAt: '2024-12-10',
    views: 312,
    noticeCategory: 'EVENT',
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
    (title: string, content: string, noticeCategory: NoticeCategoryType) => {
      const newNotice: Notice = {
        id: nextId,
        title,
        content,
        author: '관리자',
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
        noticeCategory,
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
