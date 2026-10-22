import { useEffect, useMemo, useRef, useState } from 'react';
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
  toPath,
  gaitPoints,
  gaitBand,
  kneeCurve,
  nystagmusPoints,
  nystagmusBeats,
  gazePoints,
  headAngle,
  eyeAngle,
  gazeError,
  pulsePoints,
  pulseShift,
} from '../../scripts/signals';
import './Stage.css';

gsap.registerPlugin(ScrollTrigger);

const fill = (tpl, vals) => Object.entries(vals).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), tpl);
const yOf = (v, min, max) => PLOT.y1 - ((v - min) / (max - min)) * (PLOT.y1 - PLOT.y0);
const xOf = (u) => PLOT.x0 + u * (PLOT.x1 - PLOT.x0);
const yDeg = (deg) => yOf(deg, GAIT_RANGE.min, GAIT_RANGE.max);

const knee = kneeCurve();
const kneeLeft = kneeCurve(4, 0.88);
const beats = nystagmusBeats();
const swingX = PLOT.x0 + ((PLOT.x1 - PLOT.x0) * SWING_START) / 100;

// Monitor de señales: el pulso del logo convertido en lo que mide cada producto.
// Las señales son ilustrativas (datos de ejemplo) y la pantalla lo aclara.
export default function Stage({ initial = 'pulse', tabs = [], text }) {
  const [signal, setSignal] = useState(initial);
  const [u, setU] = useState(0.72);
  const [reading, setReading] = useState(false);
  const rootRef = useRef(null);
  const pulseRef = useRef(null);
  const signalRef = useRef(initial);
  const nf1 = useMemo(
    () => new Intl.NumberFormat(text.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [text.locale],
  );

  const paths = useMemo(
    () => ({
      gait: toPath(gaitPoints()),
      left: toPath(gaitPoints(4, 0.88)),
      band: gaitBand(),
      nystagmus: toPath(nystagmusPoints()),
      head: toPath(gazePoints('head')),
      eye: toPath(gazePoints('eye')),
      pulse: toPath(pulsePoints()),
    }),
    [],
  );

  // Valores del punto leído según la señal activa.
  const at = Math.min(1, Math.max(0, u));
  let readout = text.pulse;
  let dotY = 0;
  let dot2Y = 0;
  if (signal === 'gait' || signal === 'report') {
    const pct = Math.round(at * 100);
    const deg = knee[pct][1];
    dotY = yDeg(deg);
    if (signal === 'gait') {
      readout = fill(text.gait, { pct, deg: Math.round(deg), phase: pct < SWING_START ? text.stance : text.swing });
    } else {
      const l = kneeLeft[pct][1];
      dot2Y = yDeg(l);
      readout = fill(text.report, { pct, l: Math.round(l), r: Math.round(deg) });
    }
  } else if (signal === 'nystagmus') {
    const s = at * NYS_RANGE.seconds;
    const b = beats.find((bt) => s >= bt.start && s <= bt.end) || beats[beats.length - 1];
    dotY = yOf(4 + b.slope * (s - b.start), NYS_RANGE.min, NYS_RANGE.max);
    readout = fill(text.nystagmus, { t: nf1.format(s), v: nf1.format(-b.slope) });
  } else if (signal === 'gaze') {
    const s = at * GAZE_RANGE.seconds;
    dotY = yOf(eyeAngle(s), GAZE_RANGE.min, GAZE_RANGE.max);
    dot2Y = yOf(headAngle(s), GAZE_RANGE.min, GAZE_RANGE.max);
    readout = fill(text.gaze, { t: nf1.format(s), err: nf1.format(Math.abs(gazeError(s))) });
  }
  const x = xOf(at);

  // Pulso continuo, como un monitor real.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !pulseRef.current) return undefined;
    const tween = gsap.to(pulseRef.current, {
      x: -pulseShift,
      duration: (PULSE.beatsPerScreen * 60) / PULSE.bpm,
      ease: 'none',
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  // Cada cambio de señal dibuja el trazo de nuevo.
  useEffect(() => {
    signalRef.current = signal;
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const layer = root.querySelector(`[data-layer="${signal}"]`);
    if (!layer) return undefined;
    const ctx = gsap.context(() => {
      layer.querySelectorAll('[data-draw]').forEach((p, i) => {
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
    }, root);
    return () => ctx.revert();
  }, [signal]);

  // El monitor sigue la sección que se está leyendo y los botones de producto.
  useEffect(() => {
    const triggers = [...document.querySelectorAll('[data-signal-section]')].map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setSignal(section.dataset.signalSection),
      }),
    );
    const onClick = (e) => {
      const el = e.target.closest?.('[data-show-signal]');
      if (el) setSignal(el.dataset.showSignal);
    };
    document.addEventListener('click', onClick);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', refresh);
    };
  }, []);

  const svgRef = useRef(null);
  const fromEvent = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const scale = Math.min(r.width / VIEW.w, r.height / VIEW.h);
    const left = r.left + (r.width - VIEW.w * scale) / 2;
    return ((e.clientX - left) / scale - PLOT.x0) / (PLOT.x1 - PLOT.x0);
  };
  const onPointer = (e) => {
    setReading(true);
    setU(fromEvent(e));
  };
  const onKey = (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const keys = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step };
    if (e.key in keys) setU((v) => Math.min(1, Math.max(0, v + keys[e.key])));
    else if (e.key === 'Home') setU(0);
    else if (e.key === 'End') setU(1);
    else return;
    setReading(true);
    e.preventDefault();
  };

  const tick = (tx, ty, label, end) => (
    <text className={end ? 'tick end' : 'tick'} x={tx} y={ty}>
      {label}
    </text>
  );
  const gaitTicks = (
    <>
      {tick(PLOT.x0, PLOT.y1 + 44, '0%')}
      {tick(PLOT.x1, PLOT.y1 + 44, '100%', true)}
      {tick(PLOT.x0 - 12, yDeg(0) + 8, '0°', true)}
      {tick(PLOT.x0 - 12, yDeg(60) + 8, '60°', true)}
    </>
  );

  return (
    <aside className="stage" data-signal={signal} data-reading={reading} aria-label={text.label} ref={rootRef}>
      <div className="stage-inner" data-ui="">
        <div className="stage-top">
          <p className="stage-axis">{text.axis[signal]}</p>
          {tabs.length > 1 && (
            <div className="stage-tabs" role="group" aria-label={text.label}>
              {tabs.map((id) => (
                <button key={id} type="button" aria-pressed={id === signal} onClick={() => setSignal(id)}>
                  {text.signals[id]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="stage-plot"
          tabIndex={0}
          role="slider"
          aria-label={text.hint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(at * 100)}
          aria-valuetext={readout}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onFocus={() => setReading(true)}
          onKeyDown={onKey}
        >
          <svg ref={svgRef} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <clipPath id="plot-clip">
                <rect x={PLOT.x0} y="0" width={PLOT.x1 - PLOT.x0} height={VIEW.h} />
              </clipPath>
            </defs>

            <g data-layer="pulse" clipPath="url(#plot-clip)">
              <path className="trace" ref={pulseRef} d={paths.pulse} />
            </g>

            <g data-layer="gait">
              <rect className="swing-field" x={swingX} y={PLOT.y0 - 30} width={PLOT.x1 - swingX} height={PLOT.y1 - PLOT.y0 + 30} />
              <path className="band" d={paths.band} />
              <path className="trace" data-draw="" d={paths.gait} />
              {gaitTicks}
              {tick(swingX, PLOT.y1 + 44, `${SWING_START}%`)}
              {tick(PLOT.x0 + 8, PLOT.y0 - 2, text.stance)}
              {tick(swingX + 14, PLOT.y0 - 2, text.swing)}
            </g>

            <g data-layer="report">
              <rect className="swing-field" x={swingX} y={PLOT.y0 - 30} width={PLOT.x1 - swingX} height={PLOT.y1 - PLOT.y0 + 30} />
              <path className="band" d={paths.band} />
              <path className="trace trace-soft" data-draw="" d={paths.left} />
              <path className="trace" data-draw="" d={paths.gait} />
              {gaitTicks}
            </g>

            <g data-layer="nystagmus">
              <path className="trace" data-draw="" d={paths.nystagmus} />
              {tick(PLOT.x0, PLOT.y1 + 44, '0 s')}
              {tick(PLOT.x1, PLOT.y1 + 44, `${NYS_RANGE.seconds} s`, true)}
              {tick(PLOT.x0 - 12, PLOT.y0 + 8, text.dirR, true)}
              {tick(PLOT.x0 - 12, PLOT.y1 + 8, text.dirL, true)}
            </g>

            <g data-layer="gaze">
              <path className="trace trace-soft" data-draw="" d={paths.head} />
              <path className="trace" data-draw="" d={paths.eye} />
              {tick(PLOT.x0, PLOT.y1 + 44, '0 s')}
              {tick(PLOT.x1, PLOT.y1 + 44, `${GAZE_RANGE.seconds} s`, true)}
            </g>

            <g className="cursor">
              <rect className="cursor-bar" x={x - 1.5} y={PLOT.y0 - 30} width="3" height={PLOT.y1 - PLOT.y0 + 30} />
              <circle className="cursor-dot" cx={x} cy={dotY} r="11" />
              <circle className="cursor-dot2" cx={x} cy={dot2Y} r="8" />
            </g>
          </svg>
        </div>

        <div className="stage-bottom">
          <p className="readout" aria-live="polite">
            {readout}
          </p>
          <p className="caption">{text.caption}</p>
        </div>
      </div>
    </aside>
  );
}
