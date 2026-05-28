import { sanitizePhoneNumberInput, validatePhoneNumberInput } from './usersService';
import { supabaseRpcRequest } from './clientSupabase';

export type SwapReviewItem = {
  id: string;
  name: string;
  label: string;
  image: string;
  size: string;
  condition: string;
  brandStatus: string;
  ownerName?: string;
  location?: string;
};

export type SwapReviewOffer = {
  requestId: string;
  requesterName: string;
  requesterCity: string;
  status: string;
  offeredItems: SwapReviewItem[];
};

export type SwapReviewData = {
  verified: boolean;
  message?: string;
  sessionStatus: string;
  targetItem: SwapReviewItem;
  offers: SwapReviewOffer[];
};

type VerifySwapReviewResponse = {
  verified?: boolean;
  message?: string;
  session_status?: string;
  target_item?: {
    id: string;
    item_code?: string | null;
    name: string;
    label: string;
    image: string;
    size: string;
    condition: string;
    brand_status: string;
    owner_name?: string;
    location?: string;
  };
  offers?: Array<{
    request_id: string;
    requester_name: string;
    requester_city: string;
    status: string;
    offered_items: Array<{
      id: string;
      item_code?: string | null;
      name: string;
      label: string;
      image: string;
      size: string;
      condition: string;
      brand_status: string;
    }>;
  }>;
};

const mapReviewItem = (item: NonNullable<VerifySwapReviewResponse['target_item']>): SwapReviewItem => ({
  id: item.id,
  name: item.name,
  label: item.label,
  image: item.image,
  size: item.size,
  condition: item.condition,
  brandStatus: item.brand_status,
  ownerName: item.owner_name,
  location: item.location,
});

export const verifySwapReviewOwner = async (
  token: string,
  phone: string
): Promise<SwapReviewData> => {
  const sanitizedPhone = sanitizePhoneNumberInput(phone);
  const validationMessage = validatePhoneNumberInput(sanitizedPhone);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const response = await supabaseRpcRequest<VerifySwapReviewResponse>('verify_swap_review_owner', {
    p_token: token,
    p_phone: sanitizedPhone,
  });

  if (!response.verified || !response.target_item) {
    throw new Error(response.message || 'Nomor WhatsApp tidak sesuai dengan pemilik item.');
  }

  return {
    verified: true,
    message: response.message,
    sessionStatus: response.session_status || 'active',
    targetItem: mapReviewItem(response.target_item),
    offers: (response.offers || []).map((offer) => ({
      requestId: offer.request_id,
      requesterName: offer.requester_name,
      requesterCity: offer.requester_city,
      status: offer.status,
      offeredItems: offer.offered_items.map(mapReviewItem),
    })),
  };
};

export const acceptSwapReviewOffer = async ({
  token,
  phone,
  requestId,
  selectedOfferedItemId,
}: {
  token: string;
  phone: string;
  requestId: string;
  selectedOfferedItemId: string;
}) => {
  await supabaseRpcRequest('owner_accept_swap_offer', {
    p_token: token,
    p_phone: sanitizePhoneNumberInput(phone),
    p_swap_request_id: requestId,
    p_selected_offered_item_id: selectedOfferedItemId,
  });
};

export const rejectSwapReviewOffer = async ({
  token,
  phone,
  requestId,
}: {
  token: string;
  phone: string;
  requestId: string;
}) => {
  await supabaseRpcRequest('owner_reject_swap_offer', {
    p_token: token,
    p_phone: sanitizePhoneNumberInput(phone),
    p_swap_request_id: requestId,
    p_owner_note: null,
  });
};
