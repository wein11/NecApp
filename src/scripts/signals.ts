// Señales ilustrativas del monitor. Son datos de ejemplo con forma clínica realista,
// no registros de pacientes. Coordenadas en un viewBox de 1000 x 600.

export type SignalId = 'pulse' | 'gait' | 'report' | 'nystagmus' | 'gaze';

export const VIEW = { w: 1000, h: 760 };
export const PLOT = { x0: 70, x1: 950, y0: 110, y1: 650 };

export interface Pt {
  x: number;
  y: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mapX = (u: number) => lerp(PLOT.x0, PLOT.x1, u);
const mapY = (v: number, min: number, max: number) => lerp(PLOT.y1, PLOT.y0, (v - min) / (max - min));

// Catmull-Rom sobre puntos clave (x creciente), muestreado en n puntos.
function spline(keys: [number, number][], n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = keys[0][0] + ((keys[keys.length - 1][0] - keys[0][0]) * i) / n;
    let k = 0;
    while (k < keys.length - 2 && keys[k + 1][0] < x) k++;
    const p0 = keys[Math.max(0, k - 1)];
    const p1 = keys[k];
    const p2 = keys[k + 1];
    const p3 = keys[Math.min(keys.length - 1, k + 2)];
    const t = (x - p1[0]) / (p2[0] - p1[0] || 1);
    const t2 = t * t;
    const t3 = t2 * t;
    const y =
      0.5 *
      (2 * p1[1] +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
    out.push([x, y]);
  }
  return out;
}

export const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

/* ---------- Marcha: flexión de rodilla en un ciclo (0 a 100 %) ---------- */

const KNEE: [number, number][] = [
  [0, 5],
  [4, 11],
  [10, 18],
  [16, 15],
  [26, 8],
  [38, 4],
  [48, 7],
  [56, 20],
  [62, 40],
  [68, 56],
  [72, 60],
  [78, 54],
  [86, 34],
  [93, 12],
  [100, 5],
];
export const GAIT_RANGE = { min: -5, max: 75 };
export const SWING_START = 60;

export const kneeCurve = (offset = 0, gain = 1) =>
  spline(KNEE, 100).map(([pct, deg]) => [pct, deg * gain + offset] as [number, number]);

export function gaitPoints(offset = 0, gain = 1): Pt[] {
  return kneeCurve(offset, gain).map(([pct, deg]) => ({
    x: mapX(pct / 100),
    y: mapY(deg, GAIT_RANGE.min, GAIT_RANGE.max),
  }));
}

// Banda normativa (±6°) como polígono relleno.
export function gaitBand(): string {
  const base = kneeCurve();
  const top = base.map(([p, d]) => ({ x: mapX(p / 100), y: mapY(d + 6, GAIT_RANGE.min, GAIT_RANGE.max) }));
  const bot = base
    .map(([p, d]) => ({ x: mapX(p / 100), y: mapY(d - 6, GAIT_RANGE.min, GAIT_RANGE.max) }))
    .reverse();
  return toPath([...top, ...bot]) + 'Z';
}

/* ---------- Nistagmo: posición horizontal del ojo, batida derecha ---------- */

export const NYS_RANGE = { min: -8, max: 8, seconds: 8 };

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export interface NysBeat {
  start: number;
  end: number;
  slope: number;
}

export function nystagmusBeats(): NysBeat[] {
  const r = rng(11);
  const beats: NysBeat[] = [];
  let t = 0;
  while (t < NYS_RANGE.seconds) {
    const dur = 0.75 + r() * 0.45;
    beats.push({ start: t, end: Math.min(NYS_RANGE.seconds, t + dur), slope: -(5.4 + r() * 1.6) });
    t += dur;
  }
  return beats;
}

export function nystagmusPoints(): Pt[] {
  const pts: Pt[] = [];
  const toX = (s: number) => mapX(s / NYS_RANGE.seconds);
  const toY = (deg: number) => mapY(deg, NYS_RANGE.min, NYS_RANGE.max);
  for (const b of nystagmusBeats()) {
    const startDeg = 4;
    // Fase rápida previa: salto corto hacia la derecha
    pts.push({ x: toX(b.start), y: toY(startDeg) });
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const s = b.start + ((b.end - b.start) * i) / steps;
      pts.push({ x: toX(s), y: toY(startDeg + b.slope * (s - b.start)) });
    }
  }
  return pts;
}

/* ---------- Fijación: cabeza y ojo en ejercicio VOR x1 ---------- */

export const GAZE_RANGE = { min: -20, max: 20, seconds: 4, hz: 1, amp: 15 };

export const headAngle = (s: number) => GAZE_RANGE.amp * Math.sin(2 * Math.PI * GAZE_RANGE.hz * s);
export const gazeError = (s: number) =>
  0.7 * Math.sin(2 * Math.PI * 2.7 * s + 0.6) + 0.35 * Math.sin(2 * Math.PI * 5.3 * s);
export const eyeAngle = (s: number) => -headAngle(s) + gazeError(s);

export function gazePoints(which: 'head' | 'eye'): Pt[] {
  const pts: Pt[] = [];
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const s = (GAZE_RANGE.seconds * i) / n;
    const v = which === 'head' ? headAngle(s) : eyeAngle(s);
    pts.push({ x: mapX(s / GAZE_RANGE.seconds), y: mapY(v, GAZE_RANGE.min, GAZE_RANGE.max) });
  }
  return pts;
}

/* ---------- Pulso: trazo tipo ECG que recorre el monitor ---------- */

export const PULSE = { bpm: 72, beatsPerScreen: 3 };

export function pulsePoints(): Pt[] {
  // Dos pantallas seguidas para poder desplazarlas en bucle.
  const beats = PULSE.beatsPerScreen * 2;
  const w = PLOT.x1 - PLOT.x0;
  const beatW = w / PULSE.beatsPerScreen;
  const mid = (PLOT.y0 + PLOT.y1) / 2 + 60;
  const shape: [number, number][] = [
    [0, 0],
    [0.18, 0],
    [0.22, -14],
    [0.26, 0],
    [0.34, 0],
    [0.37, 22],
    [0.41, -200],
    [0.45, 58],
    [0.49, 0],
    [0.62, 0],
    [0.68, -36],
    [0.75, 0],
    [1, 0],
  ];
  const pts: Pt[] = [];
  for (let b = 0; b < beats; b++) {
    for (const [u, dy] of shape) {
      if (b > 0 && u === 0) continue;
      pts.push({ x: PLOT.x0 + (b + u) * beatW, y: mid + dy * 1.45 });
    }
  }
  return pts;
}

export const pulseShift = (PLOT.x1 - PLOT.x0);
