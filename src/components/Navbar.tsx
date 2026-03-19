"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function Navbar() {
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-[#1e1e1e] text-white flex items-center justify-between px-6 py-3 relative z-50">
      <div className="flex items-center gap-2">
        <h1 className="font-bold tracking-widest text-lg">TAARALOOMS</h1>
        <div className="w-px h-5 bg-gray-500 mx-2" />
        <span className="text-gray-300 text-sm hidden sm:inline-block">Admin panel</span>
      </div>

      <div
        ref={dropdownRef}
        className="flex items-center gap-2 relative cursor-pointer pt-2 pb-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Admin</span>
          <div className="bg-white rounded-full p-0.5 w-8 h-8 flex items-center justify-center overflow-hidden">
            {/* Admin Profile Image */}
            <img 
              src="/images/admin-profile.jpg" 
              alt="Admin" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback if image is missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-red-600');
                if (e.currentTarget.parentElement) {
                  const fallbackSpan = document.createElement('span');
                  fallbackSpan.className = "text-white font-bold text-xs";
                  fallbackSpan.innerText = "h";
                  e.currentTarget.parentElement.appendChild(fallbackSpan);
                }
              }}
            />
          </div>
        </div>

        {/* Click Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>{isPending ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


