import { motion } from "motion/react";
import { Product } from "../types";

export interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col gap-4 cursor-pointer"
      onClick={() => onAddToCart(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sakila-sand rounded-sm">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-sakila-charcoal text-sakila-cream px-6 py-3 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:bg-black w-[90%] flex items-center justify-center"
        >
          Add to Cart
        </button>
      </div>
      <div className="flex flex-col gap-1 items-center text-center mt-2">
        <h3 className="font-serif text-lg text-sakila-charcoal">{product.name}</h3>
        <p className="text-sakila-taupe text-sm mb-1">{product.category}</p>
        <p className="font-sans font-medium text-sm tracking-wide text-sakila-charcoal">₹{product.price}</p>
      </div>
    </motion.div>
  );
}
