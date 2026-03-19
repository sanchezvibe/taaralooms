"use client";

import { Search } from "lucide-react";

interface ActionProps {
  onAddProduct: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ActionBar({ onAddProduct, searchTerm, onSearchChange }: ActionProps) {
  return (
    <div data-testid="action-bar" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4 w-full">
      <div data-testid="action-filters" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        {/* Search */}
        <div data-testid="search-input-container" className="relative w-full sm:w-auto">
          <Search data-testid="search-icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            data-testid="search-input"
            type="text"
            placeholder="Search by name, price"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white rounded-md w-full sm:w-[300px] text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        {/* Date Filter */}
        <div data-testid="date-filter-container" className="relative w-full sm:w-auto">
          <select data-testid="date-filter-select" className="appearance-none bg-white py-2 pl-4 pr-10 rounded-md text-sm text-gray-500 w-full focus:outline-none focus:ring-1 focus:ring-gray-300">
            <option value="">Date</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <div data-testid="date-filter-icon" className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div data-testid="action-buttons-container" className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
        <button 
          data-testid="add-product-button"
          onClick={onAddProduct}
          className="bg-[#624a46] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#503b38] transition-colors w-full md:w-auto"
        >
          Add product +
        </button>
      </div>
    </div>
  );
}


