import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';

export const metadata = {
  title: 'Admin Control Center | Avrora Dazzle Textiles',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
