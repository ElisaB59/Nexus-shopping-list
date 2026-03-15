import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export interface Item {
  name: string;
  tier: string;
  attunement: string;
  usage_requirements: string;
  type: string;
  cost: string;
  session_required: string;
  notes: string;
  sourcebook: string;
}

interface ItemRowProps {
  item: Item;
  onAddToCart: (item: Item, quantity: number) => void;
}

export function ItemRow({ item, onAddToCart }: ItemRowProps) {
  const [quantity, setQuantity] = useState(1);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3 font-medium">{item.name}</td>
      <td className="px-4 py-3 text-center">
        <Badge variant="secondary" className="bg-gray-700">
          {item.tier}
        </Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <Badge variant={item.attunement === "Yes" ? "default" : "outline"}>
          {item.attunement}
        </Badge>
      </td>
      <td className="px-4 py-3">{item.type}</td>
      <td className="px-4 py-3 text-center">
        <Badge variant={item.session_required === "Yes" ? "default" : "outline"}>
          {item.session_required}
        </Badge>
      </td>
      <td className="px-4 py-3">{item.cost}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center border border-gray-600 rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-8 w-8 p-0 hover:bg-gray-600"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-3 min-w-[2rem] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-8 w-8 p-0 hover:bg-gray-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCart} size="sm">
            Add
          </Button>
        </div>
      </td>
    </tr>
  );
}