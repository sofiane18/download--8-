
import OrderHistoryClient from '@/components/order/OrderHistoryClient';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">Your Orders</h1>
      <OrderHistoryClient />
    </div>
  );
}
