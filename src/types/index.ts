export interface Product {
  id: string;
  name: string;
  label: string;
  isNonBranded: boolean;
  image: string;
  images?: string[];
  description?: string;
  sizes: string[];
  condition: string;
  owner: {
    name: string;
    avatar?: string;
  };
  location: string;
  category: 'female' | 'male' | 'unisex';
  itemCategory?: string;
  brand?: string;
  canRent?: boolean;
  canBuy?: boolean;
  canSwap?: boolean;
  rentPrice?: string;
  buyPrice?: string;
}

export interface TrendItem {
  id: string;
  title: string;
  image: string;
  comingSoon?: boolean;
}

export interface SwapStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}
