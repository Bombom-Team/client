import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';

type CardType = 'envelope' | 'code' | 'doc';

interface Card {
  cx: number;
  cy: number;
  cz: number;
  w: number;
  h: number;
  ry: number;
  rx: number;
  ryVel: number;
  rxVel: number;
  floatPhase: number;
  floatFreq: number;
  floatAmp: number;
  type: CardType;
  lineWidths: number[];
}

// --- 3D math ---

const rotY = (x: number, y: number, z: number, a: number) => ({
  x: x * Math.cos(a) + z * Math.sin(a),
  y,
  z: -x * Math.sin(a) + z * Math.cos(a),
});

const rotX = (x: number, y: number, z: number, a: number) => ({
  x,
  y: y * Math.cos(a) - z * Math.sin(a),
  z: y * Math.sin(a) + z * Math.cos(a),
});

const project = (x: number, y: number, z: number, cx: number, cy: number, fov: number) => {
  const sz = Math.max(z + fov, 0.001);
  const s = fov / sz;
  return { x: cx + x * s, y: cy + y * s, s };
};

// --- Card factory ---

// Xorshift RNG — fixed seed for deterministic layout across resizes
let seed = 0;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 0x100000000;
};

const TYPES: CardType[] = ['code', 'envelope', 'doc'];

function makeCards(cw: number, ch: number): Card[] {
  seed = 0x9e3779b9;
  return Array.from({ length: 12 }, (_, i) => {
    const onRight = i >= 4;
    const cx = onRight
      ? rand() * cw * 0.38 + cw * 0.07
      : -(rand() * cw * 0.34 + cw * 0.09);
    const cy = (rand() - 0.5) * ch * 0.68;
    const cz = onRight ? rand() * 460 - 90 : rand() * 380 + 130;
    const w = 124 + rand() * 92;
    return {
      cx,
      cy,
      cz,
      w,
      h: w * (0.6 + rand() * 0.27),
      ry: rand() * Math.PI * 2,
      rx: (rand() - 0.5) * 0.3,
      ryVel: (rand() * 0.002 + 0.0007) * (rand() > 0.5 ? 1 : -1),
      rxVel: rand() * 0.00055 * (rand() > 0.5 ? 1 : -1),
      floatPhase: rand() * Math.PI * 2,
      floatFreq: 0.00046 + rand() * 0.00044,
      floatAmp: 10 + rand() * 18,
      type: TYPES[i % 3],
      lineWidths: Array.from({ length: 5 }, () => 0.3 + rand() * 0.6),
    };
  });
}

// --- Component ---

