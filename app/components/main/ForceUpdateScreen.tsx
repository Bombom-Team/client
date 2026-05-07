import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ForceUpdateScreenProps = {
  onPressUpdate: () => void;
};

const ForceUpdateScreen = ({ onPressUpdate }: ForceUpdateScreenProps) => {
  return (
    <Container>
      <ForceUpdateWrapper>
        <ForceUpdateBackgroundCircle />
        <ForceUpdateCard>
          <ForceUpdateBadge>
            <ForceUpdateBadgeText>NEW VERSION</ForceUpdateBadgeText>
          </ForceUpdateBadge>
          <ForceUpdateTitle>더 나은 봄봄을 위해 업데이트가 필요해요</ForceUpdateTitle>
          <ForceUpdateDescription>
            새로운 기능과 안정성 개선이 포함된 최신 버전으로 업데이트해주세요.
          </ForceUpdateDescription>
          <ForceUpdateButton onPress={onPressUpdate}>
            <ForceUpdateButtonText>지금 업데이트</ForceUpdateButtonText>
          </ForceUpdateButton>
        </ForceUpdateCard>
      </ForceUpdateWrapper>
    </Container>
  );
};

export default ForceUpdateScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.white};
`;

const ForceUpdateWrapper = styled.View`
  padding: 24px;

  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.theme.colors.primaryInfo};
`;

const ForceUpdateBackgroundCircle = styled.View`
  position: absolute;
  top: 80px;
  width: 280px;
  height: 280px;
  border-radius: 140px;

  background-color: ${(props) => props.theme.colors.primaryLight};

  opacity: 0.65;
`;

const ForceUpdateCard = styled.View`
  width: 100%;
  padding: 28px 22px 24px;
  border: 1px solid ${(props) => props.theme.colors.dividers};
  border-radius: 24px;

  background-color: ${(props) => props.theme.colors.white};
`;

const ForceUpdateBadge = styled.View`
  padding: 6px 12px;
  border-radius: 999px;

  align-self: flex-start;

  background-color: ${(props) => props.theme.colors.primaryInfo};
`;

const ForceUpdateBadgeText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.3px;
`;

const ForceUpdateTitle = styled.Text`
  margin-top: 14px;

  color: ${(props) => props.theme.colors.black};
  font-weight: 700;
  font-size: 23px;
  line-height: 31px;
`;

const ForceUpdateDescription = styled.Text`
  margin-top: 14px;

  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 15px;
  line-height: 23px;
`;

const ForceUpdateButton = styled(TouchableOpacity)`
  margin-top: 26px;
  padding: 15px 18px;
  border-radius: 14px;

  align-items: center;

  background-color: ${(props) => props.theme.colors.primary};
`;

const ForceUpdateButtonText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-weight: 700;
  font-size: 17px;
`;
