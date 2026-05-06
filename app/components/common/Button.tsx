import styled from '@emotion/native';
import { ReactNode } from 'react';
import { ActivityIndicator, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'social';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const StyledButton =
    variant === 'primary'
      ? PrimaryButton
      : variant === 'secondary'
        ? SecondaryButton
        : SocialButton;

  const StyledText =
    variant === 'primary'
      ? PrimaryText
      : variant === 'secondary'
        ? SecondaryText
        : SocialText;

  return (
    <StyledButton
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      $disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#FE5E04'}
        />
      ) : (
        <>
          {icon}
          <StyledText style={textStyle}>{title}</StyledText>
        </>
      )}
    </StyledButton>
  );
};

const BaseButton = styled.TouchableOpacity<{ $disabled?: boolean }>`
  min-height: 48px;
  padding: 12px 24px;
  border-radius: 8px;

  gap: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const PrimaryButton = styled(BaseButton)`
  background-color: ${(props) => props.theme.colors.primaryBomBom};
`;

const SecondaryButton = styled(BaseButton)`
  border-width: 2px;

  background-color: transparent;

  border-color: ${(props) => props.theme.colors.primaryBomBom};
`;

const SocialButton = styled(BaseButton)`
  border-width: 2px;

  background-color: ${(props) => props.theme.colors.white};

  border-color: ${(props) => props.theme.colors.stroke};
  elevation: 3;
  shadow-color: ${(props) => props.theme.colors.black};
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const BaseText = styled.Text`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
`;

const PrimaryText = styled(BaseText)`
  color: ${(props) => props.theme.colors.white};
`;

const SecondaryText = styled(BaseText)`
  color: ${(props) => props.theme.colors.primaryBomBom};
`;

const SocialText = styled(BaseText)`
  color: ${(props) => props.theme.colors.black};
`;
