export interface IReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  stock: number;
  featured: boolean;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: string;
  quantity: number;
  size: string;
  price: number;
  name: string;
  image?: string;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  items: IOrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "gcash";
  gcashRef?: string;
  gcashProof?: string;
  address: string;
  phone: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
  size: string;
}
