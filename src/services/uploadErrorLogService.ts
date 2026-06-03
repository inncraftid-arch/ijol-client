import { clientEnv } from '../config/env';
import { supabaseRestRequest } from './clientSupabase';
import type { UploadProductFile, UploadProductFormData } from './uploadProductService';

type UploadErrorLogParams = {
  error: unknown;
  formData: UploadProductFormData;
  submissionFolder: string;
};

type NavigatorConnection = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NavigatorConnection;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : 'Unknown upload error';
};

const getErrorName = (error: unknown) => (error instanceof Error ? error.name : null);

const getCauseMessage = (error: unknown) => {
  if (!(error instanceof Error) || !('cause' in error)) {
    return null;
  }

  const cause = error.cause;

  if (cause instanceof Error) {
    return cause.message;
  }

  return typeof cause === 'string' ? cause : null;
};

const getUploadStep = (error: unknown) => {
  const message = getErrorMessage(error).toLowerCase();

  if (message.includes('gagal menyimpan user')) {
    return 'save_user';
  }

  if (message.includes('gagal upload gambar')) {
    return 'upload_images';
  }

  if (message.includes('gagal menyimpan item')) {
    return 'save_item';
  }

  if (message.includes('gagal menyimpan metadata gambar')) {
    return 'save_image_metadata';
  }

  return 'unknown';
};

const getSupabaseUrlHost = () => {
  try {
    return new URL(clientEnv.supabaseUrl).host;
  } catch {
    return '';
  }
};

const getViewportSnapshot = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
  };
};

const getConnectionSnapshot = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const connection = (navigator as NavigatorWithConnection).connection;

  if (!connection) {
    return null;
  }

  return {
    effective_type: connection.effectiveType || null,
    downlink: connection.downlink ?? null,
    rtt: connection.rtt ?? null,
    save_data: connection.saveData ?? null,
  };
};

const getBrowserSnapshot = () => {
  if (typeof navigator === 'undefined') {
    return {
      user_agent: null,
      browser_language: null,
      browser_platform: null,
      is_online: null,
    };
  }

  return {
    user_agent: navigator.userAgent || null,
    browser_language: navigator.language || null,
    browser_platform: navigator.platform || null,
    is_online: navigator.onLine,
  };
};

const getFileSnapshot = (fileData: UploadProductFile, role: string, index: number) => {
  const { file } = fileData;

  return {
    role,
    index,
    name: file.name || null,
    type: file.type || null,
    size: file.size,
    last_modified: file.lastModified || null,
    proof_kind: fileData.proofKind || null,
  };
};

const getFilesSnapshot = (formData: UploadProductFormData) => [
  ...formData.itemPhotos.map((fileData, index) => getFileSnapshot(fileData, 'item_photo', index)),
  ...formData.brandProofs.map((fileData, index) =>
    getFileSnapshot(fileData, 'brand_proof', index)
  ),
];

const getFormSnapshot = (formData: UploadProductFormData) => {
  const normalizedPhone = formData.whatsapp.replace(/\D/g, '');

  return {
    user_mode: formData.debugContext?.userMode || null,
    lookup_status: formData.debugContext?.lookupStatus || null,
    phone_last4: normalizedPhone.slice(-4) || null,
    city: formData.city || null,
    category_gender: formData.categoryGender,
    category: formData.category,
    is_branded: formData.isBranded,
    has_brand: Boolean(formData.brand),
    size_length: formData.size.length,
    condition: formData.condition,
    item_name_length: formData.itemName.length,
    description_length: formData.description.length,
    is_pre_loved: formData.isPreLoved,
    has_buy_price: Boolean(formData.buyPrice),
    is_rental: formData.isRental,
    has_rent_price: Boolean(formData.rentPrice),
    item_photo_count: formData.itemPhotos.length,
    brand_proof_count: formData.brandProofs.length,
  };
};

export const logUploadProductError = async ({
  error,
  formData,
  submissionFolder,
}: UploadErrorLogParams) => {
  const browser = getBrowserSnapshot();

  try {
    await supabaseRestRequest<null>(clientEnv.uploadErrorLogsTable, {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal',
      },
      body: {
        source: 'client-site',
        upload_flow: 'product_upload',
        step: getUploadStep(error),
        message: getErrorMessage(error),
        error_name: getErrorName(error),
        cause_message: getCauseMessage(error),
        user_mode: formData.debugContext?.userMode || null,
        upload_function: clientEnv.awsUploadFunction,
        s3_folder_prefix: clientEnv.awsUploadFolderPrefix,
        supabase_url_host: getSupabaseUrlHost(),
        user_agent: browser.user_agent,
        browser_language: browser.browser_language,
        browser_platform: browser.browser_platform,
        is_online: browser.is_online,
        viewport: getViewportSnapshot(),
        connection: getConnectionSnapshot(),
        files: getFilesSnapshot(formData),
        form_snapshot: getFormSnapshot(formData),
        extra: {
          vite_mode: import.meta.env.MODE,
          is_prod_build: import.meta.env.PROD,
          submission_folder: submissionFolder,
        },
      },
    });
  } catch (logError) {
    console.warn('Upload error log failed', logError);
  }
};
