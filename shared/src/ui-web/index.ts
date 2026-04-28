import './emotion';

export { default as Button } from './Button/Button';
export type { ButtonProps } from './Button/Button';

export { default as Flex } from './Flex/Flex';
export type { FlexProps } from './Flex/Flex';

export { default as Text } from './Text/Text';
export type { TextProps } from './Text/Text';

export { default as Modal } from './Modal/Modal';
export { default as useModal } from './Modal/useModal';

export { default as Select } from './Select/Select';
export type { SelectOption } from './Select/Select.types';

export { default as ChevronIcon } from './icons/ChevronIcon';

export { default as Toast } from './Toast/Toast';
export { useToasts } from './Toast/useToasts';
export {
  toast,
  showToast,
  hideToast,
  cleanToasts,
  updateToast,
} from './Toast/utils/toastActions';
export type {
  ToastData,
  ToastVariant,
  ToastPosition,
} from './Toast/Toast.types';
export {
  DEFAULT_LIMIT,
  DEFAULT_DURATION,
  DEFAULT_POSITION,
} from './Toast/Toast.constants';

export { useDevice } from './hooks/useDevice';
export type { Device } from './hooks/useDevice';
export { default as useMediaQuery } from './hooks/useMediaQuery';
export type { MediaCondition } from './hooks/useMediaQuery';
export { DEVICE_BREAKPOINTS } from './hooks/deviceBreakpoints';
export { useScrollVisible } from './hooks/useScrollVisible';

export { isAppVersionSupported } from './utils/version';
export {
  isWebView,
  getDevice,
  getDeviceInWebView,
  getDeviceInWebApp,
  isAndroid,
  isIOS,
} from './utils/device';
export {
  sendMessageToRN,
  addWebViewMessageListener,
} from './utils/webview';
