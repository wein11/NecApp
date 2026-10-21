type Gtag = (...args: unknown[]) => void;
const track = (name: string, params: Record<string, unknown> = {}) =>
  (window as unknown as { gtag?: Gtag }).gtag?.('event', name, params);

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-status]')!;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const msg = JSON.parse(form.dataset.messages || '{}');
    const label = button.textContent;

    form.noValidate = true;

    const showError = (field: HTMLInputElement, text: string) => {
      const out = form.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
      field.setAttribute('aria-invalid', 'true');
      if (out) out.textContent = text;
    };

    form.addEventListener('input', (e) => {
      const field = e.target as HTMLInputElement;
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        field.removeAttribute('aria-invalid');
        const out = form.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
        if (out) out.textContent = '';
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let first: HTMLInputElement | null = null;
      form.querySelectorAll<HTMLInputElement>('input, select, textarea').forEach((field) => {
        if (field.type === 'hidden' || field.type === 'checkbox') return;
        if (!field.checkValidity()) {
          showError(field, field.validity.typeMismatch ? msg.invalidEmail : msg.required);
          first ??= field;
        }
      });
      if (first) {
        (first as HTMLInputElement).focus();
        return;
      }

      if (form.dataset.pending === 'true') {
        status.textContent = msg.pending;
        status.dataset.state = 'error';
        return;
      }

      button.disabled = true;
      button.textContent = msg.sending;
      status.textContent = '';
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error('send');
        form.reset();
        status.textContent = msg.success;
        status.dataset.state = 'ok';
        track('generate_lead', { form: form.dataset.leadForm, product: data.producto, reason: data.motivo });
      } catch {
        status.textContent = msg.error;
        status.dataset.state = 'error';
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-wa]').forEach((a) =>
    a.addEventListener('click', () => track('contact_whatsapp', { location: a.dataset.wa })),
  );
}
