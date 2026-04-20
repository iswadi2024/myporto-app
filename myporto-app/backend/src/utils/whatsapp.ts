/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from './prisma';

const getSetting = async (key: string, fallback = ''): Promise<string> => {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { key } });
    return s?.value || fallback;
  } catch {
    return fallback;
  }
};

const sendWA = async (to: string, message: string): Promise<boolean> => {
  const token = await getSetting('fonnte_token', process.env.FONNTE_TOKEN || '');
  if (!token || token === 'your-fonnte-token') {
    console.log('[WA] Fonnte token belum dikonfigurasi, skip notifikasi');
    return false;
  }
  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: to, message, countryCode: '62' }),
    });
    const text = await res.text();
    let ok = false;
    try { ok = (JSON.parse(text) as any).status === true; } catch { ok = false; }
    if (ok) { console.log(`[WA] ✓ Terkirim ke ${to}`); return true; }
    console.error('[WA] Gagal:', text);
    return false;
  } catch (err) {
    console.error('[WA] Error:', err);
    return false;
  }
};

export const notifyAdminBuktiBayar = async (opts: {
  nama: string; email: string; orderId: string; amount: number; buktiUrl: string;
}) => {
  const adminWa = await getSetting('admin_wa_number', process.env.ADMIN_WA_NUMBER || '');
  if (!adminWa) return;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const msg =
    `🔔 *Bukti Pembayaran Masuk!*\n\n` +
    `👤 *Nama:* ${opts.nama}\n📧 *Email:* ${opts.email}\n` +
    `🧾 *Order ID:* ${opts.orderId}\n💰 *Nominal:* Rp ${opts.amount.toLocaleString('id-ID')}\n\n` +
    `📎 *Bukti:*\n${opts.buktiUrl}\n\n✅ Konfirmasi: ${frontendUrl}/admin/payments`;
  await sendWA(adminWa, msg);
};

export const notifyUserPaymentConfirmed = async (opts: {
  waNumber: string; nama: string; username: string; domain: string;
}) => {
  if (!opts.waNumber) return;
  const url = `https://${opts.username}.${opts.domain}`;
  const msg =
    `✅ *Pembayaran Dikonfirmasi!*\n\nHalo *${opts.nama}*,\n\n` +
    `Portofolio Anda sudah *aktif & publik*! 🎉\n\n🌐 *Link:*\n${url}\n\n` +
    `Terima kasih telah menggunakan *MyPorto*! 🚀`;
  await sendWA(opts.waNumber, msg);
};

export const notifyUserPaymentRejected = async (opts: {
  waNumber: string; nama: string; catatan?: string;
}) => {
  if (!opts.waNumber) return;
  const msg =
    `❌ *Pembayaran Ditolak*\n\nHalo *${opts.nama}*,\n\n` +
    `Bukti pembayaran tidak dapat dikonfirmasi.\n` +
    (opts.catatan ? `📝 *Alasan:* ${opts.catatan}\n\n` : '\n') +
    `Silakan upload ulang bukti yang valid.\n\n_MyPorto Support_`;
  await sendWA(opts.waNumber, msg);
};
