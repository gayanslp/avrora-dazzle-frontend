import { Suspense } from 'react';
import ProductsPage from '../../../../views/ProductsPage';
import LogoLoader from '../../../../components/LogoLoader';

export const metadata = {
  title: 'Collection | Avrora Dazzle Textiles',
  description: 'Explore the curated category collection at Avrora Dazzle Textiles.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LogoLoader text="Loading Products..." /></div>}>
      <ProductsPage />
    </Suspense>
  );
}
