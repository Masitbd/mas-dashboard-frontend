import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user) {
  //   redirect('/signin');
  // }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px,1fr]">
        <DashboardSidebar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
