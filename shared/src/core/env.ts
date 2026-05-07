const missingEnv = (key: string) => () => {
  throw new Error(
    `[ENV] "${key}"가 주입되지 않았습니다. ` +
      `webpack(web/admin) DefinePlugin · vite(maeil-mail) define · metro.config(app) 중 ` +
      `해당 번들러의 환경변수 주입 설정과 .env 파일에 키가 존재하는지 확인해주세요.`,
  );
};

export const ENV = {
  baseUrl: missingEnv('baseUrl')(),
  eventBaseUrl: missingEnv('eventBaseUrl')(),
  notificationBaseUrl: missingEnv('notificationBaseUrl')(),
  blogBaseUrl: missingEnv('blogBaseUrl')(),
} as const;
