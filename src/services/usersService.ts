import { clientEnv } from '../config/env';
import { supabaseRestRequest } from './clientSupabase';

export type ExistingUploadUser = {
  id: string;
  fullName: string;
  phone: string;
  city: string;
};

export type UpsertUploadUserInput = {
  fullName: string;
  phone: string;
  city: string;
};

type ExistingUploadUserRecord = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
};

export const sanitizePhoneNumberInput = (value: string) => value.replace(/\D/g, '').slice(0, 14);

export const validatePhoneNumberInput = (value: string) => {
  const phone = sanitizePhoneNumberInput(value);

  if (!phone) {
    return 'Masukkan nomor WhatsApp terlebih dahulu.';
  }

  if (!phone.startsWith('08')) {
    return 'Nomor WhatsApp harus diawali 08.';
  }

  if (phone.length < 10) {
    return 'Nomor WhatsApp minimal 10 digit.';
  }

  if (phone.length > 14) {
    return 'Nomor WhatsApp maksimal 14 digit.';
  }

  return '';
};

export const findExistingUploadUserByPhone = async (
  phone: string
): Promise<ExistingUploadUser | null> => {
  const sanitizedPhone = sanitizePhoneNumberInput(phone);
  const validationMessage = validatePhoneNumberInput(sanitizedPhone);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const records = await supabaseRestRequest<ExistingUploadUserRecord[]>(
    `${clientEnv.usersTable}?select=id,full_name,phone,city&phone=eq.${encodeURIComponent(
      sanitizedPhone
    )}&limit=1`
  );
  const user = records[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.full_name || '',
    phone: user.phone || sanitizedPhone,
    city: user.city || '',
  };
};

export const upsertUploadUser = async ({
  fullName,
  phone,
  city,
}: UpsertUploadUserInput): Promise<ExistingUploadUser> => {
  const sanitizedPhone = sanitizePhoneNumberInput(phone);
  const validationMessage = validatePhoneNumberInput(sanitizedPhone);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const trimmedFullName = fullName.trim();
  const trimmedCity = city.trim();

  if (!trimmedFullName) {
    throw new Error('Nama lengkap wajib diisi.');
  }

  if (!trimmedCity) {
    throw new Error('Kota domisili wajib dipilih.');
  }

  const records = await supabaseRestRequest<ExistingUploadUserRecord[]>(
    `${clientEnv.usersTable}?on_conflict=phone`,
    {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: {
        full_name: trimmedFullName,
        phone: sanitizedPhone,
        city: trimmedCity,
      },
    }
  );
  const user = records[0];

  if (!user) {
    throw new Error('Gagal menyimpan data user.');
  }

  return {
    id: user.id,
    fullName: user.full_name || trimmedFullName,
    phone: user.phone || sanitizedPhone,
    city: user.city || trimmedCity,
  };
};
