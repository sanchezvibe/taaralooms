"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function Navbar() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <div className="bg-[#1e1e1e] text-white flex items-center justify-between px-6 py-3 relative z-50">
      <div className="flex items-center gap-2">
        <h1 className="font-bold tracking-widest text-lg">TAARALOOMS</h1>
        <div className="w-px h-5 bg-gray-500 mx-2" />
        <span className="text-gray-300 text-sm hidden sm:inline-block">Admin panel</span>
      </div>

      <div className="flex items-center gap-2 group relative cursor-pointer pt-2 pb-2">
        <span className="text-sm font-medium">Admin</span>
        <div className="bg-white rounded-full p-0.5">
          <div className="bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-white font-bold text-xs">
            <span className="font-serif">h</span>
          </div>
        </div>

        {/* Hover Dropdown */}
        <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 transition-all">
          <button 
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
             <LogOut className="w-4 h-4 text-red-500" />
             <span>{isPending ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


