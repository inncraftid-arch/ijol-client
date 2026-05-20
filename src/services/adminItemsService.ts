import { clientEnv } from '../config/env';
import { supabaseRestRequest } from './clientSupabase';

export type AdminItemStatus = 'pending_qc' | 'approved' | 'rejected';

export type AdminItemBrandProof = {
  url: string;
  proofKind: string;
};

export type AdminItem = {
  id: string;
  name: string;
  categoryGender: 'male' | 'female' | 'unisex';
  category: string;
  isBranded: boolean;
  brand?: string;
  size: string;
  condition: string;
  description: string;
  status: AdminItemStatus;
  canBuy: boolean;
  buyPrice: number | null;
  canRent: boolean;
  rentPrice: number | null;
  createdAt: string;
  owner: {
    name: string;
    phone: string;
    city: string;
  };
  photos: string[];
  brandProofs: AdminItemBrandProof[];
};

type AdminItemUserRecord = {
  full_name: string | null;
  phone: string | null;
  city: string | null;
};

type AdminItemPhotoRecord = {
  public_url: string | null;
  sort_order: number | null;
};

type AdminItemBrandProofRecord = {
  public_url: string | null;
  proof_kind: string | null;
};

type AdminItemRecord = {
  id: string;
  name: string | null;
  category_gender: AdminItem['categoryGender'] | null;
  category: string | null;
  is_branded: boolean | null;
  brand: string | null;
  size: string | null;
  condition: string | null;
  description: string | null;
  status: AdminItemStatus;
  can_buy: boolean | null;
  buy_price: number | null;
  can_rent: boolean | null;
  rent_price: number | null;
  created_at: string;
  users?: AdminItemUserRecord | AdminItemUserRecord[] | null;
  item_photos?: AdminItemPhotoRecord[] | null;
  item_brand_proofs?: AdminItemBrandProofRecord[] | null;
};

const getEmbeddedUser = (record: AdminItemRecord) => {
  if (Array.isArray(record.users)) {
    return record.users[0] || null;
  }

  return record.users || null;
};

const getSortedPhotos = (photos: AdminItemPhotoRecord[] | null | undefined) => {
  return [...(photos || [])]
    .filter((photo) => Boolean(photo.public_url))
    .sort((firstPhoto, secondPhoto) => (firstPhoto.sort_order || 0) - (secondPhoto.sort_order || 0))
    .map((photo) => photo.public_url as string);
};

const mapAdminItemRecord = (record: AdminItemRecord): AdminItem => {
  const owner = getEmbeddedUser(record);

  return {
    id: record.id,
    name: record.name || 'Item IJOL',
    categoryGender: record.category_gender || 'unisex',
    category: record.category || '-',
    isBranded: Boolean(record.is_branded),
    brand: record.brand || undefined,
    size: record.size || '-',
    condition: record.condition || '-',
    description: record.description || '-',
    status: record.status,
    canBuy: Boolean(record.can_buy),
    buyPrice: record.buy_price,
    canRent: Boolean(record.can_rent),
    rentPrice: record.rent_price,
    createdAt: record.created_at,
    owner: {
      name: owner?.full_name || '-',
      phone: owner?.phone || '-',
      city: owner?.city || '-',
    },
    photos: getSortedPhotos(record.item_photos),
    brandProofs: (record.item_brand_proofs || [])
      .filter((proof) => Boolean(proof.public_url))
      .map((proof) => ({
        url: proof.public_url as string,
        proofKind: proof.proof_kind || 'Proof brand',
      })),
  };
};

export const fetchAdminItems = async (accessToken: string) => {
  const records = await supabaseRestRequest<AdminItemRecord[]>(
    `${clientEnv.itemsTable}?select=id,name,category_gender,category,is_branded,brand,size,condition,description,status,can_buy,buy_price,can_rent,rent_price,created_at,users!items_user_id_fkey(full_name,phone,city),item_photos!item_photos_item_id_fkey(public_url,sort_order),item_brand_proofs!item_brand_proofs_item_id_fkey(public_url,proof_kind)&order=created_at.desc&limit=500`,
    { authToken: accessToken }
  );

  return records.map(mapAdminItemRecord);
};

export const updateAdminItemStatus = async (
  accessToken: string,
  itemId: string,
  status: AdminItemStatus
) => {
  await supabaseRestRequest<null>(`${clientEnv.itemsTable}?id=eq.${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=minimal',
    },
    authToken: accessToken,
    body: {
      status,
      updated_at: new Date().toISOString(),
    },
  });
};
