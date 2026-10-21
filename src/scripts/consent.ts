const KEY = 'necapp-consent';

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (v: string) => {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* sin almacenamiento: se vuelve a preguntar en la próxima visita */
  }
};

function loadAnalytics(gaId: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag('js', new Date());
  w.gtag('config', gaId, { anonymize_ip: true });
}

export function initConsent() {
  const banner = document.querySelector<HTMLElement>('[data-consent]');
  if (!banner) return;
  const gaId = banner.dataset.ga || '';
  if (!gaId) return;

  const choice = read();
  if (choice === 'yes') return loadAnalytics(gaId);
  if (choice === 'no') return;

  banner.hidden = false;
  banner.querySelector('[data-accept]')?.addEventListener('click', () => {
    write('yes');
    banner.hidden = true;
    loadAnalytics(gaId);
  });
  banner.querySelector('[data-reject]')?.addEventListener('click', () => {
    write('no');
    banner.hidden = true;
  });
}
