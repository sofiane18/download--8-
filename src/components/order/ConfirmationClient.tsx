
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import type { Order, PaymentDetails, PaymentInstallment, PaymentInstallmentStatus, FulfillmentStatus } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QrCodeIcon, AlertTriangle, Info, CheckCircle, ShoppingCart, Loader2, CalendarClock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, addMonths } from 'date-fns';

function generateAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Simple SVG QR Code placeholder
function MockQrCode({ value }: { value: string }) {
  return (
    <div className="p-2 bg-white border rounded-lg shadow-md inline-block" aria-label={`QR Code for ${value}`}>
      <svg width="160" height="160" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" fill="white"/>
        {[...Array(10)].map((_, r) =>
          [...Array(10)].map((_, c) =>
            (Math.random() > 0.4) && !( (r<3 && c<3) || (r<3 && c>6) || (r>6 && c<3) ) ? (
              <rect key={`${r}-${c}`} x={c*5} y={r*5} width="5" height="5" fill="black"/>
            ) : null
          )
        )}
        <rect x="0" y="0" width="15" height="15" fill="black"/>
        <rect x="5" y="5" width="5" height="5" fill="white"/>
        <rect x="35" y="0" width="15" height="15" fill="black"/>
        <rect x="40" y="5" width="5" height="5" fill="white"/>
        <rect x="0" y="35" width="15" height="15" fill="black"/>
        <rect x="5" y="40" width="5" height="5" fill="white"/>
      </svg>
    </div>
  );
}

