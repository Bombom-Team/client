import { useValidateCaptchaMutation } from './useValidateCaptchaMutation';

export const useCaptcha = () => {
  const { mutateAsync: validateCaptcha } = useValidateCaptchaMutation();

  const isCaptchaValid = async (token: string | null) => {
    if (!token) {
      return false;
    }

    try {
      const { isSuccess } = await validateCaptcha(token);
      return isSuccess;
    } catch {
      return false;
    }
  };

  return {
    isCaptchaValid,
  };
};
