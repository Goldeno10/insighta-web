"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button type="submit" className={className}>
        <LogOut size={16} aria-hidden />
        Sign out
      </button>
    </form>
  );
}
