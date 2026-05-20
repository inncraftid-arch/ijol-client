import { clientEnv } from '../config/env';
import { supabaseRestRequest } from './clientSupabase';
import type { Product } from '../types';

export type CollectionCategory = 'all' | Product['category'];

export interface FetchCollectionsParams {
  page: number;
  pageSize: number;
  category: CollectionCategory;
  search?: string;
}

export interface FetchCollectionsResult {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type ProductUserRecord = {
  full_name: string | null;
  city: string | null;
};

type ProductPhotoRecord = {
  public_url: string | null;
  sort_order: number | null;
};

type ProductRecord = {
  id: string;
  name: string | null;
  category_gender: Product['category'] | null;
  category: string | null;
  is_branded: boolean | null;
  brand: string | null;
  size: string | null;
  condition: string | null;
  description: string | null;
  can_buy: boolean | null;
  buy_price: number | null;
  can_rent: boolean | null;
  rent_price: number | null;
  users?: ProductUserRecord | ProductUserRecord[] | null;
  item_photos?: ProductPhotoRecord[] | null;
};

const fallbackImage = '/assets/images/clothes.2.png';

const formatRupiah = (value: number | null | undefined, suffix = '') => {
  if (value === null || value === undefined) {
    return undefined;
  }

  return `Rp${new Intl.NumberFormat('id-ID').format(value)}${suffix}`;
};

const getEmbeddedUser = (record: ProductRecord) => {
  if (Array.isArray(record.users)) {
    return record.users[0] || null;
  }

  return record.users || null;
};

const mapProductRecord = (record: ProductRecord): Product => {
  const sortedPhotos = [...(record.item_photos || [])]
    .filter((photo) => Boolean(photo.public_url))
    .sort((firstPhoto, secondPhoto) => (firstPhoto.sort_order || 0) - (secondPhoto.sort_order || 0));
  const images = sortedPhotos.map((photo) => photo.public_url as string);
  const owner = getEmbeddedUser(record);

  return {
    id: record.id,
    name: record.name || 'Item IJOL',
    label: record.id.slice(0, 6).toUpperCase(),
    isNonBranded: !record.is_branded,
    image: images[0] || fallbackImage,
    images: images.length ? images : [fallbackImage],
    description: record.description || undefined,
    sizes: record.size ? [record.size] : ['-'],
    condition: record.condition || '-',
    owner: {
      name: owner?.full_name || 'IJOL User',
    },
    location: owner?.city || 'Indonesia',
    category: record.category_gender || 'unisex',
    itemCategory: record.category || undefined,
    brand: record.brand || undefined,
    canRent: Boolean(record.can_rent),
    canBuy: Boolean(record.can_buy),
    canSwap: true,
    rentPrice: formatRupiah(record.rent_price, '/hari'),
    buyPrice: formatRupiah(record.buy_price),
  };
};

export async function fetchCollections({
  page,
  pageSize,
  category,
  search = '',
}: FetchCollectionsParams): Promise<FetchCollectionsResult> {
  const records = await supabaseRestRequest<ProductRecord[]>(
    `${clientEnv.itemsTable}?select=id,name,category_gender,category,is_branded,brand,size,condition,description,can_buy,buy_price,can_rent,rent_price,users!items_user_id_fkey(full_name,city),item_photos!item_photos_item_id_fkey(public_url,sort_order)&status=in.(pending_qc,approved)&order=created_at.desc&limit=300`
  );
  const normalizedSearch = search.trim().toLowerCase();
  const products = records.map(mapProductRecord);
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.label.toLowerCase().includes(normalizedSearch) ||
      product.owner.name.toLowerCase().includes(normalizedSearch) ||
      product.location.toLowerCase().includes(normalizedSearch) ||
      product.itemCategory?.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    data: filteredProducts.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
