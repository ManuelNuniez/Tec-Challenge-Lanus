import { BottomNav } from "@/components/bottom-nav";

// Screens of the logged-in user that share the bottom bar.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
