import ConsoleNavbar from "@/components/ConsoleNavbar";
import PrivateRoute from '../../components/PrivateRoute';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
    <section>
      <ConsoleNavbar />
      {children}
    </section>
    </PrivateRoute>
  )
}


