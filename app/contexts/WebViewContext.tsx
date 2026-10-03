import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { WebView } from 'react-native-webview';

import { RNToWebMessage } from '@bombom/shared/webview';

export interface WebViewContextType {
  webViewRef: RefObject<WebView | null>;
  sendMessageToWeb: (message: RNToWebMessage) => boolean;
}

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

export const WebViewProvider = ({ children }: PropsWithChildren) => {
  const webViewRef = useRef<WebView | null>(null);

  const sendMessageToWeb = useCallback((message: RNToWebMessage) => {
    const webView = webViewRef.current;
    if (!webView) {
      console.error('WebView 메시지 전송 실패:', message.type);
      return false;
    }

    try {
      const messageString = JSON.stringify(message);
      webView.postMessage(messageString);
      console.log('WebView로 메시지 전송:', message.type);
      return true;
    } catch {
      console.error('WebView 메시지 전송 실패:', message.type);
      return false;
    }
  }, []);

  return (
    <WebViewContext.Provider
      value={{
        webViewRef,
        sendMessageToWeb,
      }}
    >
      {children}
    </WebViewContext.Provider>
  );
};

export const useWebView = () => {
  const context = useContext(WebViewContext);
  if (context === undefined) {
    throw new Error('useWebView must be used within a WebViewProvider');
  }
  return context;
};
