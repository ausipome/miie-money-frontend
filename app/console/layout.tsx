import ConsoleNavbar from "@/components/ConsoleNavbar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <ConsoleNavbar />
      {children}
    </section>
  )
}


