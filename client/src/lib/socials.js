import {
  FaBehance,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSnapchat,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { Mail, Phone } from 'lucide-react';

const digits = (value) => String(value || '').replace(/[^\d]/g, '');

export const waLink = (number) => (digits(number) ? `https://wa.me/${digits(number)}` : '');
export const telLink = (number) => {
  const clean = String(number || '').replace(/[^\d+]/g, '');
  return clean ? `tel:${clean}` : '';
};

const SOCIAL_META = {
  linkedin: { label: 'LinkedIn', Icon: FaLinkedinIn },
  instagram: { label: 'Instagram', Icon: FaInstagram },
  x: { label: 'X', Icon: FaXTwitter },
  facebook: { label: 'Facebook', Icon: FaFacebookF },
  tiktok: { label: 'TikTok', Icon: FaTiktok },
  snapchat: { label: 'Snapchat', Icon: FaSnapchat },
  youtube: { label: 'YouTube', Icon: FaYoutube },
  behance: { label: 'Behance', Icon: FaBehance },
};

/**
 * Every contact/social channel that has a value, as { key, label, href, Icon, external }.
 * Channels without a link are skipped, so they never show on the site.
 */
export function contactChannels(site = {}) {
  const out = [];
  const wa = waLink(site.whatsapp);
  if (wa) out.push({ key: 'whatsapp', label: 'WhatsApp', href: wa, Icon: FaWhatsapp, external: true });
  const tel = telLink(site.phone);
  if (tel) out.push({ key: 'phone', label: 'Call', href: tel, Icon: Phone, external: false });
  if (site.email) {
    out.push({ key: 'email', label: site.email, href: `mailto:${site.email}`, Icon: Mail, external: false });
  }
  for (const [key, meta] of Object.entries(SOCIAL_META)) {
    const href = String(site.socials?.[key] || '').trim();
    if (href) out.push({ key, label: meta.label, href, Icon: meta.Icon, external: true });
  }
  return out;
}
