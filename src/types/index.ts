export interface Product {
  id: string;
  name: string;
  label: string;
  isNonBranded: boolean;
  image: string;
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  condition: string;
  owner: {
    name: string;
    avatar?: string;
  };
  location: string;
  category: 'women' | 'men';
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
