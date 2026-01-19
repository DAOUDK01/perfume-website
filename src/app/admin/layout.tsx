"use client";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/metrics", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        if (!cancelled) setNewOrdersCount(Number(data?.metrics?.newOrdersCount || 0));
      } catch {
        // ignore transient errors
      }
    }

    poll();
    const t = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        newOrdersCount={newOrdersCount}
      />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
