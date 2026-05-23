export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Dresses" | "Accessories" | "Outerwear";
}

export interface CartItem extends Product {
  quantity: number;
}
