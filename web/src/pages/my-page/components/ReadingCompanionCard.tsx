import { myPageQueries } from '@bombom/shared/apis/mypage';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const COLORS = {
  bgFrom: '#FFF9F6',
  bgTo: '#FFF0E8',
  label: '#1F1F1F',
  days: '#111111',
  message: '#315B83',
} as const;

const ReadingCompanionCard = () => {
  const { data } = useQuery(myPageQueries.getMemberJoinDays());

  if (!data) return null;

  return (
    <Card>
      <Heart viewBox="104 47 52 42" aria-hidden="true">
        <defs>
          <linearGradient
            id="companion-heart"
            x1="104"
            y1="48"
            x2="144"
            y2="88"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB4C3" />
            <stop offset="1" stopColor="#FF4E6E" />
          </linearGradient>
        </defs>
        <path
          d="M130 88C121 83 105 74 105 62C105 54 111 48 119 48C123 48 127 50 130 54C133 50 137 48 141 48C149 48 155 54 155 62C155 74 139 83 130 88Z"
          fill="url(#companion-heart)"
          stroke="#FF3F62"
          strokeWidth="2"
        />
      </Heart>

      <Label>봄봄과 함께한 지</Label>
      <Days>{data.daysSinceJoined}일째</Days>

      <Message>
        꾸준한 읽기 습관이
        <MessageRow>
          쌓이고 있어요!
          <Sprout viewBox="140 236 50 32" aria-hidden="true">
            <path
              d="M164 247C175 242 184 246 187 256C176 259 168 256 164 247Z"
              fill="#4DDA24"
            />
            <path
              d="M164 247C158 239 149 238 143 244C149 252 157 253 164 247Z"
              fill="#75E83B"
            />
            <path
              d="M164 247V266"
              stroke="#239B24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </Sprout>
        </MessageRow>
      </Message>
    </Card>
  );
};

export default ReadingCompanionCard;

const Card = styled.div`
  width: 100%;
  margin-top: auto;
  padding: 28px 20px;
  border-radius: 20px;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;

  background: linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo});

  box-sizing: border-box;
`;

const Heart = styled.svg`
  width: 44px;
  height: 36px;

  display: block;
`;

const Label = styled.p`
  margin: 0;

  color: ${COLORS.label};
  font: ${({ theme }) => theme.fonts.t6Bold};
  text-align: center;
`;

const Days = styled.strong`
  color: ${COLORS.days};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const Message = styled.p`
  margin: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;

  color: ${COLORS.message};
  font: ${({ theme }) => theme.fonts.t5Bold};
  text-align: center;
`;

const MessageRow = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const Sprout = styled.svg`
  width: 22px;
  height: 18px;

  display: block;
`;
