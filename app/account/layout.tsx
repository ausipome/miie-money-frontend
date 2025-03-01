import PrivateRoute from '../../components/user/PrivateRoute';

export default function AccountLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
    <section>
      {children}
    </section>
    </PrivateRoute>
  )
}


