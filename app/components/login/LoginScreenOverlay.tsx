import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { Modal } from 'react-native';

import { theme } from '@bombom/shared/theme';
import { LoginScreen, type LoginScreenProps } from './LoginScreen';

interface LoginScreenOverlayProps extends LoginScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const LoginScreenOverlay = ({
  visible,
  onClose,
  webLoginFailure,
  onWebLoginFailureHandled,
}: LoginScreenOverlayProps) => {
  const [isPresented, setIsPresented] = useState(false);

  useEffect(() => {
    if (!visible) setIsPresented(false);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onShow={() => setIsPresented(true)}
    >
      <Container>
        <CloseButton
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={theme.colors.icons} />
        </CloseButton>

        <LoginScreen
          // 로그인 시트를 다시 여는 경우에도 표시가 끝난 뒤 Alert를 띄운다.
          webLoginFailure={visible && isPresented ? webLoginFailure : null}
          onWebLoginFailureHandled={onWebLoginFailureHandled}
        />
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 1000;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.disabledBackground};
  justify-content: center;
  align-items: center;
`;
