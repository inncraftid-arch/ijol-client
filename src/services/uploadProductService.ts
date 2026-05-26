import { clientEnv } from '../config/env';
import { uploadFileDirectToAws, type AwsUploadResult } from './awsUploadService';
import { supabaseRestRequest } from './clientSupabase';
import { upsertUploadUser } from './usersService';

type ProofKind = 'Label' | 'Tag' | 'Nota';

export type UploadProductFile = {
  file: File;
  proofKind?: ProofKind;
};

export type UploadProductFormData = {
  fullName: string;
  whatsapp: string;
  city: string;
  itemName: string;
  categoryGender: 'male' | 'female' | 'unisex';
  category: string;
  isBranded: boolean;
  brand?: string;
  size: string;
  condition: string;
  description: string;
  isPreLoved: boolean;
  buyPrice?: string;
  isRental: boolean;
  rentPrice?: string;
  itemPhotos: UploadProductFile[];
  brandProofs: UploadProductFile[];
};

const normalizePrice = (price?: string) => {
  const numericValue = price?.replace(/\D/g, '') || '';
  return numericValue ? Number(numericValue) : null;
};

const uploadFiles = async (
  files: UploadProductFile[],
  folder: string
): Promise<Array<AwsUploadResult & { proofKind?: ProofKind }>> => {
  const uploadedFiles: Array<AwsUploadResult & { proofKind?: ProofKind }> = [];

  for (const [index, fileData] of files.entries()) {
    try {
      uploadedFiles.push({
        ...(await uploadFileDirectToAws({ file: fileData.file, folder })),
        proofKind: fileData.proofKind,
      });
    } catch (error) {
      throw new Error(
        `File ke-${index + 1} gagal. ${error instanceof Error ? error.message : 'Request gagal.'}`,
        { cause: error }
      );
    }
  }

  return uploadedFiles;
};

const withStepError = async <T>(step: string, action: () => Promise<T>) => {
  try {
    return await action();
  } catch (error) {
    throw new Error(`${step}: ${error instanceof Error ? error.message : 'Request gagal.'}`, {
      cause: error,
    });
  }
};

export const submitUploadProduct = async (formData: UploadProductFormData) => {
  const uploadUser = await withStepError('Gagal menyimpan user', () =>
    upsertUploadUser({
      fullName: formData.fullName,
      phone: formData.whatsapp,
      city: formData.city,
    })
  );
  const submissionFolder = `ijol-mvp/${Date.now()}-${crypto.randomUUID()}`;
  const { itemPhotos, brandProofs } = await withStepError('Gagal upload gambar', async () => {
    const uploadedItemPhotos = await uploadFiles(formData.itemPhotos, `${submissionFolder}/items`);
    const uploadedBrandProofs = await uploadFiles(
      formData.brandProofs,
      `${submissionFolder}/brand-proofs`
    );

    return {
      itemPhotos: uploadedItemPhotos,
      brandProofs: uploadedBrandProofs,
    };
  });

  const item = { id: crypto.randomUUID() };

  await withStepError('Gagal menyimpan item', () =>
    supabaseRestRequest<null>(clientEnv.itemsTable, {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal',
      },
      body: {
        id: item.id,
        user_id: uploadUser.id,
        name: formData.itemName,
        category_gender: formData.categoryGender,
        category: formData.category,
        is_branded: formData.isBranded,
        brand: formData.brand || null,
        size: formData.size,
        condition: formData.condition,
        description: formData.description,
        can_buy: formData.isPreLoved,
        buy_price: normalizePrice(formData.buyPrice),
        can_rent: formData.isRental,
        rent_price: normalizePrice(formData.rentPrice),
        status: 'pending_qc',
        source: 'client-site',
      },
    })
  );

  await withStepError('Gagal menyimpan metadata gambar', () =>
    Promise.all([
      itemPhotos.length
        ? supabaseRestRequest<null>(clientEnv.itemPhotosTable, {
            method: 'POST',
            headers: {
              Prefer: 'return=minimal',
            },
            body: itemPhotos.map((photo, index) => ({
              item_id: item.id,
              storage_key: photo.key,
              public_url: photo.publicUrl,
              file_name: photo.fileName,
              file_size: photo.fileSize,
              content_type: photo.contentType,
              sort_order: index,
            })),
        })
      : Promise.resolve([]),
      brandProofs.length
        ? supabaseRestRequest<null>(clientEnv.itemBrandProofsTable, {
            method: 'POST',
            headers: {
              Prefer: 'return=minimal',
            },
            body: brandProofs.map((proof) => ({
              item_id: item.id,
              proof_kind: proof.proofKind || null,
              storage_key: proof.key,
              public_url: proof.publicUrl,
              file_name: proof.fileName,
              file_size: proof.fileSize,
              content_type: proof.contentType,
            })),
          })
        : Promise.resolve([]),
    ])
  );

  return item;
};
