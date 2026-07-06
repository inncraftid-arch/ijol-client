import { clientEnv } from '../config/env';
import type { Product } from '../types';
import { notifyAdmin } from './adminNotificationService';
import { mapProductRecord, type ProductRecord } from './collectionsService';
import { supabaseRestRequest } from './clientSupabase';

export type UserSwapCatalogResult = {
  approvedItems: Product[];
  pendingQcCount: number;
};

export type CreateSwapRequestInput = {
  targetItemId: string;
  targetOwnerUserId: string;
  requesterUserId: string;
  offeredItemIds: string[];
};

export const fetchUserSwapCatalog = async (
  userId: string,
  targetItemId: string
): Promise<UserSwapCatalogResult> => {
  const encodedUserId = encodeURIComponent(userId);
  const records = await supabaseRestRequest<ProductRecord[]>(
    `${clientEnv.itemsTable}?select=id,item_code,user_id,name,category_gender,category,is_branded,brand,size,condition,description,can_buy,buy_price,can_rent,rent_price,status,availability_status,users!items_user_id_fkey(full_name,city),item_photos!item_photos_item_id_fkey(public_url,sort_order)&user_id=eq.${encodedUserId}&status=in.(approved,pending_qc)&order=created_at.desc&limit=100`
  );

  const approvedItems = records
    .filter(
      (record) =>
        record.status === 'approved' &&
        (record.availability_status || 'available') === 'available' &&
        record.id !== targetItemId
    )
    .map(mapProductRecord);

  return {
    approvedItems,
    pendingQcCount: records.filter((record) => record.status === 'pending_qc').length,
  };
};

export const createSwapRequest = async ({
  targetItemId,
  targetOwnerUserId,
  requesterUserId,
  offeredItemIds,
}: CreateSwapRequestInput) => {
  if (!offeredItemIds.length) {
    throw new Error('Pilih minimal satu pakaian untuk ditukar.');
  }

  if (!targetOwnerUserId) {
    throw new Error('Data pemilik item belum tersedia.');
  }

  if (targetOwnerUserId === requesterUserId) {
    throw new Error('Kamu tidak bisa mengajukan tukar untuk item milikmu sendiri.');
  }

  const requestId = crypto.randomUUID();

  await supabaseRestRequest<null>(clientEnv.swapRequestsTable, {
    method: 'POST',
    headers: {
      Prefer: 'return=minimal',
    },
    body: {
      id: requestId,
      target_item_id: targetItemId,
      target_owner_user_id: targetOwnerUserId,
      requester_user_id: requesterUserId,
      offered_item_ids: offeredItemIds,
      status: 'pending_admin_review',
      source: 'client-site',
    },
  });

  void notifyAdmin('swap_requested');

  return requestId;
};
