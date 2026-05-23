import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { load } from "@cashfreepayments/cashfree-js";
import { CartItem } from "../types";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQuantity }: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to initialize payment");
      }
      
      if (data.payment_session_id) {
        const cashfree = await load({
          mode: "sandbox" // Use production for live
        });

        const checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self"
        };
        
        cashfree.checkout(checkoutOptions);
      }
    } catch (err: any) {
      if (err.message.includes("CASHFREE")) {
         setError("Cashless payments are restricted. Please configure the Cashfree credentials in AI Studio settings.");
      } else {
         setError(err.message || "An error occurred during checkout.");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-sakila-charcoal/40 backdrop-blur-sm z-40 transition-opacity"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-sakila-cream shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-sakila-sand">
              <h2 className="font-serif text-2xl text-sakila-charcoal">Your Selection</h2>
              <button onClick={onClose} className="p-2 hover:bg-sakila-sand rounded-full transition-colors">
                <X size={20} className="text-sakila-charcoal" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sakila-taupe gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif text-xl mt-2">Your cart is empty.</p>
                  <button onClick={onClose} className="text-sm uppercase tracking-widest mt-4 border-b border-sakila-taupe pb-1 hover:text-sakila-charcoal hover:border-sakila-charcoal transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-sakila-sand rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-serif text-sakila-charcoal leading-snug">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-sakila-stone hover:text-red-800 transition-colors mt-1">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-sakila-taupe mt-1">₹{item.price}</p>
                      
                      <div className="mt-auto flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white px-2 py-1 border border-sakila-sand rounded-sm">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center text-sakila-taupe hover:text-sakila-charcoal transition-colors"
                          >-</button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-sakila-taupe hover:text-sakila-charcoal transition-colors"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-white border-t border-sakila-sand flex flex-col gap-6">
                <div className="flex flex-col gap-3 text-sm text-sakila-charcoal">
                  <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t border-sakila-sand/50">
                    <span className="font-serif text-xl">Total</span>
                    <span className="font-medium tracking-wide">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-sakila-taupe text-xs tracking-wide">Shipping & taxes calculated at checkout.</p>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-800 text-sm rounded-sm flex flex-col gap-1">
                    <span className="font-semibold">Checkout Unavailable</span>
                    <span>{error}</span>
                  </div>
                )}
                
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-sakila-charcoal text-sakila-cream py-4 uppercase tracking-widest text-sm font-medium hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  {isCheckingOut ? "Connecting..." : "Proceed to Payment"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
