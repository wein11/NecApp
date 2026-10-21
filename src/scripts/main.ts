import { initStage } from './stage-client';
import { initMotion } from './motion';
import { initForms } from './forms';
import { initConsent } from './consent';

document.documentElement.classList.add('js');
initStage();
initMotion();
initForms();
initConsent();

// Menú del teléfono
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
if (toggle && menu) {
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.dataset.open = 'false';
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.dataset.open = String(open);
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
}
