import { t, type Lang } from './index';

// Textos del monitor ya resueltos (las funciones de formato pasan como plantillas).
export function stageText(lang: Lang) {
  const d = t(lang).stage;
  const r = d.readout as any;
  return {
    label: d.label,
    caption: d.caption,
    hint: d.hint,
    signals: d.signals,
    axis: d.axis,
    pulse: r.pulse(72),
    gait: r.gait('{pct}', '{deg}', '{phase}'),
    report: r.report('{pct}', '{l}', '{r}'),
    nystagmus: r.nystagmus('{t}', '{v}'),
    gaze: r.gaze('{t}', '{err}'),
    stance: r.stance,
    swing: r.swing,
    dirR: { es: 'D', en: 'R', pt: 'D' }[lang],
    dirL: { es: 'I', en: 'L', pt: 'E' }[lang],
    locale: lang === 'pt' ? 'pt-BR' : lang,
  };
}
