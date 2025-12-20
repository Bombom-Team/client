import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberRole } from '@/apis/members/members.api';

export const useChangeMemberRoleMutation = ({
  setUpdatingMemberId,
}: {
  setUpdatingMemberId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      authority,
    }: {
      memberId: number;
      authority: 'ADMIN' | 'USER';
    }) => updateMemberRole({ memberId, authority }),
    onMutate: ({ memberId }) => {
      setUpdatingMemberId(memberId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (variables.authority === 'ADMIN') {
        alert('해당 멤버의 권한을 관리자 권한으로 변경했습니다.');
      } else {
        alert('해당 멤버의 권한을 일반 회원으로 변경했습니다.');
      }
    },
    onError: (mutationError) => {
      let message = '권한 변경에 실패했습니다. 잠시 후 다시 시도해주세요.';
      if (mutationError instanceof Error && mutationError.message) {
        message += `\n${mutationError.message}`;
      }
      alert(message);
    },
    onSettled: () => {
      setUpdatingMemberId(null);
    },
  });
};
