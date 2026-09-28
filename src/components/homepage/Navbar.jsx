import { Search } from "lucide-react";
import { CategoryChips } from "./CategoryChips";
import { Logo } from "../Logo.jsx";
const Navbar = ({
  onOpenAuth,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 select-none shadow-theme-card">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <a href="/" className="flex items-center hover:scale-105 transition-transform">
            <Logo size="navbar" />
          </a>
        </div>

        {/* Search Bar - fully rounded */}
        <div className="flex-1 max-w-lg mx-auto hidden sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="text"
              readOnly
              placeholder="Search anime, games, movies, characters..."
              onClick={() => onOpenAuth("login")}
              className="w-full h-10 pl-11 pr-4 bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-900 placeholder-gray-400 rounded-full focus:outline-none focus:border-[#F59E0B] cursor-pointer hover:border-[#F59E0B]/50 transition-colors"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenAuth("login")}
            className="h-10 px-4 text-xs font-bold text-gray-900 hover:text-[#F59E0B] bg-transparent border border-gray-200 hover:border-[#F59E0B] rounded-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth("signup")}
            className="h-10 px-5 text-xs font-bold text-black bg-[#F59E0B] hover:bg-[#D97706] rounded-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Category Pill Strip Below Nav */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </header>
  );
};
export {
  Navbar
};
