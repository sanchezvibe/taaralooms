"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";

import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        toast("Successfully logged in!");
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Authentication failed");
        toast("Incorrect username or password", true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4] px-4">
      <div className="w-full max-w-[400px] bg-white rounded-[2rem] shadow-sm text-center overflow-hidden flex flex-col">
        <div className="bg-[#1e1e1e] py-10 px-8 flex justify-center items-center">
           <img src="/images/logo.png" alt="Taaralooms" className="h-14 w-auto object-contain" />
        </div>
        <div className="p-10 md:p-12 pt-8">
          <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-[0.2em] opacity-80">Admin Panel</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
            required
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full md:w-[200px] mx-auto bg-[#624a46] text-white py-2.5 rounded text-sm font-medium hover:bg-[#503b38] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}

