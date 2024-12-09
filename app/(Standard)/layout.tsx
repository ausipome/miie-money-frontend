import TopNav from "@/components/navigation/TopNav"

export default function AccountLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <TopNav />
      {children}
    </section>
  )
}


