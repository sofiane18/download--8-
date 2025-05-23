
import { mockStores, mockProducts, mockServices } from '@/lib/mockData';
import type { Store as StoreType } from '@/lib/types';
import StoreDetailClient from '@/components/store/StoreDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return mockStores.map((store) => ({
    id: store.id,
  }));
}

interface StorePageProps {
  params: { id: string };
}

export default async function StorePage({ params }: StorePageProps) {
  const storeId = params.id;
  const store = mockStores.find(s => s.id === storeId);

  if (!store) {
    notFound();
  }

  // Filter products and services for the specific store
  // Ensure product.store and service.store exactly match store.name for consistency
  const storeProducts = mockProducts.filter(p => p.store === store.name);
  const storeServices = mockServices.filter(s => s.store === store.name);

  return (
    <StoreDetailClient
      store={store}
      initialProducts={storeProducts}
      initialServices={storeServices}
    />
  );
}
