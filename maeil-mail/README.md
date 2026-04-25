# Maeil Mail

`maeil-mail`은 봄봄에서 매일메일 팀의 콘텐츠를 그대로 활용할 수 있도록 OPEN하는 웹 서비스 패키지입니다.

## 목적

- 매일메일 콘텐츠를 봄봄 서비스 내에서 일관된 UX로 제공
- 공유 컴포넌트(`@bombom/shared`) 기반으로 빠르게 통합/운영

## 기술 스택

- React + TypeScript
- Vite
- TanStack Router
- TanStack Query
- Emotion

## 실행

```bash
pnpm run maeil-mail:start
```

## 주요 스크립트

```bash
pnpm run maeil-mail:start
pnpm run maeil-mail:build
pnpm run maeil-mail:lint
pnpm run maeil-mail:lint:fix
pnpm run maeil-mail:stylelint:fix
pnpm run maeil-mail:format
pnpm run maeil-mail:type-check
```

## Assets 사용 가이드

`web`과 비슷하게 경로를 고정해서 사용하는 것을 기준으로 정리했습니다.

### 폴더 규칙

- 컴포넌트처럼 쓰는 SVG: `src/assets/svg`
- URL로 쓰는 이미지(png/jpg/webp/gif/avif): `src/assets/png`
- 파일명을 그대로 유지해야 하는 정적 파일: `public/assets`

### SVG를 React 컴포넌트로 사용

```tsx
import MailIcon from '@/assets/svg/mail.svg';

const Header = () => {
  return <MailIcon width={20} height={20} />;
};
```

### PNG를 URL로 사용

```tsx
import HeroImage from '@/assets/png/hero.png';

const Hero = () => {
  return <img src={HeroImage} alt="hero" />;
};
```

### public 자산 사용

`public/assets` 아래 파일은 import 하지 않고 루트 절대경로로 사용합니다.

```tsx
const Banner = () => {
  return <img src="/assets/banner.png" alt="banner" />;
};
```

### 한 줄 요약

- UI 아이콘/일반 이미지: `src/assets`에 두고 import
- 이름 고정 파일(외부 공유 URL, og 이미지 등): `public/assets`에 두고 `/assets/...`로 참조
