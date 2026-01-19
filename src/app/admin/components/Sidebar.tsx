"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BarChart3, Package, Users, ShoppingCart, LogOut, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-serif font-light text-gray-900">e&apos;eora Admin</h1>
          </div>
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-black text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}>
                  <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-6 border-t border-gray-200">
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group">
              <LogOut className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
