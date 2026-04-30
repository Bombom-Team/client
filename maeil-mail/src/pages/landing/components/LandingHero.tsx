import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// ── Design constants ─────────────────────────────────────────────────────────

const BG = '#9ed2b4';
const TITLE = '매일메일';
const ARC = 14;
const DEPTH = 22;
const TILT = 8;

// ── Helpers ──────────────────────────────────────────────────────────────────

function extrudeShadow(depth: number): string {
  const parts: string[] = [];
  for (let i = 1; i <= depth; i++) {
    const x = i * 0.55;
    const y = i * 0.85;
    const t = i / depth;
    const shade = Math.round(255 - 35 - t * 55); // 220 → 165
    parts.push(`${x}px ${y}px 0 rgb(${shade},${shade},${shade})`);
  }
  parts.push(
    `${depth * 0.55 + 8}px ${depth * 0.85 + 22}px 30px rgba(0,0,0,0.18)`,
  );
  return parts.join(', ');
}

interface CharStyle {
  transform: string;
  textShadow: string;
}

function buildCharStyles(
  text: string,
  arc: number,
  depth: number,
): CharStyle[] {
  const chars = [...text];
  const n = chars.length;
  const mid = (n - 1) / 2;
  const shadow = extrudeShadow(depth);

  return chars.map((_, i) => {
    const t = (i - mid) / mid;
    const ty = -arc * (1 - t * t);
    const rz = t * 14;
    const scale = 1 + (1 - Math.abs(t)) * 0.06;
    const ry = t * 6;
    const z = (1 - Math.abs(t)) * 30;
    return {
      transform: `translate3d(0, ${ty}px, ${z}px) rotateZ(${rz}deg) rotateY(${ry}deg) scale(${scale})`,
      textShadow: shadow,
    };
  });
}

// ── Component ────────────────────────────────────────────────────────────────

const CHAR_STYLES = buildCharStyles(TITLE, ARC, DEPTH);

const LandingHero = () => {
  const chars = [...TITLE];

  return (
    <Stage>
      <Grain aria-hidden />
      <Vignette aria-hidden />

      <FloatLayer aria-hidden>
        {/* Envelope */}
        <FloatObj
          $top="18%"
          $left="8%"
          $size={130}
          $rot={-14}
          $dur={7}
          $delay={0}
        >
          <EnvBody>
            <EnvFlap />
            <EnvShadow />
          </EnvBody>
        </FloatObj>

        {/* Newsletter */}
        <FloatObj
          $top="62%"
          $left="12%"
          $size={110}
          $rot={12}
          $dur={8.5}
          $delay={-1.3}
        ></FloatObj>

        {/* Paper plane */}
        <FloatObj
          $top="22%"
          $right="10%"
          $size={140}
          $rot={18}
          $dur={9}
          $delay={-2.6}
        >
          <PlaneSvg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="planeG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d8d8d8" />
              </linearGradient>
              <linearGradient id="planeShade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a8a8a8" />
              </linearGradient>
            </defs>
            <polygon
              points="10,50 90,15 60,52 90,15 55,85"
              fill="url(#planeShade)"
            />
            <polygon points="10,50 90,15 55,55" fill="url(#planeG)" />
            <polygon points="55,55 90,15 55,85" fill="#eaeaea" opacity="0.9" />
          </PlaneSvg>
        </FloatObj>

        {/* Stamp */}
        <FloatObj
          $bottom="16%"
          $right="14%"
          $size={95}
          $rot={-8}
          $dur={7.5}
          $delay={-3.9}
        >
          <StampInner>
            <StampDot />
          </StampInner>
        </FloatObj>
      </FloatLayer>

      <HeroCenter>
        <TitleWrap>
          <ArcRow
            style={{ transform: `perspective(1400px) rotateX(${TILT}deg)` }}
          >
            {chars.map((c, i) => (
              <HeroChar key={i} style={CHAR_STYLES[i]}>
                {c}
              </HeroChar>
            ))}
          </ArcRow>

          <Subtitle>
            <WithText>with</WithText>
            <BrandText>봄봄</BrandText>
          </Subtitle>
        </TitleWrap>
      </HeroCenter>
    </Stage>
  );
};

export default LandingHero;

// ── Keyframes ────────────────────────────────────────────────────────────────

const floaty = keyframes`
  0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
  50%       { transform: translateY(-18px) rotate(calc(var(--rot, 0deg) + 4deg)); }
`;

// ── Stage & overlays ─────────────────────────────────────────────────────────

const Stage = styled.section`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100dvh;

  background: ${BG};

  perspective: 1400px;
  perspective-origin: 50% 45%;
`;

