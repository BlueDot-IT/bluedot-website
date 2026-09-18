'use strict';
(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  const button = document.getElementById('contact-submit');
  if (!form || !status || !button) return;
  button.disabled = false;
  let startedAt = Date.now();
  const chosen = new URLSearchParams(location.search).get('service');
  if (['security', 'automation', 'software'].includes(chosen)) form.elements.service.value = chosen;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    status.hidden = false;
    status.setAttribute('role', 'status');
    status.textContent = 'Sending your inquiry...';
    const fields = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: fields.name, email: fields.email, service: fields.service,
          stage: fields.stage, subject: fields.subject, message: fields.message,
          timing: fields.timing || '', startedAt, hp: fields.hp || '',
        }),
        signal: AbortSignal.timeout(20000),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.ok !== true) {
        throw new Error(payload?.error || 'Your inquiry could not be sent. Please try again.');
      }
      form.reset();
      startedAt = Date.now();
      status.textContent = 'Inquiry sent. BlueDot will reply using the email address you provided.';
    } catch (error) {
      status.setAttribute('role', 'alert');
      status.textContent = error.name === 'TimeoutError'
        ? 'No delivery confirmation was received. Your entries are preserved. Please wait before trying again to avoid sending a duplicate.'
        : error instanceof Error ? error.message : 'Your inquiry could not be sent. Please try again.';
    } finally {
      button.disabled = false;
      status.focus();
    }
  });
})();
