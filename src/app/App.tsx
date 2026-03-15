import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./components/ui/button";
import { ItemFilters } from "./components/ItemFilters";
import { ItemRow, Item } from "./components/ItemCard";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import itemsData from "../imports/table.json";

type SortConfig = { key: keyof Item; direction: 'asc' | 'desc' };

export default function App() {
  const [searchName, setSearchName] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [attunementFilter, setAttunementFilter] = useState<"all" | "Yes" | "No">("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sessionFilter, setSessionFilter] = useState<"all" | "Yes" | "No">("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Multi-column sort: array of SortConfig, first element has highest priority
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  const items = itemsData as Item[];

  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    items.forEach((item) => {
      item.type.split(',').map(t => t.trim()).forEach(type => typesSet.add(type));
    });
    return Array.from(typesSet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchName && !item.name.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (selectedTiers.length > 0 && !selectedTiers.includes(item.tier)) return false;
      if (attunementFilter === "Yes" && item.attunement !== "Yes") return false;
      if (attunementFilter === "No" && item.attunement !== "No") return false;
      if (selectedTypes.length > 0) {
        const itemTypes = item.type.split(',').map(t => t.trim());
        if (!selectedTypes.some(t => itemTypes.includes(t))) return false;
      }
      if (sessionFilter === "Yes" && item.session_required !== "Yes") return false;
      if (sessionFilter === "No" && item.session_required !== "No") return false;
      return true;
    });
  }, [items, searchName, selectedTiers, attunementFilter, selectedTypes, sessionFilter]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfigs.length > 0) {
      sortableItems.sort((a, b) => {
        for (const { key, direction } of sortConfigs) {
          let aValue = a[key];
          let bValue = b[key];

          // Numeric sort for Cost
          if (key === 'cost') {
            const aNum = parseFloat(aValue.toString().replace(/[^0-9.-]+/g, "")) || 0;
            const bNum = parseFloat(bValue.toString().replace(/[^0-9.-]+/g, "")) || 0;
            if (aNum !== bNum) return direction === 'asc' ? aNum - bNum : bNum - aNum;
          } else {
            if (aValue !== bValue) {
              return direction === 'asc'
                ? aValue.toString().localeCompare(bValue.toString())
                : bValue.toString().localeCompare(aValue.toString());
            }
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfigs]);

  const handleSort = (key: keyof Item, shiftKey: boolean = false) => {
    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex(cfg => cfg.key === key);

      if (!shiftKey) {
        // Replace sort if shift is not held
        if (existingIndex !== -1) {
          // Toggle direction
          const newDir = prev[existingIndex].direction === 'asc' ? 'desc' : 'asc';
          return [{ key, direction: newDir }];
        }
        return [{ key, direction: 'asc' }];
      } else {
        // Shift held: multi-column
        const newConfigs = [...prev];
        if (existingIndex !== -1) {
          // Toggle direction for existing
          newConfigs[existingIndex].direction = newConfigs[existingIndex].direction === 'asc' ? 'desc' : 'asc';
        } else {
          newConfigs.push({ key, direction: 'asc' });
        }
        return newConfigs;
      }
    });
  };

  const handleAddToCart = (item: Item, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.name === item.name);
      if (existing) return prev.map(ci => ci.item.name === item.name ? { ...ci, quantity: ci.quantity + quantity } : ci);
      return [...prev, { item, quantity }];
    });
  };

  const handleUpdateQuantity = (itemName: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(ci => ci.item.name === itemName ? { ...ci, quantity: newQuantity } : ci));
  };

  const handleRemoveItem = (itemName: string) => {
    setCartItems(prev => prev.filter(ci => ci.item.name !== itemName));
  };

  const totalCartItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  const getSortIndicator = (key: keyof Item) => {
    const index = sortConfigs.findIndex(cfg => cfg.key === key);
    if (index === -1) return '';
    return sortConfigs[index].direction === 'asc' ? `↑${sortConfigs.length > 1 ? index + 1 : ''}` : `↓${sortConfigs.length > 1 ? index + 1 : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Magic Items Shop</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
                      {(['name','tier','attunement','type','session_required','cost'] as (keyof Item)[]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 font-semibold cursor-pointer text-left"
                          onClick={(e) => handleSort(key, e.shiftKey)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1).replace('_',' ')} {getSortIndicator(key)}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          No items match your criteria
                        </td>
                      </tr>
                    ) : (
                      sortedItems.map((item, idx) => (
                        <ItemRow key={`${item.name}-${idx}`} item={item} onAddToCart={handleAddToCart} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

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