const Grain = styled.div`
  position: absolute;
  z-index: 2;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");

  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0.18;
  pointer-events: none;
`;

const Vignette = styled.div`
  position: absolute;
  z-index: 1;

  background: radial-gradient(
    ellipse at 50% 55%,
    transparent 0%,
    transparent 55%,
    rgb(0 0 0 / 12%) 100%
  );

  inset: 0;
  pointer-events: none;
`;

// ── Floating objects ─────────────────────────────────────────────────────────

const FloatLayer = styled.div`
  position: absolute;
  z-index: 5;

  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
`;

interface FloatObjProps {
  $top?: string;
  $left?: string;
  $right?: string;
  $bottom?: string;
  $size: number;
  $rot: number;
  $dur: number;
  $delay: number;
}

const FloatObj = styled.div<FloatObjProps>`
  --rot: ${({ $rot }) => $rot}deg;
  --dur: ${({ $dur }) => $dur}s;

  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  animation: ${floaty} var(--dur) ease-in-out infinite;

  animation-delay: ${({ $delay }) => $delay}s;
  filter: drop-shadow(8px 14px 14px rgb(0 0 0 / 18%));
  inset: ${({ $top }) => $top ?? 'auto'} ${({ $right }) => $right ?? 'auto'}
    ${({ $bottom }) => $bottom ?? 'auto'} ${({ $left }) => $left ?? 'auto'};
  transform-style: preserve-3d;
`;

const EnvBody = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;

  background: #fff;
`;

const EnvFlap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 55%;

  background: linear-gradient(135deg, #f0f0f0 50%, #e0e0e0 100%);

  clip-path: polygon(0 0, 100% 0, 50% 68%);
`;

const EnvShadow = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 45%;

  background: linear-gradient(to top, #e8e8e8, #f5f5f5);

  clip-path: polygon(0 100%, 100% 100%, 50% 0%);
`;

const PlaneSvg = styled.svg`
  width: 100%;
  height: 100%;

  display: block;

  filter: drop-shadow(3px 4px 0 rgb(0 0 0 / 6%));
`;

const StampInner = styled.div`
  width: 100%;
  height: 100%;
  border: 5px dashed rgb(0 0 0 / 15%);
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
`;

const StampDot = styled.div`
  width: 38%;
  height: 38%;
  border-radius: 50%;

  background: #c8dfd0;
`;

const HeroCenter = styled.div`
  position: absolute;
  z-index: 10;
  padding: 0 5vw;

  display: flex;
  align-items: center;
  justify-content: center;

  inset: 0;
`;

const TitleWrap = styled.div`
  position: relative;

  display: flex;
  gap: 18px;
  flex-direction: column;
  align-items: center;
`;

const ArcRow = styled.div`
  padding: 50px 20px 80px;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  transform-style: preserve-3d;
`;

const HeroChar = styled.span`
  display: inline-block;

  color: #fff;
  font-family: 'Black Han Sans', 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: clamp(96px, 14vw, 220px);
  line-height: 0.95;
  letter-spacing: 0.01em;

  filter: drop-shadow(0 2px 0 rgb(255 255 255 / 40%));
  transform-origin: 50% 80%;
  will-change: transform;

  @media (width <= 768px) {
    font-size: clamp(60px, 16vw, 120px);
  }
`;

// ── Subtitle ─────────────────────────────────────────────────────────────────

const Subtitle = styled.div`
  position: relative;
  z-index: 20;
  margin-top: -28px;
  margin-right: 8%;

  display: inline-flex;
  gap: 14px;
  align-items: baseline;
  align-self: flex-end;

  white-space: nowrap;

  filter: drop-shadow(2px 4px 4px rgb(0 0 0 / 15%));
  transform: rotate(-3deg) translateZ(0);
`;

const WithText = styled.span`
  color: #fff;
  font-family: Jua, 'Nanum Gothic', sans-serif;
  font-weight: 400;
  font-size: clamp(20px, 2.4vw, 32px);
  letter-spacing: 0.02em;

  opacity: 0.92;
`;

const BrandText = styled.span`
  color: #fe5e04;
  font-family: Jua, 'Nanum Gothic', sans-serif;
  font-weight: 400;
  font-size: clamp(34px, 4vw, 56px);
  letter-spacing: 0.01em;

  text-shadow:
    1px 1px 0 #d94d00,
    2px 2px 0 #c44400,
    3px 3px 0 #b03c00,
    4px 4px 0 #9c3500,
    5px 5px 0 #882d00,
    6px 7px 8px rgb(0 0 0 / 25%);
`;
