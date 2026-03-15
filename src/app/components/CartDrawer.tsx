import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Item } from "./ItemCard";

export interface CartItem {
  item: Item;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemName: string, newQuantity: number) => void;
  onRemoveItem: (itemName: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const calculateTotal = () => {
    return cartItems.reduce((sum, cartItem) => {
      const cost = parseFloat(cartItem.item.cost.replace(/[^0-9.]/g, '')) || 0;
      return sum + cost * cartItem.quantity;
    }, 0);
  };

  const totalPrice = calculateTotal();

  const getCartText = () => {
    let text = "";
    
    cartItems.forEach((cartItem) => {
      const cost = parseFloat(cartItem.item.cost.replace(/[^0-9.]/g, '')) || 0;
      const totalItemCost = (cost * cartItem.quantity).toFixed(0);
      text += `${cartItem.quantity} ${cartItem.item.name} - ${totalItemCost} GP\n`;
    });
    
    text += `\ntotal: ${totalPrice.toFixed(0)} GP`;
    return text;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-gray-800 border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-white">Cart ({cartItems.length} items)</SheetTitle>
          <SheetDescription className="text-gray-400">
            Manage your cart items
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Your cart is empty</p>
          ) : (
            cartItems.map((cartItem) => {
              const cost = parseFloat(cartItem.item.cost.replace(/[^0-9.]/g, '')) || 0;
              return (
                <div
                  key={cartItem.item.name}
                  className="border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-750"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{cartItem.item.name}</h4>
                      <p className="text-sm text-gray-400">
                        {cartItem.item.cost} × {cartItem.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(cartItem.item.name)}
                      className="hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-600 rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(cartItem.item.name, cartItem.quantity - 1)
                        }
                        disabled={cartItem.quantity <= 1}
                        className="h-8 w-8 p-0 hover:bg-gray-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 min-w-[2rem] text-center">
                        {cartItem.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(cartItem.item.name, cartItem.quantity + 1)
                        }
                        className="h-8 w-8 p-0 hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <span className="font-semibold text-white">
                      {(cost * cartItem.quantity).toFixed(0)} GP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-800 border-t border-gray-700">
            <textarea
              readOnly
              value={getCartText()}
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}