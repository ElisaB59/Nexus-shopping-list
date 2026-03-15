import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiSelect } from "./MultiSelect";

interface ItemFiltersProps {
  searchName: string;
  setSearchName: (value: string) => void;
  selectedTiers: string[];
  setSelectedTiers: (tiers: string[]) => void;
  attunementFilter: "all" | "Yes" | "No";
  setAttunementFilter: (value: "all" | "Yes" | "No") => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  sessionFilter: "all" | "Yes" | "No";
  setSessionFilter: (value: "all" | "Yes" | "No") => void;
  availableTypes: string[];
}

export function ItemFilters({
  searchName,
  setSearchName,
  selectedTiers,
  setSelectedTiers,
  attunementFilter,
  setAttunementFilter,
  selectedTypes,
  setSelectedTypes,
  sessionFilter,
  setSessionFilter,
  availableTypes,
}: ItemFiltersProps) {
  const tierOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 space-y-6">
      <div>
        <Label htmlFor="search-name">Name</Label>
        <Input
          id="search-name"
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="mt-2 bg-gray-700 border-gray-600"
        />
      </div>

      <div>
        <Label>Tier</Label>
        <div className="mt-2">
          <MultiSelect
            options={tierOptions}
            selected={selectedTiers}
            onChange={setSelectedTiers}
            placeholder="Select tiers..."
          />
        </div>
      </div>

      <div>
        <Label>Attunement</Label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attunement"
              checked={attunementFilter === "all"}
              onChange={() => setAttunementFilter("all")}
              className="cursor-pointer"
            />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attunement"
              checked={attunementFilter === "Yes"}
              onChange={() => setAttunementFilter("Yes")}
              className="cursor-pointer"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attunement"
              checked={attunementFilter === "No"}
              onChange={() => setAttunementFilter("No")}
              className="cursor-pointer"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div>
        <Label>Type</Label>
        <div className="mt-2">
          <MultiSelect
            options={availableTypes}
            selected={selectedTypes}
            onChange={setSelectedTypes}
            placeholder="Select types..."
          />
        </div>
      </div>

      <div>
        <Label>Session</Label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              checked={sessionFilter === "all"}
              onChange={() => setSessionFilter("all")}
              className="cursor-pointer"
            />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              checked={sessionFilter === "Yes"}
              onChange={() => setSessionFilter("Yes")}
              className="cursor-pointer"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              checked={sessionFilter === "No"}
              onChange={() => setSessionFilter("No")}
              className="cursor-pointer"
            />
            <span>No</span>
          </label>
        </div>
      </div>
    </div>
  );
}