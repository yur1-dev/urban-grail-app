"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "all",
  "tees",
  "hoodies",
  "shoes",
  "bags",
  "slippers",
  "caps",
  "accessories",
];

interface Props {
  activeCategory: string;
  activeSearch: string;
}

export function ShopFilters({ activeCategory, activeSearch }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(activeSearch);

  function handleCategory(cat: string) {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (search) params.set("search", search);
    router.push(`/shop${params.toString() ? "?" + params.toString() : ""}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (search.trim()) params.set("search", search.trim());
    router.push(`/shop${params.toString() ? "?" + params.toString() : ""}`);
  }

  function handleClear() {
    setSearch("");
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    router.push(`/shop${params.toString() ? "?" + params.toString() : ""}`);
  }

  return (
    <div className="mb-10 space-y-6">
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-5 py-2 text-xs tracking-[3px] uppercase border transition-colors ${
              activeCategory === cat
                ? "border-[#c9a84c] text-[#c9a84c]"
                : "border-[#1e1e1e] text-[#5a5a5a] hover:border-white hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full md:w-80 bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-white text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}
