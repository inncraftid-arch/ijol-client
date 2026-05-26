export const contactEmail = 'social@ijol.store';
export const contactEmailUrl = `mailto:${contactEmail}`;

export const contactWhatsAppNumber = '6281234567890';

export const createWhatsAppUrl = (message: string, phoneNumber = contactWhatsAppNumber) =>
  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
