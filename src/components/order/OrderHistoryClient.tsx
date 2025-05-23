
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Order, FulfillmentStatus, PaymentDetails, PaymentInstallment, PaymentInstallmentStatus, CalculatedPaymentStatus } from '@/lib/types';
import { mockProducts, mockServices } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Added Button import
import Link from 'next/link';
import { PackageOpen, ShoppingCart, CalendarDays, Tag, QrCodeIcon, CreditCard, AlertTriangle, CheckCircle2, Hourglass, CircleDollarSign, RefreshCw } from 'lucide-react';
import { format, addMonths, subMonths, subDays, isPast, isToday, startOfDay, addDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function generateAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper to create detailed mock payment history
const createDetailedMockPaymentHistory = (
  itemPrice: number,
  installmentsTotal: number,
  installmentsAlreadyPaid: number,
  orderDate: Date,
  isFullPayment: boolean = false
): PaymentDetails => {
  if (isFullPayment || installmentsTotal <= 1) {
    return {
      totalAmount: itemPrice, amountPaid: itemPrice, remainingAmount: 0,
      installmentsTotal: 1, installmentsPaid: 1, installmentAmount: itemPrice,
      paymentFrequency: 'Single', isInstallment: false,
      paymentHistory: [{ date: orderDate.toISOString(), amount: itemPrice, status: 'Paid' }],
    };
  }

  const installmentAmount = parseFloat((itemPrice / installmentsTotal).toFixed(2));
  const history: PaymentInstallment[] = [];
  const today = startOfDay(new Date());
  
  const firstPaymentBaseDate = addMonths(startOfDay(orderDate), 1); 

  for (let i = 0; i < installmentsTotal; i++) {
    const dueDate = startOfDay(addMonths(firstPaymentBaseDate, i));
    let status: PaymentInstallmentStatus;

    if (i < installmentsAlreadyPaid) {
      status = 'Paid';
    } else { 
      if (isToday(dueDate)) {
        status = 'Due';
      } else if (isPast(dueDate)) {
        status = 'Overdue';
      } else { 
        status = 'Upcoming';
      }
    }
    history.push({
      date: dueDate.toISOString(),
      amount: installmentAmount,
      status: status,
    });
  }

  const amountPaid = installmentsAlreadyPaid * installmentAmount;
  const remainingAmount = Math.max(0, itemPrice - amountPaid); 

  let nextPaymentDate: string | undefined = undefined;
  const nextNonPaidInstallment = history.find(p => p.status !== 'Paid');
  if (nextNonPaidInstallment) {
    nextPaymentDate = nextNonPaidInstallment.date;
  }


  return {
    totalAmount: itemPrice, amountPaid, remainingAmount,
    installmentsTotal, installmentsPaid: installmentsAlreadyPaid, installmentAmount,
    paymentFrequency: 'Monthly', isInstallment: true,
    paymentHistory: history, nextPaymentDate,
  };
};


export function getDisplayPaymentStatus(paymentDetails: PaymentDetails): CalculatedPaymentStatus {
  if (!paymentDetails.isInstallment) {
    return 'Paid in Full';
  }

  if (paymentDetails.installmentsPaid >= paymentDetails.installmentsTotal) {
     // Check if total amount paid actually covers total price (handling potential float issues)
    if (paymentDetails.amountPaid >= paymentDetails.totalAmount - (paymentDetails.installmentAmount * 0.01)) { // Allow small tolerance
        return 'Paid in Full';
    }
  }
  
  const overdueInstallment = paymentDetails.paymentHistory.find(p => p.status === 'Overdue');
  if (overdueInstallment) {
    return 'Installment Overdue';
  }
  
  if (paymentDetails.installmentsPaid === 0) {
     const firstPayment = paymentDetails.paymentHistory.find(p => p.status === 'Due' || p.status === 'Upcoming');
    if (firstPayment) {
      return 'Payment Pending'; 
    }
  }
  
  if (paymentDetails.installmentsPaid < paymentDetails.installmentsTotal) {
     if (paymentDetails.installmentsPaid === paymentDetails.installmentsTotal - 1) {
        const lastPayment = paymentDetails.paymentHistory[paymentDetails.paymentHistory.length - 1];
        if (lastPayment && (lastPayment.status === 'Due' || lastPayment.status === 'Upcoming')) {
            return 'Awaiting Final Payment';
        }
     }
     return 'Installments Ongoing';
  }
  
  return 'Payment Processing'; // Fallback
}


export default function OrderHistoryClient() {
  const [ordersFromStorage, setOrdersInStorage] = useLocalStorage<Order[]>('orders', []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // This useEffect handles the initial seeding of mock data if localStorage is empty
  useEffect(() => {
    if (hydrated && ordersFromStorage.length === 0 && mockProducts.length > 0 && mockServices.length > 0) {
      const buyerId = 'AutoDinarUser001';
      const now = new Date();
      const initialMockOrders: Order[] = [];

      // Order 1: Product (Air Filter), 2/6 installments paid, 3rd installment DUE, Item Picked Up
      if (mockProducts[2]) { 
        const orderDateForDueCase = subMonths(now, 3); // Order 3 months ago
        initialMockOrders.push({
          orderId: `ORD-MOCK-${generateAlphanumericCode(4)}-AIRFILTER`,
          itemId: mockProducts[2].id, 
          itemType: 'product', 
          itemName: mockProducts[2].name, // Air Filter - 1200 DZD
          itemPrice: mockProducts[2].price, 
          timestamp: orderDateForDueCase.getTime(), 
          buyerId, 
          qrCodeValue: `QR-MOCK-AIRFILTER`, 
          confirmationCode: generateAlphanumericCode(6),
          fulfillmentStatus: 'Item Picked Up', 
          paymentDetails: createDetailedMockPaymentHistory(mockProducts[2].price, 6, 2, orderDateForDueCase) 
        });
      }

      // Order 2: SPECIFIC MOCK - Heavy Duty Car Battery, 3/6 paid, next (4th) due today, Pickup Confirmed
      if (mockProducts[5]) { // Heavy Duty Car Battery 12V 70Ah - 8500 DZD
        const orderDateForSpecificBattery = subMonths(now, 4); // Order 4 months ago. 
        initialMockOrders.push({
          orderId: `ORD-MOCK-${generateAlphanumericCode(4)}-BATTERY3OF6`,
          itemId: mockProducts[5].id,
          itemType: 'product',
          itemName: mockProducts[5].name,
          itemPrice: mockProducts[5].price,
          timestamp: orderDateForSpecificBattery.getTime(),
          buyerId,
          qrCodeValue: `QR-MOCK-BATTERY3OF6`,
          confirmationCode: generateAlphanumericCode(6),
          fulfillmentStatus: 'Pickup Confirmed',
          paymentDetails: createDetailedMockPaymentHistory(mockProducts[5].price, 6, 3, orderDateForSpecificBattery)
        });
      }
      
      // Order 3: Service (Car Wash), Installment (3 total, 1 paid, 1 due), Service Scheduled
      if (mockServices[0]) { 
        const orderDateCarWash = subMonths(now, 2); // Order 2 months ago
        initialMockOrders.push({
          orderId: `ORD-MOCK-${generateAlphanumericCode(4)}-CARWASH`,
          itemId: mockServices[0].id, itemType: 'service', itemName: mockServices[0].name, itemPrice: mockServices[0].price,
          timestamp: orderDateCarWash.getTime(), buyerId, qrCodeValue: `QR-MOCK-CARWASH`, confirmationCode: generateAlphanumericCode(6),
          fulfillmentStatus: 'Service Scheduled',
          paymentDetails: createDetailedMockPaymentHistory(mockServices[0].price, 3, 1, orderDateCarWash)
        });
      }

      // Order 4: Product (Michelin Tire), Installment (6 total, 1 paid, 1 *OVERDUE*), Pending Pickup
      if (mockProducts[10]) { 
        const overdueOrderDateTire = subMonths(now, 3); // Order 3 months ago.
        initialMockOrders.push({
          orderId: `ORD-MOCK-${generateAlphanumericCode(4)}-TIREOVERDUE`,
          itemId: mockProducts[10].id, itemType: 'product', itemName: mockProducts[10].name, itemPrice: mockProducts[10].price,
          timestamp: overdueOrderDateTire.getTime(), buyerId, qrCodeValue: `QR-MOCK-TIREOVERDUE`, confirmationCode: generateAlphanumericCode(6),
          fulfillmentStatus: 'Pending Pickup', 
          paymentDetails: createDetailedMockPaymentHistory(mockProducts[10].price, 6, 1, overdueOrderDateTire) 
        });
      }
      
      // Order 5: Product, Paid in full, Item Picked Up
      if (mockProducts[0]) { 
        const orderDateFullPayment = subDays(now, 10);
        initialMockOrders.push({
          orderId: `ORD-MOCK-${generateAlphanumericCode(4)}-FULLPAID`,
          itemId: mockProducts[0].id, itemType: 'product', itemName: mockProducts[0].name, itemPrice: mockProducts[0].price,
          timestamp: orderDateFullPayment.getTime(), buyerId, qrCodeValue: `QR-MOCK-FULLPAID`, confirmationCode: generateAlphanumericCode(6),
          fulfillmentStatus: 'Item Picked Up',
          paymentDetails: createDetailedMockPaymentHistory(mockProducts[0].price, 1, 1, orderDateFullPayment, true)
        });
      }

      if (initialMockOrders.length > 0) {
        setOrdersInStorage(initialMockOrders);
      }
    }
  }, [hydrated, ordersFromStorage.length, setOrdersInStorage]);


  const processedOrders = useMemo(() => {
    if (!hydrated) return [];
    return ordersFromStorage.map(order => {
      const fulfillmentStatus = order.fulfillmentStatus || (order.itemType === 'product' ? 'Pending Pickup' : 'Service Scheduled');
      
      const paymentDetails = order.paymentDetails || {
          totalAmount: order.itemPrice, amountPaid: order.itemPrice, remainingAmount: 0,
          installmentsTotal: 1, installmentsPaid: 1, installmentAmount: order.itemPrice,
          paymentFrequency: 'Single', isInstallment: false,
          paymentHistory: [{ date: new Date(order.timestamp).toISOString(), amount: order.itemPrice, status: 'Paid' as PaymentInstallmentStatus}],
      };

      return {
        ...order,
        fulfillmentStatus,
        paymentDetails,
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [ordersFromStorage, hydrated]);

  const handleResetAndSeedData = () => {
    // Clear existing orders from localStorage by setting an empty array
    setOrdersInStorage([]);
    // The useEffect that depends on ordersFromStorage.length === 0 will then re-trigger the seeding.
    // To ensure it re-triggers even if the mock data generation was somehow skipped, we can force a re-render
    // or directly call a seeding function if we refactor. For now, setOrdersInStorage([]) should work.
    // To be absolutely sure it runs, we could toggle a state that the seeding useEffect depends on,
    // but relying on the ordersFromStorage.length change is the primary mechanism.
  };


  if (!hydrated) {
    return (
      <div className="space-y-6">
        {[1,2,3].map(i => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add the Reset Button */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={handleResetAndSeedData} className="border-destructive text-destructive hover:bg-destructive/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset &amp; Seed Mock Orders
        </Button>
      </div>

      {processedOrders.length === 0 ? (
        <div className="text-center py-10">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders. Start exploring products and services, or try resetting mock data.</p>
          <Button asChild>
            <Link href="/">Explore Now</Link>
          </Button>
        </div>
      ) : (
        processedOrders.map((order) => {
          const displayPaymentStatus = getDisplayPaymentStatus(order.paymentDetails);
          let paymentStatusSummary = '';
          if (order.paymentDetails.isInstallment) {
              paymentStatusSummary = `${order.paymentDetails.installmentsPaid}/${order.paymentDetails.installmentsTotal} installments paid`;
          } else {
              paymentStatusSummary = `${order.itemPrice.toLocaleString()} DZD (Paid in full)`;
          }

          const nextDueInstallment = order.paymentDetails.isInstallment 
              ? order.paymentDetails.paymentHistory.find(p => p.date === order.paymentDetails?.nextPaymentDate && (p.status === 'Due' || p.status === 'Overdue'))
              : null;


          return (
            <Card key={order.orderId} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
                  <span>{order.itemName}</span>
                  <span className="text-base sm:text-lg font-semibold text-primary">{order.itemPrice.toLocaleString()} DZD</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Order ID: {order.orderId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                  Ordered on: {format(new Date(order.timestamp), 'PPP p')}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Tag className="w-4 h-4 mr-2 text-primary" />
                  Type: {order.itemType === 'product' ? 'Product' : 'Service'}
                </div>
                <div className="flex items-center">
                  <PackageOpen className="w-4 h-4 mr-2 text-primary" />
                  Fulfillment:
                  <span className={`font-medium ml-1 ${
                    order.fulfillmentStatus === 'Cancelled' ? 'text-muted-foreground line-through' :
                    order.fulfillmentStatus === 'Item Picked Up' || order.fulfillmentStatus === 'Service Completed' || order.fulfillmentStatus === 'Pickup Confirmed' ? 'text-green-600' :
                    'text-foreground'
                  }`}>{order.fulfillmentStatus}</span>
                </div>
                <div className="flex items-center">
                  <CircleDollarSign className="w-4 h-4 mr-2 text-primary" />
                  Payment:
                  <span className={`font-medium ml-1 ${
                      displayPaymentStatus === 'Installment Overdue' ? 'text-destructive' :
                      displayPaymentStatus === 'Paid in Full' ? 'text-green-600' :
                      'text-foreground'
                  }`}>{displayPaymentStatus}</span>
                </div>

                {order.paymentDetails.isInstallment && (
                  <div className="pl-6 mt-1 space-y-1 text-muted-foreground">
                    <div className="flex items-center">
                       <CreditCard className="w-3.5 h-3.5 mr-2 text-primary/80" />
                       {paymentStatusSummary}
                    </div>
                    {order.paymentDetails.installmentsPaid < order.paymentDetails.installmentsTotal && order.paymentDetails.nextPaymentDate && (
                      <div className="flex items-center">
                        <Hourglass className="w-3.5 h-3.5 mr-2 text-primary/80" />
                        Next payment: {format(new Date(order.paymentDetails.nextPaymentDate), 'PP')}
                        {nextDueInstallment?.status === 'Overdue' &&
                          <span className="text-destructive font-semibold ml-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/>(OVERDUE)</span>}
                         {nextDueInstallment?.status === 'Due' &&
                          <span className="text-yellow-600 font-semibold ml-1">(DUE)</span>}
                      </div>
                    )}
                    {order.paymentDetails.installmentsPaid >= order.paymentDetails.installmentsTotal && order.paymentDetails.isInstallment && 
                      (order.paymentDetails.amountPaid >= order.paymentDetails.totalAmount - (order.paymentDetails.installmentAmount * 0.01) ) && (
                        <div className="flex items-center text-green-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2"/> All installments paid!
                        </div>
                    )}
                  </div>
                )}
                 {!order.paymentDetails.isInstallment && (
                   <div className="pl-6 mt-1 text-green-600 font-medium flex items-center">
                       <CheckCircle2 className="w-3.5 h-3.5 mr-2"/> {paymentStatusSummary}
                   </div>
                 )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 justify-start">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                  <Link href={`/confirmation?orderId=${order.orderId}`}>
                    <QrCodeIcon className="w-4 h-4 mr-2" /> View Confirmation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                  <Link href={`/payments/${order.orderId}`}>
                    <CreditCard className="w-4 h-4 mr-2" /> Manage Payments
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
}

