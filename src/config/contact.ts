export const contactEmail = 'social@ijol.store';
export const contactEmailUrl = `mailto:${contactEmail}`;

export const contactWhatsAppNumber = '6285173114050';

export const createWhatsAppUrl = (message: string, phoneNumber = contactWhatsAppNumber) => {
  const params = new URLSearchParams({
    phone: phoneNumber,
    text: message,
  });

  return `https://api.whatsapp.com/send?${params.toString()}`;
};
