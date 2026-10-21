import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  VIEW,
  PLOT,
  GAIT_RANGE,
  NYS_RANGE,
  GAZE_RANGE,
  PULSE,
  SWING_START,
  kneeCurve,
  nystagmusBeats,
  headAngle,
  eyeAngle,
  gazeError,
  pulseShift,
  type SignalId,
} from './signals';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fill = (tpl: string, vals: Record<string, string | number>) =>
  Object.entries(vals).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), tpl);

const yOf = (v: number, min: number, max: number) =>
  PLOT.y1 - ((v - min) / (max - min)) * (PLOT.y1 - PLOT.y0);
const xOf = (u: number) => PLOT.x0 + u * (PLOT.x1 - PLOT.x0);

const knee = kneeCurve();
const kneeLeft = kneeCurve(4, 0.88);
const beats = nystagmusBeats();

export function initStage() {
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  if (!stage) return;

  const tpl = JSON.parse(stage.dataset.templates || '{}');
  const nf1 = new Intl.NumberFormat(tpl.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const axis = stage.querySelector<HTMLElement>('[data-axis]')!;
  const readout = stage.querySelector<HTMLElement>('[data-readout]')!;
  const plot = stage.querySelector<HTMLElement>('[data-plot]')!;
  const svg = plot.querySelector('svg')!;
  const bar = stage.querySelector<SVGRectElement>('[data-cursor-bar]')!;
  const dot = stage.querySelector<SVGCircleElement>('[data-cursor-dot]')!;
  const dot2 = stage.querySelector<SVGCircleElement>('[data-cursor-dot2]')!;
  const tabs = [...stage.querySelectorAll<HTMLButtonElement>('[data-tab]')];

  let signal = (stage.dataset.signal || 'pulse') as SignalId;
  let u = 0.72;

  // Pulso continuo, como un monitor real.
  const pulse = stage.querySelector<SVGPathElement>('[data-pulse]');
  if (pulse && !reduced) {
    gsap.to(pulse, {
      x: -pulseShift,
      duration: (PULSE.beatsPerScreen * 60) / PULSE.bpm,
      ease: 'none',
      repeat: -1,
    });
  }

  function read(at: number) {
    u = Math.min(1, Math.max(0, at));
    let text = '';
    let x = xOf(u);
    let y = 0;
    let y2 = 0;

    if (signal === 'pulse') {
      text = tpl.pulse;
    } else if (signal === 'gait' || signal === 'report') {
      const pct = Math.round(u * 100);
      const deg = knee[pct][1];
      y = yOf(deg, GAIT_RANGE.min, GAIT_RANGE.max);
      if (signal === 'gait') {
        text = fill(tpl.gait, {
          pct,
          deg: Math.round(deg),
          phase: pct < SWING_START ? tpl.stance : tpl.swing,
        });
      } else {
        const l = kneeLeft[pct][1];
        y2 = yOf(l, GAIT_RANGE.min, GAIT_RANGE.max);
        text = fill(tpl.report, { pct, l: Math.round(l), r: Math.round(deg) });
      }
    } else if (signal === 'nystagmus') {
      const s = u * NYS_RANGE.seconds;
      const b = beats.find((bt) => s >= bt.start && s <= bt.end) || beats[beats.length - 1];
      const pos = 4 + b.slope * (s - b.start);
      y = yOf(pos, NYS_RANGE.min, NYS_RANGE.max);
      text = fill(tpl.nystagmus, { t: nf1.format(s), v: nf1.format(-b.slope) });
    } else if (signal === 'gaze') {
      const s = u * GAZE_RANGE.seconds;
      y = yOf(eyeAngle(s), GAZE_RANGE.min, GAZE_RANGE.max);
      y2 = yOf(headAngle(s), GAZE_RANGE.min, GAZE_RANGE.max);
      text = fill(tpl.gaze, { t: nf1.format(s), err: nf1.format(Math.abs(gazeError(s))) });
    }

    readout.textContent = text;
    bar.setAttribute('x', String(x - 1.5));
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    dot2.setAttribute('cx', String(x));
    dot2.setAttribute('cy', String(y2));
    plot.setAttribute('aria-valuenow', String(Math.round(u * 100)));
    plot.setAttribute('aria-valuetext', text);
  }

  function draw() {
    if (reduced) return;
    const layer = stage!.querySelector(`[data-layer="${signal}"]`);
    if (!layer) return;
    const paths = layer.querySelectorAll<SVGPathElement>('[data-draw]');
    paths.forEach((p, i) => {
      if (p.classList.contains('trace-soft')) {
        gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.2, ease: 'power2.out' });
        return;
      }
      const len = p.getTotalLength();
      gsap.fromTo(
        p,
        { strokeDasharray: `${len} ${len}`, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.4, delay: i * 0.15, ease: 'power3.out' },
      );
    });
    const band = layer.querySelector('.band');
    if (band) gsap.fromTo(band, { opacity: 0 }, { opacity: 0.22, duration: 1, delay: 0.3, ease: 'power2.out' });
  }

  function set(next: SignalId, animate = true) {
    if (!stage!.querySelector(`[data-layer="${next}"]`)) return;
    const changed = next !== signal;
    signal = next;
    stage!.dataset.signal = next;
    axis.textContent = tpl.axis[next];
    tabs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === next)));
    read(u);
    if (changed && animate) draw();
  }

  // Lectura con puntero (mouse o dedo) y teclado.
  const fromEvent = (e: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    const scale = Math.min(r.width / VIEW.w, r.height / VIEW.h);
    const left = r.left + (r.width - VIEW.w * scale) / 2;
    return ((e.clientX - left) / scale - PLOT.x0) / (PLOT.x1 - PLOT.x0);
  };
  plot.addEventListener('pointermove', (e) => {
    stage.dataset.reading = 'true';
    read(fromEvent(e));
  });
  plot.addEventListener('pointerdown', (e) => {
    stage.dataset.reading = 'true';
    read(fromEvent(e));
  });
  plot.addEventListener('focus', () => {
    stage.dataset.reading = 'true';
    read(u);
  });
  plot.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') read(u + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') read(u - step);
    else if (e.key === 'Home') read(0);
    else if (e.key === 'End') read(1);
    else return;
    e.preventDefault();
  });

  tabs.forEach((b) => b.addEventListener('click', () => set(b.dataset.tab as SignalId)));

  // El monitor cambia de señal según la sección que se está leyendo.
  document.querySelectorAll<HTMLElement>('[data-signal-section]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) set(section.dataset.signalSection as SignalId);
      },
    });
  });

  // Los botones de producto también cambian la señal.
  document.querySelectorAll<HTMLElement>('[data-show-signal]').forEach((el) =>
    el.addEventListener('click', () => set(el.dataset.showSignal as SignalId)),
  );

  read(u);
  draw();
  return { set };
}
