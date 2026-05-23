import { useState, useEffect } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { products } from "./data";
import { Product, CartItem } from "./types";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-sakila-cream font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-sakila-cream/95 backdrop-blur-md border-b border-sakila-sand py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button className={`lg:hidden p-2 -ml-2 rounded-full transition-colors ${scrolled ? 'text-sakila-charcoal' : 'text-sakila-cream'}`}>
            <Menu size={20} />
          </button>
          
          <div className={`hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${scrolled ? 'text-sakila-taupe' : 'text-sakila-cream/80'}`}>
            <a href="#" className={`transition-colors ${scrolled ? 'hover:text-sakila-charcoal' : 'hover:text-white'}`}>Collections</a>
            <a href="#" className={`transition-colors ${scrolled ? 'hover:text-sakila-charcoal' : 'hover:text-white'}`}>Atelier</a>
            <a href="#" className={`transition-colors ${scrolled ? 'hover:text-sakila-charcoal' : 'hover:text-white'}`}>Journal</a>
          </div>

          <h1 className={`font-serif tracking-tight absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${scrolled ? 'text-2xl text-sakila-charcoal' : 'text-3xl text-sakila-cream'}`}>
            Sakila
          </h1>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors flex items-center justify-center gap-2 ${scrolled ? 'text-sakila-charcoal hover:bg-sakila-sand' : 'text-sakila-cream hover:bg-white/10'}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-widest font-medium hidden md:block">Cart</span>
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 md:right-auto md:left-6 w-4 h-4 text-[10px] flex items-center justify-center rounded-full ${scrolled ? 'bg-sakila-charcoal text-sakila-cream' : 'bg-white text-sakila-charcoal'}`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[85vh] bg-sakila-charcoal overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Sakila Boutique Collection" 
            className="w-full h-full object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40" />
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-sakila-cream z-10 pt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="uppercase tracking-[0.25em] text-xs md:text-sm mb-6 max-w-md mx-auto leading-relaxed"
          >
            Introducing the Spring / Summer '26 Collection
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl max-w-5xl leading-[1.1] mb-10"
          >
            Elegance in the Everyday
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <a href="#collection" className="inline-block bg-sakila-cream border border-sakila-cream text-sakila-charcoal px-10 py-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-transparent hover:text-sakila-cream transition-all duration-300">
              Discover Repertoire
            </a>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main id="collection" className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-32">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="font-serif text-4xl text-sakila-charcoal mb-6">Curated Essentials</h2>
          <p className="text-sakila-taupe max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Discover our latest arrivals designed with intention, crafted from the finest ethically sourced materials meant to last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <button className="border-b border-sakila-charcoal text-sakila-charcoal pb-1 uppercase tracking-widest text-xs font-medium hover:text-black hover:border-black transition-all">
            View All Collections
          </button>
        </div>
      </main>
      
      {/* About Banner */}
      <section className="bg-sakila-sand py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-sakila-charcoal mb-8 leading-tight">
            "True luxury is found in the whisper of fine fabrics and the precision of a perfect cut."
          </h2>
          <p className="uppercase tracking-[0.2em] text-xs text-sakila-taupe font-medium">— The Sakila Atelier</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sakila-charcoal text-sakila-cream py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-6 md:col-span-2 pr-0 md:pr-12">
            <h3 className="font-serif text-4xl">Sakila</h3>
            <p className="text-sakila-stone text-sm max-w-sm leading-relaxed">
              Elevating the everyday wardrobe with timeless silhouettes and uncompromising quality. Designed in Paris, crafted globally.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-5 text-xs tracking-[0.15em] uppercase">
            <h4 className="font-medium text-white mb-2">Client Care</h4>
            <a href="#" className="text-sakila-stone hover:text-sakila-cream transition-colors">Bespoke Services</a>
            <a href="#" className="text-sakila-stone hover:text-sakila-cream transition-colors">Shipping & Returns</a>
            <a href="#" className="text-sakila-stone hover:text-sakila-cream transition-colors">Fit Guide</a>
            <a href="#" className="text-sakila-stone hover:text-sakila-cream transition-colors">Contact</a>
          </div>
          <div className="flex flex-col items-center md:items-start gap-5 text-xs tracking-[0.15em] uppercase text-sakila-stone">
            <h4 className="font-medium text-white mb-2">Atelier</h4>
            <p>124 Rue de l'Élégance</p>
            <p>75003 Paris, France</p>
            <a href="mailto:atelier@sakilaboutique.com" className="hover:text-sakila-cream transition-colors mt-2">atelier@sakilaboutique.com</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-sakila-stone uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Sakila Boutique. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Sidebar */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
