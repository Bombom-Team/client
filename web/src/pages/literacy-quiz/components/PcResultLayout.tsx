import styled from '@emotion/styled';
import LiteracyScreen from './LiteracyScreen';
import { APP_STORE_URL, PLAY_STORE_URL } from '../constants/links';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { PropsWithChildren } from 'react';
import appStoreQrCode from '#/assets/avif/app_store_qr_code.avif';
import playStoreQrCode from '#/assets/avif/play_store_qr_code.avif';

const STORES = [
  { label: 'App Store', qrCode: appStoreQrCode, url: APP_STORE_URL },
  { label: 'Google Play', qrCode: playStoreQrCode, url: PLAY_STORE_URL },
];

// PC 결과 화면: 왼쪽 앱 안내 + 가운데 휴대폰 폭 결과 화면
const PcResultLayout = ({ children }: PropsWithChildren) => {
  return (
    <Container>
      <Aside>
        <Kicker>결과가 나왔어요</Kicker>
        <Heading>
          봄봄 앱에서
          <br />
          매일 5분씩
          <br />
          읽어 보세요
        </Heading>
        <AppBox>
          <QrList>
            {STORES.map((store) => (
              <QrItem key={store.label}>
                <QrImage
                  src={store.qrCode}
                  alt={`${store.label} 봄봄 앱 설치 QR 코드`}
                />
                <StoreLink
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {store.label}
                </StoreLink>
              </QrItem>
            ))}
          </QrList>
          <AppText>
            <AppTitle>봄봄 앱 받기</AppTitle>
            카메라로 찍으면 앱 설치 화면이 열려요
          </AppText>
        </AppBox>
      </Aside>
      <Center>
        <LiteracyScreen isFramed>{children}</LiteracyScreen>
      </Center>
    </Container>
  );
};

export default PcResultLayout;

const Container = styled.div`
  overflow: hidden;

  display: grid;
  flex: 1;

  background: ${LITERACY_COLORS.pcPanel};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.head};

  grid-template-columns: 1fr 390px 1fr;
  grid-template-rows: minmax(0, 1fr);
`;

const Aside = styled.aside`
  width: 100%;
  max-width: 444px;
  padding: 64px 52px;

  display: grid;
  gap: 22px;
  align-content: start;
  justify-self: end;

  overflow-y: auto;
`;

const Kicker = styled.p`
  margin: 0;

  color: ${LITERACY_COLORS.stamp};
  font: 800 15px ${LITERACY_FONTS.head};
`;

const Heading = styled.h2`
  margin: 0;

  font: 900 40px/1.28 ${LITERACY_FONTS.head};
  letter-spacing: -0.02em;
`;

const AppBox = styled.div`
  margin-top: 8px;
  padding: 16px;
  border: 1px solid ${LITERACY_COLORS.paperLine};

  display: grid;
  gap: 12px;

  background: ${LITERACY_COLORS.paper};
`;

const QrList = styled.div`
  display: flex;
  gap: 16px;
`;

const QrItem = styled.div`
  display: grid;
  gap: 4px;
  justify-items: center;
`;

const QrImage = styled.img`
  width: 104px;
  height: 104px;
`;

const StoreLink = styled.a`
  color: ${LITERACY_COLORS.sub};
  font: 700 13px ${LITERACY_FONTS.head};

  text-decoration: underline;
`;

const AppText = styled.p`
  margin: 0;

  color: ${LITERACY_COLORS.sub};
  font-size: 14px;
  line-height: 1.55;
`;

const AppTitle = styled.b`
  margin-bottom: 4px;

  display: block;

  color: ${LITERACY_COLORS.ink};
  font-size: 16px;
`;

const Center = styled.div`
  overflow: hidden;
  height: 100%;
`;
