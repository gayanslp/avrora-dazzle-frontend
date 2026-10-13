import ProtectedRoute from '../../../components/ProtectedRoute';
import MyOrdersPage from '../../../views/MyOrdersPage';

export const metadata = {
  title: 'My Orders | Avrora Dazzle Textiles',
  description: 'Track and review your recent couture orders and shipping updates.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <MyOrdersPage />
    </ProtectedRoute>
  );
}