const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const ctx = el.getContext('2d');
    if (!ctx) return;

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio, 2);

    let cw = 0;
    let ch = 0;
    let animId = 0;
    let t0: number | null = null;
    let cards: Card[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      cw = r.width;
      ch = r.height;
      el.width = cw * dpr;
      el.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cards = makeCards(cw, ch);
    };

    const D = (a: number) => `rgba(18,18,28,${a.toFixed(3)})`;

    const drawCard = (c: Card, elapsed: number) => {
      const fy = Math.sin(elapsed * c.floatFreq + c.floatPhase) * c.floatAmp;
      const hw = c.w / 2;
      const hh = c.h / 2;
      const fov = Math.max(cw, ch) * 0.82;

      const depth = Math.max(0, 1 - (c.cz + 200) / 780);
      if (depth < 0.02) return;

      // Transform local point → projected screen point
      const tp = (lx: number, ly: number, lz = 0) => {
        let p = rotY(lx, ly, lz, c.ry);
        p = rotX(p.x, p.y, p.z, c.rx);
        const pf = Math.max(0.1, 1 - c.cz / 850);
        return project(
          p.x + c.cx + mouse.x * pf * 0.052,
          p.y + c.cy + fy + mouse.y * pf * 0.036,
          p.z + c.cz,
          cw / 2,
          ch / 2,
          fov,
        );
      };

      const [tl, tr, br, bl] = [tp(-hw, -hh), tp(hw, -hh), tp(hw, hh), tp(-hw, hh)];

      // Back-face culling via 2D cross product
      const cross = (tr.x - tl.x) * (bl.y - tl.y) - (tr.y - tl.y) * (bl.x - tl.x);
      const back = cross < 0;
      const a = depth * (back ? 0.04 : 0.86);

      // Card face
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      [tr, br, bl].forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = D(a * 0.055);
      ctx.fill();
      ctx.strokeStyle = D(a * 0.28);
      ctx.lineWidth = 0.85;
      ctx.stroke();

      if (back) return;

      ctx.lineWidth = 0.6;

      if (c.type === 'code') {
        // Header divider
        const hy = -hh + c.h * 0.28;
        const h1 = tp(-hw, hy);
        const h2 = tp(hw, hy);
        ctx.beginPath();
        ctx.moveTo(h1.x, h1.y);
        ctx.lineTo(h2.x, h2.y);
        ctx.strokeStyle = D(a * 0.17);
        ctx.stroke();

        // 3 dots
        const dy = -hh + c.h * 0.14;
        [-0.65, -0.49, -0.33].forEach(dx => {
          const dp = tp(hw * dx, dy);
          ctx.beginPath();
          ctx.arc(dp.x, dp.y, Math.max(0.7, 2.1 * dp.s), 0, Math.PI * 2);
          ctx.fillStyle = D(a * 0.21);
          ctx.fill();
        });

        // Code lines
        const bt = -hh + c.h * 0.37;
        c.lineWidths.slice(0, 4).forEach((lw, i) => {
          const ly = bt + i * c.h * 0.152;
          const x1 = tp(-hw * 0.82, ly);
          const x2 = tp(-hw * 0.82 + c.w * 0.76 * lw, ly);
          ctx.beginPath();
          ctx.moveTo(x1.x, x1.y);
          ctx.lineTo(x2.x, x2.y);
          ctx.strokeStyle = D(a * 0.125);
          ctx.stroke();
        });
      } else if (c.type === 'envelope') {
        // Top flap (V shape)
        const mid = tp(0, -hh + c.h * 0.36);
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(mid.x, mid.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.strokeStyle = D(a * 0.2);
        ctx.stroke();

        // Bottom flap
        const bm = tp(0, hh - c.h * 0.27);
        ctx.beginPath();
        ctx.moveTo(bl.x, bl.y);
        ctx.lineTo(bm.x, bm.y);
        ctx.lineTo(br.x, br.y);
        ctx.strokeStyle = D(a * 0.14);
        ctx.stroke();

        // Side diagonals
        ctx.strokeStyle = D(a * 0.11);
        ctx.beginPath();
        ctx.moveTo(bl.x, bl.y);
        ctx.lineTo(mid.x, mid.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(br.x, br.y);
        ctx.lineTo(mid.x, mid.y);
        ctx.stroke();
      } else {
        // Doc: horizontal content lines
        c.lineWidths.forEach((lw, i) => {
          const ly = -hh + c.h * (0.2 + i * 0.152);
          const x1 = tp(-hw * 0.8, ly);
          const x2 = tp(-hw * 0.8 + c.w * 0.76 * lw, ly);
          ctx.beginPath();
          ctx.moveTo(x1.x, x1.y);
          ctx.lineTo(x2.x, x2.y);
          ctx.strokeStyle = D(a * 0.14);
          ctx.stroke();
        });
      }
    };

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;

      if (cw && ch) {
        ctx.clearRect(0, 0, cw, ch);

        if (!noMotion) {
          mouse.x += (mouse.tx - mouse.x) * 0.062;
          mouse.y += (mouse.ty - mouse.y) * 0.062;
          cards.forEach(c => {
            c.ry += c.ryVel;
            c.rx += c.rxVel;
          });
        }

        // Draw far-to-near (painter's algorithm)
        [...cards]
          .sort((a, b) => b.cz - a.cz)
          .forEach(c => drawCard(c, elapsed));
      }

      animId = requestAnimationFrame(frame);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (noMotion) return;
      mouse.tx = e.clientX - innerWidth / 2;
      mouse.ty = e.clientY - innerHeight / 2;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    resize();
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <Canvas ref={canvasRef} aria-hidden />;
};

export default HeroBackground;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
