import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

/**
 * 이름에서 아바타에 쓸 한 글자를 뽑는다.
 * 이름이 비어 있으면 물음표를 쓴다.
 */
export const getAvatarInitial = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return [...trimmed][0].toUpperCase();
};

/**
 * 같은 이름이 항상 같은 색을 갖도록 문자열을 팔레트 인덱스로 환산한다.
 */
export const getAvatarColor = (
  name: string,
  palette: readonly string[],
): string => {
  const trimmed = name.trim();
  if (!trimmed) return palette[0];

  // 32비트 정수 범위에서 섞는다. 작은 수로 나머지를 취하면 마지막 글자가 결과를
  // 좌우해, 끝 글자가 같은 한글 이름끼리 색이 뭉친다.
  const hash = [...trimmed].reduce(
    (acc, char) => (Math.imul(acc, 31) + char.codePointAt(0)!) | 0,
    7,
  );
  return palette[Math.abs(hash) % palette.length];
};

interface InquiryAvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

export function InquiryAvatar({ name, size = 'md' }: InquiryAvatarProps) {
  const theme = useTheme();

  return (
    <AvatarCircle
      $color={getAvatarColor(name, theme.avatarPalette)}
      $size={size}
      aria-hidden="true"
    >
      {getAvatarInitial(name)}
    </AvatarCircle>
  );
}

// 지름은 theme에 대응 토큰이 없어 직접 적되, 글자 크기는 fontSize 토큰을 따른다.
const AVATAR_BOX_SIZES = {
  sm: '24px',
  md: '36px',
} as const;

// 배경을 연하게 깔고 글자를 같은 계열 진한 색으로 쓰는 조합. 원색에 흰 글자를
// 올리면 팔레트가 밝아 글자가 묻히는데, 이 방식은 톤을 낮추면서 대비는 오히려
// 올라간다.
const AVATAR_BACKGROUND_ALPHA = 0.18;
const AVATAR_TEXT_DARKEN = 0.55;

const parseHex = (hexColor: string): [number, number, number] => {
  const hex = hexColor.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
};

/** 배경용: 원색에 알파를 입혀 연한 바탕을 만든다. */
const toAvatarBackground = (hexColor: string): string => {
  const [r, g, b] = parseHex(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${AVATAR_BACKGROUND_ALPHA})`;
};

/** 글자용: 원색을 어둡게 눌러 연한 바탕 위에서도 또렷하게 만든다. */
const toAvatarTextColor = (hexColor: string): string => {
  const [r, g, b] = parseHex(hexColor).map((channel) =>
    Math.round(channel * AVATAR_TEXT_DARKEN),
  );
  return `rgb(${r}, ${g}, ${b})`;
};

const AvatarCircle = styled('span', {
  shouldForwardProp: (prop) => prop !== '$color' && prop !== '$size',
})<{ $color: string; $size: 'sm' | 'md' }>`
  width: ${({ $size }) => AVATAR_BOX_SIZES[$size]};
  height: ${({ $size }) => AVATAR_BOX_SIZES[$size]};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ $color }) => toAvatarBackground($color)};
  color: ${({ $color }) => toAvatarTextColor($color)};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ $size, theme }) =>
    $size === 'sm' ? theme.fontSize.xs : theme.fontSize.sm};
  line-height: 1;
  user-select: none;
`;
