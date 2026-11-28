const CLIPBOARD_TIMEOUT_MS = 1200;

const copyWithTextarea = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let isCopied = false;
  try {
    isCopied = document.execCommand('copy');
  } catch {
    isCopied = false;
  }
  textarea.remove();
  return isCopied;
};

const writeClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithTextarea(text);
  }
};

const waitTimeout = async () => {
  await new Promise((resolve) => setTimeout(resolve, CLIPBOARD_TIMEOUT_MS));
  return 'timeout' as const;
};

// 클립보드 API가 없거나 실패하거나(일부 인앱 브라우저는 응답이 없다) 늦으면 execCommand로 복사한다.
export const copyTextWithFallback = async (text: string) => {
  if (!navigator.clipboard || !window.isSecureContext) {
    return copyWithTextarea(text);
  }

  const result = await Promise.race([writeClipboard(text), waitTimeout()]);
  if (result === 'timeout') return copyWithTextarea(text);
  return result;
};
