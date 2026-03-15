import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./components/ui/button";
import { ItemFilters } from "./components/ItemFilters";
import { ItemRow, Item } from "./components/ItemCard";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import itemsData from "../imports/table.json";

export default function App() {
  const [searchName, setSearchName] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [attunementFilter, setAttunementFilter] = useState<"all" | "Yes" | "No">("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sessionFilter, setSessionFilter] = useState<"all" | "Yes" | "No">("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const items = itemsData as Item[];

  // Extract unique types from items
  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    items.forEach((item) => {
      // Split types by comma and add each to the set
      const types = item.type.split(',').map(t => t.trim());
      types.forEach(type => typesSet.add(type));
    });
    return Array.from(typesSet).sort();
  }, [items]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Name filter
      if (searchName && !item.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      // Tier filter
      if (selectedTiers.length > 0 && !selectedTiers.includes(item.tier)) {
        return false;
      }

      // Attunement filter
      if (attunementFilter === "Yes" && item.attunement !== "Yes") return false;
      if (attunementFilter === "No" && item.attunement !== "No") return false;

      // Type filter
      if (selectedTypes.length > 0) {
        const itemTypes = item.type.split(',').map(t => t.trim());
        const hasMatchingType = selectedTypes.some(selectedType => 
          itemTypes.includes(selectedType)
        );
        if (!hasMatchingType) return false;
      }

      // Session filter
      if (sessionFilter === "Yes" && item.session_required !== "Yes") return false;
      if (sessionFilter === "No" && item.session_required !== "No") return false;

      return true;
    });
  }, [items, searchName, selectedTiers, attunementFilter, selectedTypes, sessionFilter]);

  const handleAddToCart = (item: Item, quantity: number) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item.name === item.name);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prevCart, { item, quantity }];
    });
  };

  const handleUpdateQuantity = (itemName: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.item.name === itemName ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );
  };

  const handleRemoveItem = (itemName: string) => {
    setCartItems((prevCart) => prevCart.filter((cartItem) => cartItem.item.name !== itemName));
  };

  const totalCartItems = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Magic Items Shop</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1">
            <ItemFilters
              searchName={searchName}
              setSearchName={setSearchName}
              selectedTiers={selectedTiers}
              setSelectedTiers={setSelectedTiers}
              attunementFilter={attunementFilter}
              setAttunementFilter={setAttunementFilter}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              sessionFilter={sessionFilter}
              setSessionFilter={setSessionFilter}
              availableTypes={availableTypes}
            />
          </aside>

          {/* Items table */}
          <main className="lg:col-span-4">
            <div className="mb-4">
              <p className="text-gray-400">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700 border-b border-gray-600">
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-center font-semibold">Tier</th>
                      <th className="px-4 py-3 text-center font-semibold">Attunement</th>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-center font-semibold">Session</th>
                      <th className="px-4 py-3 text-left font-semibold">Cost</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          No items match your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, index) => (
                        <ItemRow key={`${item.name}-${index}`} item={item} onAddToCart={handleAddToCart} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating cart button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-6 w-6" />
        {totalCartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
            {totalCartItems}
          </span>
        )}
      </Button>

      {/* Cart drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}