const PREFERRED_INSTALLMENT_MONTHS = [3, 6, 9, 12, 18, 24];
const MIN_MONTHLY_PAYMENT = 1000; // DZD

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewPurchaseFlow, setIsNewPurchaseFlow] = useState(false);
  const [availableInstallmentOptions, setAvailableInstallmentOptions] = useState<number[]>([]);

  // Item details from URL (only relevant for new purchases)
  const itemId = searchParams.get('itemId');
  const itemType = searchParams.get('itemType') as 'product' | 'service' | null;
  const itemName = searchParams.get('itemName');
  const priceStr = searchParams.get('price');
  const orderIdFromParams = searchParams.get('orderId');

  useEffect(() => {
    setIsLoading(true);
    if (orderIdFromParams) {
      // Viewing an existing order
      setIsNewPurchaseFlow(false);
      const foundOrderInStorage = orders.find(o => o.orderId === orderIdFromParams);

      if (foundOrderInStorage) {
        let orderToSet: Order = { ...foundOrderInStorage };
        // Ensure paymentDetails exists, default if not (for backward compatibility)
        if (!orderToSet.paymentDetails) {
          orderToSet.paymentDetails = {
            totalAmount: orderToSet.itemPrice,
            amountPaid: orderToSet.itemPrice,
            remainingAmount: 0,
            installmentsTotal: 1,
            installmentsPaid: 1,
            installmentAmount: orderToSet.itemPrice,
            paymentFrequency: 'Single',
            isInstallment: false,
            paymentHistory: [{ date: new Date(orderToSet.timestamp).toISOString(), amount: orderToSet.itemPrice, status: 'Paid' }],
          };
        }
         if (!orderToSet.fulfillmentStatus) { // Default fulfillment for older orders
            orderToSet.fulfillmentStatus = orderToSet.itemType === 'product' ? 'Pending Pickup' : 'Service Scheduled';
        }
        setCurrentOrder(orderToSet);
      } else {
        setError('Order not found. It might have been removed or the ID is incorrect.');
      }
      setIsLoading(false);
    } else if (itemId && itemType && itemName && priceStr) {
      // New purchase flow
      setIsNewPurchaseFlow(true);
      const price = parseFloat(priceStr);
      if (!isNaN(price) && price > 0) {
        const options: number[] = [];
        PREFERRED_INSTALLMENT_MONTHS.forEach(months => {
          if ((price / months) >= MIN_MONTHLY_PAYMENT) {
            options.push(months);
          }
        });
        setAvailableInstallmentOptions(options);
      } else {
        setError('Invalid item price.');
      }
      setIsLoading(false);
    } else {
      setError('Missing order details in URL. Please try again or go back to browsing.');
      setIsLoading(false);
    }
  }, [orderIdFromParams, itemId, itemType, itemName, priceStr, orders]);

  const handleCreateOrder = (numberOfInstallments: number = 1) => {
    if (!itemId || !itemType || !itemName || !priceStr) {
      setError('Cannot create order, essential details are missing.');
      return;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      setError('Invalid price format.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const orderId = `ORD-${Date.now()}-${generateAlphanumericCode(4)}`;
      const timestamp = Date.now();
      const buyerId = 'AutoDinarUser001';
      const confirmationCode = generateAlphanumericCode(6);
      const qrCodeValue = `AUTODINAR_ORDER:${orderId}|ITEM:${itemId}|BUYER:${buyerId}`;

      let paymentDetails: PaymentDetails;
      let fulfillmentStatus: FulfillmentStatus = itemType === 'product' ? 'Pending Pickup' : 'Service Scheduled';

      if (numberOfInstallments <= 1) { // Full payment
        paymentDetails = {
          totalAmount: price, amountPaid: price, remainingAmount: 0,
          installmentsTotal: 1, installmentsPaid: 1, installmentAmount: price,
          paymentFrequency: 'Single', isInstallment: false,
          paymentHistory: [{ date: new Date().toISOString(), amount: price, status: 'Paid' }],
        };
      } else { // Installments
        const installmentsTotal = numberOfInstallments;
        const installmentAmount = parseFloat((price / installmentsTotal).toFixed(2)); 
        const paymentHistory: PaymentInstallment[] = [];
        
        const firstPaymentDate = addMonths(new Date(),1);

        for (let i = 0; i < installmentsTotal; i++) {
          paymentHistory.push({
            date: addMonths(firstPaymentDate, i).toISOString(),
            amount: installmentAmount,
            status: i === 0 ? 'Due' : 'Upcoming',
          });
        }

        paymentDetails = {
          totalAmount: price,
          amountPaid: 0, 
          remainingAmount: price,
          installmentsTotal,
          installmentsPaid: 0,
          installmentAmount,
          paymentFrequency: 'Monthly',
          isInstallment: true,
          paymentHistory,
          nextPaymentDate: paymentHistory.find(p => p.status === 'Due' || p.status === 'Upcoming')?.date,
        };
      }

      const newOrder: Order = {
        orderId, itemId, itemType, itemName, itemPrice: price, timestamp, buyerId,
        qrCodeValue, confirmationCode, fulfillmentStatus, paymentDetails
      };

      setOrders(prevOrders => [...prevOrders, newOrder]);
      setCurrentOrder(newOrder);
      setIsNewPurchaseFlow(false);
      setIsLoading(false);
      router.replace(`/confirmation?orderId=${newOrder.orderId}`, undefined);
    }, 500);
  };


  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto text-center shadow-xl">
        <CardHeader><Skeleton className="h-7 w-3/4 mx-auto mb-2 sm:h-8" /></CardHeader>
        <CardContent className="space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-destructive flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 mr-2" /> Order Error
          </CardTitle>
        </CardHeader>
        <CardContent><p>{error}</p></CardContent>
         <CardFooter><Button onClick={() => router.push('/')} variant="outline">Go to Homepage</Button></CardFooter>
      </Card>
    );
  }

  if (isNewPurchaseFlow && !currentOrder) {
    const price = parseFloat(priceStr || '0');
    const fullPaymentButton = (
      <Button onClick={() => handleCreateOrder(1)} className="w-full bg-primary hover:bg-primary/90 mb-3">
        <CheckCircle className="mr-2"/> Pay {price.toLocaleString()} DZD in Full
      </Button>
    );

    const installmentButtons = availableInstallmentOptions.map(months => {
      const monthlyAmount = price / months;
      return (
        <Button
          key={months}
          onClick={() => handleCreateOrder(months)}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-3"
          variant="outline" // Changed to outline to differentiate from full payment
        >
          <CalendarClock className="mr-2"/> Pay in {months} Installments
          <span className="ml-1 text-xs opacity-80">
            (approx. {monthlyAmount.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})} DZD/month)
          </span>
        </Button>
      );
    });

    return (
      <Card className="w-full max-w-md mx-auto text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Complete Your Purchase</CardTitle>
          <CardDescription className="text-md sm:text-lg">
            You are ordering: <span className="font-semibold">{itemName}</span> for {price.toLocaleString()} DZD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold text-lg mb-3">Choose your payment option:</p>
          {fullPaymentButton}
          {installmentButtons.length > 0 ? installmentButtons :
            <p className="text-sm text-muted-foreground">Installment options require a minimum monthly payment of {MIN_MONTHLY_PAYMENT} DZD. This item is not eligible for installments, or eligible options do not meet the minimum monthly payment. Please proceed with full payment.</p>
          }
        </CardContent>
         <CardFooter className="flex justify-center">
          <Button onClick={() => router.back()} variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentOrder || !currentOrder.paymentDetails) {
     return (
      <Card className="w-full max-w-md mx-auto text-center shadow-xl">
        <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
        <CardContent>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Preparing your confirmation...</p>
        </CardContent>
      </Card>
     );
  }

  const getTitleBasedOnStatus = () => {
    if (currentOrder.paymentDetails.isInstallment && currentOrder.paymentDetails.amountPaid < currentOrder.paymentDetails.totalAmount) {
      return 'Order Placed - Payment Plan Active';
    }
    return 'Purchase Confirmed!';
  };


  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
          {getTitleBasedOnStatus()}
        </CardTitle>
        <CardDescription className="text-md sm:text-lg">
          Thank you for your order of <span className="font-semibold">{currentOrder.itemName}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Scan this QR code at the store:</p>
          <MockQrCode value={currentOrder.qrCodeValue} />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Or provide this confirmation code:</p>
          <p className="text-4xl font-mono font-bold tracking-wider p-3 bg-primary text-primary-foreground rounded-lg inline-block shadow-sm">
            {currentOrder.confirmationCode}
          </p>
        </div>
         <div className="text-sm font-semibold">
          Fulfillment Status: <span className={`font-medium ml-1 ${
                currentOrder.fulfillmentStatus === 'Cancelled' ? 'text-muted-foreground line-through' :
                currentOrder.fulfillmentStatus === 'Item Picked Up' || currentOrder.fulfillmentStatus === 'Service Completed' || currentOrder.fulfillmentStatus === 'Pickup Confirmed' ? 'text-green-600' :
                'text-foreground'
              }`}>{currentOrder.fulfillmentStatus}</span>
        </div>

        {currentOrder.paymentDetails.isInstallment && (
            <div className={`p-3 border rounded-lg text-sm ${
                currentOrder.paymentDetails.amountPaid >= currentOrder.paymentDetails.totalAmount ? 'border-green-500/30 bg-green-500/10 text-green-700' : 'border-blue-500/30 bg-blue-500/5 text-blue-700'
            }`}>
                {currentOrder.paymentDetails.amountPaid >= currentOrder.paymentDetails.totalAmount ? (
                    <p className="font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4"/>All installments paid!</p>
                ) : (
                    <>
                        <p className="font-semibold">This is an installment plan order.</p>
                        {currentOrder.paymentDetails.nextPaymentDate && (
                            <p>Next payment of {currentOrder.paymentDetails.installmentAmount.toLocaleString()} DZD is due on {format(new Date(currentOrder.paymentDetails.nextPaymentDate), 'PP')}.</p>
                        )}
                         <Button asChild variant="link" className="p-0 h-auto text-blue-600">
                           <Link href={`/payments/${currentOrder.orderId}`}>Manage Payments</Link>
                        </Button>
                    </>
                )}
            </div>
        )}


        <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg text-left">
            <h3 className="font-semibold text-primary mb-2 flex items-center"><Info className="w-5 h-5 mr-2"/>Instructions:</h3>
            <ul className="list-disc list-inside text-sm text-foreground space-y-1">
              <li>Visit the store for: {currentOrder.itemType === 'product' ? 'product pickup' : 'your service appointment'}.</li>
              <li>Show this confirmation page to the store owner.</li>
              <li>They will scan the QR code or enter the confirmation code.</li>
               {currentOrder.fulfillmentStatus === 'Pending Pickup' && currentOrder.itemType === 'product' && <li>Your item is ready for pickup.</li>}
               {currentOrder.fulfillmentStatus === 'Service Scheduled' && currentOrder.itemType === 'service' && <li>Your service appointment is scheduled.</li>}
               {currentOrder.fulfillmentStatus === 'Pickup Confirmed' && currentOrder.itemType === 'product' && <li>Your item has been confirmed and is ready for pickup.</li>}
            </ul>
        </div>
        <p className="text-xs text-muted-foreground">Order ID: {currentOrder.orderId}</p>
      </CardContent>
       <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/orders')} variant="outline">View All Orders</Button>
        </CardFooter>
    </Card>
  );
}

export default function ConfirmationClient() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md mx-auto text-center shadow-xl">
        <CardHeader><Skeleton className="h-7 w-3/4 mx-auto mb-2 sm:h-8" /></CardHeader>
        <CardContent className="space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}


    