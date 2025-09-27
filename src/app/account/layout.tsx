import { ReactNode } from "react";
import AccountTabs from "@/components/AccountTabs";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <AccountTabs />
      {children}
    </div>
  );
}
