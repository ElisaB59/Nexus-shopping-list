import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Sélectionner...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const removeItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    toggleOption(item);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selected.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selected.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    onClick={(e) => removeItem(e, item)}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-gray-700 border-gray-600" align="start">
        <div className="max-h-64 overflow-y-auto p-2">
          {selected.length > 0 && (
            <div className="mb-2 pb-2 border-b border-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="w-full justify-start text-gray-300 hover:bg-gray-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}
          <div className="space-y-1">
            {options.length === 0 ? (
              <div className="px-2 py-4 text-center text-gray-400">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <div
                    key={option}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-600 rounded"
                    onClick={() => toggleOption(option)}
                  >
                    <Checkbox checked={isSelected} readOnly />
                    <span className="text-gray-200 flex-1">{option}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}