import { clientEnv } from '../config/env';
import type { Product } from '../types';
import { mapProductRecord, type ProductRecord } from './collectionsService';
import { supabaseRestRequest, supabaseRpcRequest } from './clientSupabase';

export type AdminSwapRequestStatus =
  | 'pending_admin_review'
  | 'owner_contacted'
  | 'accepted_by_owner'
  | 'rejected_by_owner'
  | 'closed_other_offer_accepted'
  | 'cancelled_by_requester'
  | 'cancelled_by_admin'
  | 'completed';

export type AdminSwapUser = {
  id: string;
  name: string;
  phone: string;
  city: string;
};

export type AdminSwapRequest = {
  id: string;
  status: AdminSwapRequestStatus;
  targetItem: Product;
  targetOwner: AdminSwapUser;
  requester: AdminSwapUser;
  offeredItems: Product[];
  selectedOfferedItemId?: string;
  reviewToken: string;
  reviewTokenExpiresAt: string;
  ownerContactedAt?: string;
  ownerResponseAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
  createdAt: string;
};

type SwapRequestRecord = {
  id: string;
  target_item_id: string;
  target_owner_user_id: string;
  requester_user_id: string;
  offered_item_ids: string[];
  selected_offered_item_id: string | null;
  review_token: string;
  review_token_expires_at: string;
  status: AdminSwapRequestStatus;
  owner_contacted_at: string | null;
  owner_response_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  completed_at: string | null;
  created_at: string;
};

type UserRecord = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
};

const itemSelect =
  'id,item_code,user_id,name,category_gender,category,is_branded,brand,size,condition,description,can_buy,buy_price,can_rent,rent_price,status,availability_status,users!items_user_id_fkey(full_name,city),item_photos!item_photos_item_id_fkey(public_url,sort_order)';

const buildInFilter = (ids: string[]) => `in.(${ids.join(',')})`;

const unique = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.filter(Boolean) as string[]));

const fallbackUser = (id: string): AdminSwapUser => ({
  id,
  name: '-',
  phone: '-',
  city: '-',
});

const fallbackProduct = (id: string): Product => ({
  id,
  name: 'Item tidak ditemukan',
  label: id.slice(0, 6).toUpperCase(),
  isNonBranded: true,
  image: '/assets/images/clothes.2.png',
  images: ['/assets/images/clothes.2.png'],
  sizes: ['-'],
  condition: '-',
  owner: {
    name: '-',
  },
  location: '-',
  category: 'unisex',
  canSwap: true,
});

const mapUserRecord = (record: UserRecord): AdminSwapUser => ({
  id: record.id,
  name: record.full_name || '-',
  phone: record.phone || '-',
  city: record.city || '-',
});

const fetchUsersByIds = async (accessToken: string, userIds: string[]) => {
  if (!userIds.length) {
    return new Map<string, AdminSwapUser>();
  }

  const records = await supabaseRestRequest<UserRecord[]>(
    `${clientEnv.usersTable}?select=id,full_name,phone,city&id=${buildInFilter(userIds)}`,
    { authToken: accessToken }
  );

  return new Map(records.map((record) => [record.id, mapUserRecord(record)]));
};

const fetchItemsByIds = async (accessToken: string, itemIds: string[]) => {
  if (!itemIds.length) {
    return new Map<string, Product>();
  }

  const records = await supabaseRestRequest<ProductRecord[]>(
    `${clientEnv.itemsTable}?select=${itemSelect}&id=${buildInFilter(itemIds)}`,
    { authToken: accessToken }
  );

  return new Map(records.map((record) => [record.id, mapProductRecord(record)]));
};

export const fetchAdminSwapRequests = async (accessToken: string) => {
  const records = await supabaseRestRequest<SwapRequestRecord[]>(
    `${clientEnv.swapRequestsTable}?select=id,target_item_id,target_owner_user_id,requester_user_id,offered_item_ids,selected_offered_item_id,review_token,review_token_expires_at,status,owner_contacted_at,owner_response_at,accepted_at,rejected_at,completed_at,created_at&order=created_at.desc&limit=500`,
    { authToken: accessToken }
  );
  const itemIds = unique(
    records.flatMap((record) => [
      record.target_item_id,
      record.selected_offered_item_id,
      ...(record.offered_item_ids || []),
    ])
  );
  const userIds = unique(
    records.flatMap((record) => [record.target_owner_user_id, record.requester_user_id])
  );
  const [itemsById, usersById] = await Promise.all([
    fetchItemsByIds(accessToken, itemIds),
    fetchUsersByIds(accessToken, userIds),
  ]);

  return records.map<AdminSwapRequest>((record) => ({
    id: record.id,
    status: record.status,
    targetItem: itemsById.get(record.target_item_id) || fallbackProduct(record.target_item_id),
    targetOwner: usersById.get(record.target_owner_user_id) || fallbackUser(record.target_owner_user_id),
    requester: usersById.get(record.requester_user_id) || fallbackUser(record.requester_user_id),
    offeredItems: (record.offered_item_ids || []).map(
      (itemId) => itemsById.get(itemId) || fallbackProduct(itemId)
    ),
    selectedOfferedItemId: record.selected_offered_item_id || undefined,
    reviewToken: record.review_token,
    reviewTokenExpiresAt: record.review_token_expires_at,
    ownerContactedAt: record.owner_contacted_at || undefined,
    ownerResponseAt: record.owner_response_at || undefined,
    acceptedAt: record.accepted_at || undefined,
    rejectedAt: record.rejected_at || undefined,
    completedAt: record.completed_at || undefined,
    createdAt: record.created_at,
  }));
};

export const markSwapOwnerContacted = async (accessToken: string, targetItemId: string) => {
  await supabaseRpcRequest(
    'admin_mark_swap_owner_contacted',
    { p_target_item_id: targetItemId },
    { authToken: accessToken }
  );
};

export const acceptAdminSwapOffer = async (
  accessToken: string,
  requestId: string,
  selectedOfferedItemId: string
) => {
  await supabaseRpcRequest(
    'admin_accept_swap_offer',
    {
      p_swap_request_id: requestId,
      p_selected_offered_item_id: selectedOfferedItemId,
    },
    { authToken: accessToken }
  );
};

export const rejectAdminSwapOffer = async (accessToken: string, requestId: string) => {
  await supabaseRpcRequest(
    'admin_reject_swap_offer',
    {
      p_swap_request_id: requestId,
      p_admin_note: null,
    },
    { authToken: accessToken }
  );
};

export const completeAdminSwap = async (accessToken: string, requestId: string) => {
  await supabaseRpcRequest(
    'admin_complete_swap',
    { p_swap_request_id: requestId },
    { authToken: accessToken }
  );
};
