export type CategoryId = 'bridal' | 'groom' | 'asoebi' | 'ankara-craft' | 'training' | 'events' | 'hats';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  bgImage?: string;
  subcategories?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  videoUrl?: string;
  description: string;
  variants?: {
    type: string;
    options: string[];
  }[];
  stockStatus: 'in_stock' | 'limited' | 'out_of_stock';
  stockCount?: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants: Record<string, string>;
  customNote?: string;
}

export type OrderStatus = 'order_placed' | 'payment_confirmed' | 'processing' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDetails: DeliveryDetails;
  paymentMethod: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}
