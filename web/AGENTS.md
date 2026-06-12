# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**봄봄 (BomBom)** is a newsletter reader platform that helps users build reading habits by aggregating newsletters in one place and providing reading tracking features.

**Frontend**: React-based SPA with TypeScript, Emotion styling, and TanStack Router

## Development Commands

### Frontend (React/TypeScript)

```bash
cd frontend/

# Development
npm run start          # Start dev server on localhost:3000
npm run start:msw      # Start dev server with MSW enabled
npm run build          # Production build
npm run test           # Run Jest tests

# Code Quality
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format with Prettier and Stylelint
npm run type-check     # TypeScript type checking

# E2E Testing
npm run test:e2e       # Run Playwright tests
npm run test:e2e:ui    # Run Playwright tests with UI
npm run test:e2e:headed # Run Playwright tests in headed mode
npm run test:e2e:debug # Debug Playwright tests

# Storybook
npm run storybook      # Start Storybook on port 6006
npm run build-storybook # Build Storybook

# API Types
npm run gen:api # Generate TypeScript types from OpenAPI spec
```

## Architecture & Technology Stack

### Frontend Architecture

- **Routing**: TanStack Router with file-based routing in `src/routes/`
- **Styling**: Emotion with styled-components pattern and centralized theme
- **State Management**: TanStack Query for server state
- **Testing**: Jest with Testing Library for unit tests, Playwright for E2E
- **Mocking**: MSW (Mock Service Worker) for API mocking
- **Build**: Webpack with Babel for TypeScript/React compilation

**Key Directories:**

- `src/components/` - Reusable UI components with Storybook stories
- `src/pages/` - Page-specific components and business logic
- `src/routes/` - TanStack Router route definitions
- `src/styles/` - Global styles, theme, and reset styles
- `src/mocks/` - MSW handlers and mock data
- `src/types/` - TypeScript type definitions
- `src/apis/` - API client functions and query definitions

### Component Design System

Components follow atomic design principles:

- All components include Storybook stories for documentation
- Emotion styled-components with theme integration
- TypeScript interfaces for all props
- Consistent naming: PascalCase for components, camelCase for props
- Design system uses 4px spacing units (4px, 8px, 12px, 16px, etc.)

## Project Conventions

> Git workflow(commit message, PR format, branch naming, merge strategy) is repository-wide and lives in `/CLAUDE.md`.

### Code Style

- **ESLint + Prettier**: TypeScript strict mode enabled
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Order**: External libraries, internal modules, relative imports

## Key Features Implementation

### Core Newsletter Features

- **Reading Progress Tracking**: Track reading progress per newsletter
- **Social Features**: Follow other users, leaderboards for motivation
- **Highlight & Notes**: Save important sections with personal notes
- **Archive System**: Knowledge management from collected notes

### Technical Implementation Notes

- **Routing**: TanStack Router auto-generates route tree in `routeTree.gen.ts`
- **Styling**: Theme-based design system with consistent color palette and typography
- **Testing**: MSW provides realistic API mocking for development and testing
- **Component Library**: Storybook documents all UI components with interactive examples

## Development Tips

### Frontend Development

- Use the theme object for consistent colors and typography: `theme.colors.primary`, `theme.fonts.t15Bold`
- All components should include TypeScript interfaces and Storybook stories
- MSW is configured for API mocking - add new handlers in `src/mocks/handlers.ts`
- Router devtools are available in development mode
- E2E tests are organized by page in `src/pages/*/__test__/`

### Running Tests

- **Unit tests**: `npm run test` for Jest/Testing Library tests
- **E2E tests**: `npm run test:e2e` for Playwright tests

This is an active project focused on building reading habits through newsletter aggregation and social reading features.

## Design Guidelines

- 크기는 4의 단위로 사용해줘. 예를들어 4px, 8px, 12px, 이런 식으로

## Responsive / Device Patterns

- **mobile / tablet / pc 분기는 항상 `useDevice` 훅으로**: 기능·UI를 디바이스 종류에 따라 다르게 처리할 때는 JS 로직이든 styled CSS든 모두 `useDevice()`로 받은 `device` 값을 기준으로 분기해. CSS `@media (max-width: ...)`로 직접 분기하면 JS와 CSS의 임계점이 어긋날 수 있으니, styled-component도 device(또는 파생 boolean)를 prop으로 넘겨 분기해줘. 예외는 컴포넌트 외부 컨테이너의 단순 hide 같이 prop 전달이 번거로운 경우 정도.

  ```tsx
  // ❌ @media 직접 분기
  const Box = styled.div`
    padding: 20px;
    @media (max-width: 1024px) {
      padding: 12px;
    }
  `;

  // ✅ useDevice + styled prop
  const Component = () => {
    const device = useDevice();
    const isMobile = device !== 'pc';
    return <Box isMobile={isMobile} />;
  };
  const Box = styled.div<{ isMobile: boolean }>`
    padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  `;
  ```

- **디바이스 분기 변수명은 `isMobile` / `isPC`로 할당해서 사용**: 봄봄 컨벤션상 `device !== 'pc'`(= mobile + tablet)는 `isMobile`로, `device === 'pc'`는 `isPC`로 부르고 있어(예: `BomBomPageLayout`의 `isPC`, `PreviousArticles`의 `isMobile`). `isCompact` 같은 자체 의미의 이름은 피하고 위 두 이름 중 의미가 맞는 걸 써줘.
