import styled from '@emotion/styled';
import { EVOLVE } from '../constants/keyframes';
import { GROWTH_IMAGES, GROWTH_LAYERS } from '../constants/result';
import { LITERACY_FONTS } from '../constants/style';

interface GrowthArtProps {
  level: number;
  size: string;
  isPopping?: boolean;
}

const SLEEP_COLOR = '#9C8C80';

// 맞힌 개수(0~5)에 맞춰 알 → 병아리 → 부엉이로 자라는 그림. Fluent Emoji(MIT)를 겹쳐 그린다.
const GrowthArt = ({ level, size, isPopping = false }: GrowthArtProps) => {
  const layers = GROWTH_LAYERS[level] ?? GROWTH_LAYERS[0]!;

  return (
    <Container size={size} isPopping={isPopping} aria-hidden="true">
      {layers.map((layer) =>
        layer.image === 'sleep' ? (
          <Sleep
            key={layer.image}
            size={size}
            left={layer.left}
            top={layer.top}
          >
            z<small>z</small>
          </Sleep>
        ) : (
          <Layer
            key={layer.image}
            src={GROWTH_IMAGES[layer.image]}
            alt=""
            left={layer.left}
            top={layer.top}
            width={layer.width ?? 100}
          />
        ),
      )}
    </Container>
  );
};

export default GrowthArt;

const Container = styled.div<{ size: string; isPopping: boolean }>`
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};

  flex-shrink: 0;

  animation: ${EVOLVE} 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);

  animation-name: ${({ isPopping }) => (isPopping ? undefined : 'none')};
`;

const Layer = styled.img<{ left: number; top: number; width: number }>`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  width: ${({ width }) => width}%;
  height: auto;
`;

const Sleep = styled.span<{ size: string; left: number; top: number }>`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;

  color: ${SLEEP_COLOR};
  font: 400 calc(${({ size }) => size} * 0.12) / 1 ${LITERACY_FONTS.display};
`;
