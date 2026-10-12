import { Suspense } from 'react';
import ProductsPage from '../../../views/ProductsPage';
import LogoLoader from '../../../components/LogoLoader';

export const metadata = {
  title: 'Products | Avrora Dazzle Textiles',
  description: 'Browse luxury designer collections, fashion garments, and curated apparel at Avrora Dazzle.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LogoLoader text="Loading Products..." /></div>}>
      <ProductsPage />
    </Suspense>
  );
}
