import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// El contenido es visible sin JavaScript. El movimiento se agrega encima y
// se omite por completo con "reducir movimiento".
export function initMotion() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ease = 'expo.out';

    // Entrada del primer bloque al cargar.
    const hero = document.querySelectorAll('[data-hero] [data-rise]');
    if (hero.length) {
      gsap.from(hero, { y: 28, opacity: 0, duration: 1.1, stagger: 0.08, ease, delay: 0.1 });
    }

    // Cada sección: título, texto y piezas, escalonados al entrar.
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((section) => {
      const parts = section.querySelectorAll('[data-rise]');
      if (!parts.length) return;
      gsap.from(parts, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease,
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      });
    });

    // Filas de listas: entran en tandas a medida que aparecen.
    ScrollTrigger.batch('[data-row]', {
      start: 'top 90%',
      once: true,
      onEnter: (rows) => gsap.from(rows, { x: -16, opacity: 0, duration: 0.7, stagger: 0.05, ease }),
    });

    // El talón de "Cómo trabajamos" se imprime de arriba hacia abajo.
    const slip = document.querySelector('[data-slip]');
    if (slip) {
      gsap.fromTo(slip, { clipPath: 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: slip, start: 'top 80%', once: true },
      });
    }

    // La marca del pie sube despacio con el scroll.
    const mark = document.querySelector('[data-footer-mark]');
    if (mark) {
      gsap.fromTo(
        mark,
        { yPercent: 18 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        },
      );
    }
  });

  // Recalcular posiciones cuando terminan de cargar las fuentes.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
