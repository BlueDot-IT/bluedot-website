import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import nodemailer from 'bluedot-mailer';

// Compose locally: these tests never contact an SMTP server or send mail.
test('patched mailer preserves contact-message composition', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const info = await transport.sendMail({
    from: 'BlueDot <site@example.com>',
    to: ['first@example.com', 'Second <second@example.com>'],
    replyTo: 'visitor@example.com',
    subject: 'Contact – compatibility',
    text: 'Plain message', html: '<p>HTML message</p>',
    disableFileAccess: true, disableUrlAccess: true,
    headers: { 'X-Client': 'Next.js' },
  });
  assert.deepEqual(info.envelope.to, ['first@example.com', 'second@example.com']);
  const message = info.message.toString();
  assert.match(message, /Reply-To: visitor@example.com/);
  assert.match(message, /X-Client: Next\.js/);
  assert.match(message, /Plain message/);
  assert.match(message, /<p>HTML message<\/p>/);
});

test('patched mailer retains file and URL access restrictions', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  for (const path of ['file:///definitely-not-a-mail-attachment', 'https://example.invalid/private']) {
    await assert.rejects(transport.sendMail({
      from: 'site@example.com', to: 'user@example.com',
      attachments: [{ path }], disableFileAccess: true, disableUrlAccess: true,
    }), /access rejected/i);
  }
});

test('malformed address fallback cannot block the event loop indefinitely', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import nodemailer from 'bluedot-mailer';
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
    await transport.sendMail({ from: 'site@example.com', to: ' >' + '>[x][x]'.repeat(40000), text: 'test' });
  `], { cwd: process.cwd(), timeout: 5000, encoding: 'utf8' });
  assert.equal(result.error, undefined, String(result.error));
  assert.equal(result.status, 0, result.stderr);
});
