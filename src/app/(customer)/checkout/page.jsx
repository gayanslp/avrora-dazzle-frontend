import ProtectedRoute from '../../../components/ProtectedRoute';
import CheckoutPage from '../../../views/CheckoutPage';

export const metadata = {
  title: 'Secure Checkout | Avrora Dazzle Textiles',
  description: 'Complete your luxury purchase securely with PayHere online payment or Cash on Delivery.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}
