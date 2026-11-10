import { describe, expect, it } from 'vitest';
import {
  getAvatarColor,
  getAvatarInitial,
} from '../src/pages/inquiries/InquiryAvatar';
import { theme } from '../src/styles/theme';

describe('아바타 이니셜', () => {
  it('이름의 첫 글자를 쓴다', () => {
    expect(getAvatarInitial('김시원')).toBe('김');
  });

  it('영문이면 대문자로 바꾼다', () => {
    expect(getAvatarInitial('wudiee')).toBe('W');
  });

  it('앞뒤 공백을 무시한다', () => {
    expect(getAvatarInitial('  메이  ')).toBe('메');
  });

  it('이름이 비어 있으면 물음표를 쓴다', () => {
    expect(getAvatarInitial('')).toBe('?');
    expect(getAvatarInitial('   ')).toBe('?');
  });

  it('이모지처럼 두 칸을 쓰는 글자도 깨뜨리지 않는다', () => {
    expect(getAvatarInitial('🌸봄봄')).toBe('🌸');
  });
});

describe('아바타 색', () => {
  it('같은 이름이면 항상 같은 색을 준다', () => {
    expect(getAvatarColor('새로이', theme.avatarPalette)).toBe(
      getAvatarColor('새로이', theme.avatarPalette),
    );
  });

  it('이름이 다르면 색이 갈린다', () => {
    const names = ['강철원', '새로이', '상추신', '메이', '김현아', '고유진'];
    const colors = new Set(
      names.map((name) => getAvatarColor(name, theme.avatarPalette)),
    );
    expect(colors.size).toBeGreaterThan(1);
  });

  it('이름이 비어도 색을 준다', () => {
    expect(getAvatarColor('', theme.avatarPalette)).toMatch(/^#[0-9A-F]{6}$/i);
  });

  // 아바타 색은 #RRGGBB를 전제로 파싱해 배경·글자색을 만든다. 팔레트에 #abc 같은
  // 단축형이 섞이면 색이 깨지므로 형식을 잠근다.
  it('팔레트는 여섯 자리 hex만 담는다', () => {
    theme.avatarPalette.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('theme에 정의된 팔레트 안에서만 고른다', () => {
    const names = ['강철원', '새로이', '상추신', '메이', '김현아', '고유진'];
    names.forEach((name) => {
      expect(theme.avatarPalette).toContain(
        getAvatarColor(name, theme.avatarPalette),
      );
    });
  });
});
