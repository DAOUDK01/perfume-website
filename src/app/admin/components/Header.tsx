"use client";
import { Bell, Search } from "lucide-react";
import Link from "next/link";

export default function Header({
  setSidebarOpen,
  newOrdersCount = 0,
}: {
  setSidebarOpen: (open: boolean) => void;
  newOrdersCount?: number;
}) {
  return (
    <header className="bg-white text-gray-900 shadow-lg border-b border-gray-200 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 max-w-md mx-8 hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input type="text" placeholder="Search products, orders..." className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            aria-label="Orders notifications"
          >
            <Bell className="w-5 h-5" />
            {newOrdersCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-medium">
                {newOrdersCount > 99 ? "99+" : newOrdersCount}
              </span>
            ) : null}
          </Link>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-medium text-sm">AD</span>
            </div>
            <span className="text-gray-700 font-medium text-sm">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
