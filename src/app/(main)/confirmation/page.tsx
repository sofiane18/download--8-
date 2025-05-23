
import ConfirmationClient from '@/components/order/ConfirmationClient';

// This is now the convention for pages that need client-side hooks like useSearchParams
// The actual logic is in ConfirmationClient.tsx
export default function ConfirmationPage() {
  return <ConfirmationClient />;
}
