import { useValidateCaptchaMutation } from './useValidateCaptchaMutation';

export const useCaptcha = () => {
  const { mutateAsync: validateCaptcha } = useValidateCaptchaMutation();

  const isCaptchaValid = async (token: string | null) => {
    if (!token) {
      return false;
    }

    try {
      const { success } = await validateCaptcha(token);
      return success;
    } catch {
      return false;
    }
  };

  return {
    isCaptchaValid,
  };
};
