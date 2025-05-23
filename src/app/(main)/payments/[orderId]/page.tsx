
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Order, PaymentInstallment, PaymentInstallmentStatus, FulfillmentStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CalendarDays, CheckCircle, Clock, DollarSign, Info, ListChecks, Percent, AlertTriangle, Hourglass, PackageOpen, CircleDollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { getDisplayPaymentStatus } from '@/components/order/OrderHistoryClient'; // Import the helper

function PaymentDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [orders, _setOrders, ordersHydrated] = useLocalStorageWithHydration<Order[]>('orders', []);
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined for loading, null if not found


  useEffect(() => {
    if (orderId && ordersHydrated) {
      const foundOrder = orders.find(o => o.orderId === orderId);
      if (foundOrder) {
        // Ensure paymentDetails is present, default if not (for older data)
        const paymentDetails = foundOrder.paymentDetails || {
            totalAmount: foundOrder.itemPrice, amountPaid: foundOrder.itemPrice, remainingAmount: 0,
            installmentsTotal: 1, installmentsPaid: 1, installmentAmount: foundOrder.itemPrice,
            paymentFrequency: 'Single', isInstallment: false,
            paymentHistory: [{ date: new Date(foundOrder.timestamp).toISOString(), amount: foundOrder.itemPrice, status: 'Paid' as PaymentInstallmentStatus}],
        };
        setOrder({ ...foundOrder, paymentDetails });
      } else {
        setOrder(null);
      }
    }
  }, [orderId, orders, ordersHydrated]);


  // Custom hook to know when useLocalStorage is hydrated
  function useLocalStorageWithHydration<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
    const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    return [storedValue, setStoredValue, hydrated];
  }


  if (order === undefined || !ordersHydrated) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  if (!order) {
     return (
      <Card className="w-full max-w-lg mx-auto text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-destructive flex items-center justify-center gap-2">
             <AlertTriangle /> Order Not Found
          </CardTitle>
          <CardDescription>
            Could not find an order with ID: {orderId}. It might have been removed or the ID is incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button onClick={() => router.push('/orders')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!order.paymentDetails.isInstallment) {
     return (
      <Card className="w-full max-w-lg mx-auto text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center justify-center gap-2">
             <Info /> Single Payment Order
          </CardTitle>
          <CardDescription>
            This order for <span className="font-semibold">{order.itemName}</span> was a single, full payment and does not have an installment plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                <p className="text-2xl font-semibold text-primary">{order.paymentDetails.totalAmount.toLocaleString()} DZD</p>
                <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Paid in full on {format(new Date(order.timestamp), 'PP')}</p>
            </div>
           <Button onClick={() => router.push('/orders')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }


  const { paymentDetails, itemName, fulfillmentStatus } = order;
  const progressPercentage = paymentDetails.totalAmount > 0 ? (paymentDetails.amountPaid / paymentDetails.totalAmount) * 100 : 0;
  const displayPaymentStatus = getDisplayPaymentStatus(paymentDetails);

  const getStatusIcon = (status: PaymentInstallmentStatus) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Due': return <Hourglass className="w-5 h-5 text-yellow-500" />;
      case 'Overdue': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Upcoming': return <CalendarDays className="w-5 h-5 text-blue-500" />;
      default: return <ListChecks className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: PaymentInstallmentStatus) => {
     switch (status) {
      case 'Paid': return 'bg-green-500/10 text-green-700';
      case 'Due': return 'bg-yellow-500/10 text-yellow-700';
      case 'Overdue': return 'bg-red-500/10 text-red-700';
      case 'Upcoming': return 'bg-blue-500/10 text-blue-700';
      default: return 'bg-muted/50 text-muted-foreground';
    }
  }

  const currentPaymentDueInstallment = paymentDetails.paymentHistory.find(p => p.date === paymentDetails.nextPaymentDate && (p.status === 'Due' || p.status === 'Overdue'));


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Installment Payment Details</CardTitle>
        <CardDescription className="text-md sm:text-lg">
          Tracking payments for: <span className="font-semibold text-foreground">{itemName}</span>
        </CardDescription>
        <div className="text-sm pt-2">
            <span className="font-semibold flex items-center"><PackageOpen className="w-4 h-4 mr-1.5 text-muted-foreground"/>Fulfillment Status:</span>
            <span className={`ml-1 font-medium ${
                 fulfillmentStatus === 'Cancelled' ? 'text-muted-foreground line-through' :
                 fulfillmentStatus === 'Item Picked Up' || fulfillmentStatus === 'Service Completed' ? 'text-green-600' :
                 'text-foreground'
            }`}>{fulfillmentStatus}</span>
        </div>
         <div className="text-sm">
            <span className="font-semibold flex items-center"><CircleDollarSign className="w-4 h-4 mr-1.5 text-muted-foreground"/>Overall Payment Status:</span>
             <span className={`ml-1 font-medium ${
                    displayPaymentStatus === 'Installment Overdue' ? 'text-destructive' :
                    displayPaymentStatus === 'Paid in Full' ? 'text-green-600' :
                    'text-foreground'
                }`}>{displayPaymentStatus}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full h-3 rounded-full" />
          <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
            <span>Paid: {paymentDetails.amountPaid.toLocaleString()} DZD</span>
            <span>Remaining: {paymentDetails.remainingAmount.toLocaleString()} DZD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center p-3 bg-muted/50 rounded-lg shadow-sm">
            <DollarSign className="w-5 h-5 mr-3 text-primary shrink-0" />
            <div>
              <p className="text-muted-foreground">Total Price</p>
              <p className="font-semibold text-foreground">{paymentDetails.totalAmount.toLocaleString()} DZD</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-muted/50 rounded-lg shadow-sm">
            <Percent className="w-5 h-5 mr-3 text-primary shrink-0" />
            <div>
              <p className="text-muted-foreground">Installments</p>
              <p className="font-semibold text-foreground">{paymentDetails.installmentsPaid} of {paymentDetails.installmentsTotal} paid</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-muted/50 rounded-lg shadow-sm">
            <DollarSign className="w-5 h-5 mr-3 text-primary shrink-0" />
            <div>
              <p className="text-muted-foreground">Per Installment</p>
              <p className="font-semibold text-foreground">{paymentDetails.installmentAmount.toLocaleString()} DZD</p>
            </div>
          </div>
           <div className="flex items-center p-3 bg-muted/50 rounded-lg shadow-sm">
            <CalendarDays className="w-5 h-5 mr-3 text-primary shrink-0" />
            <div>
              <p className="text-muted-foreground">Frequency</p>
              <p className="font-semibold text-foreground">{paymentDetails.paymentFrequency}</p>
            </div>
          </div>
          {paymentDetails.nextPaymentDate && paymentDetails.installmentsPaid < paymentDetails.installmentsTotal && currentPaymentDueInstallment && (
            <div className={`sm:col-span-2 flex items-center p-3 rounded-lg border shadow-sm ${
                currentPaymentDueInstallment.status === 'Overdue' ? 'border-red-500/50 bg-red-500/5' :
                currentPaymentDueInstallment.status === 'Due' ? 'border-yellow-500/50 bg-yellow-500/5' :
                'border-accent/30 bg-accent/5' // Should not happen if currentPaymentDueInstallment is only for Due/Overdue
            }`}>
              <Clock className={`w-5 h-5 mr-3 shrink-0 ${
                currentPaymentDueInstallment.status === 'Overdue' ? 'text-red-500' :
                currentPaymentDueInstallment.status === 'Due' ? 'text-yellow-600' :
                'text-accent'
              }`} />
              <div>
                <p className={`text-sm ${
                    currentPaymentDueInstallment.status === 'Overdue' ? 'text-red-700' :
                    currentPaymentDueInstallment.status === 'Due' ? 'text-yellow-700' :
                    'text-accent/90'
                }`}>Next Payment {currentPaymentDueInstallment.status === 'Overdue' ? 'Was Due' : 'Is Due'}</p>
                <p className={`font-semibold text-md ${
                    currentPaymentDueInstallment.status === 'Overdue' ? 'text-red-600' :
                    currentPaymentDueInstallment.status === 'Due' ? 'text-yellow-700' :
                    'text-accent'
                }`}>{format(new Date(paymentDetails.nextPaymentDate), 'PPP')}
                 {currentPaymentDueInstallment.status === 'Overdue' && <span className="font-bold"> (OVERDUE)</span>}
                 {currentPaymentDueInstallment.status === 'Due' && <span className="font-bold"> (DUE)</span>}
                </p>
              </div>
            </div>
          )}
           {paymentDetails.nextPaymentDate && paymentDetails.installmentsPaid < paymentDetails.installmentsTotal && !currentPaymentDueInstallment && (
             <div className="sm:col-span-2 flex items-center p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 shadow-sm">
                <CalendarDays className="w-5 h-5 mr-3 shrink-0 text-blue-500" />
                <div>
                    <p className="text-sm text-blue-700">Next Payment Due</p>
                    <p className="font-semibold text-md text-blue-600">{format(new Date(paymentDetails.nextPaymentDate), 'PPP')}</p>
                </div>
             </div>
           )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
            <ListChecks className="w-5 h-5 mr-2 text-primary"/> Payment History
          </h3>
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/3 font-semibold">Due Date</TableHead>
                  <TableHead className="text-right font-semibold">Amount (DZD)</TableHead>
                  <TableHead className="text-center w-1/4 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentDetails.paymentHistory.map((installment, index) => (
                  <TableRow key={index} className={
                    installment.status === 'Paid' ? 'bg-green-500/5 hover:bg-green-500/10' :
                    installment.status === 'Overdue' ? 'bg-red-500/5 hover:bg-red-500/10' :
                    installment.status === 'Due' ? 'bg-yellow-500/5 hover:bg-yellow-500/10' :
                    'hover:bg-muted/20'
                  }>
                    <TableCell>{format(new Date(installment.date), 'PP')}</TableCell>
                    <TableCell className="text-right">{installment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                       <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 ${getStatusClass(installment.status)}`}>
                         {getStatusIcon(installment.status)}
                         {installment.status}
                       </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {paymentDetails.installmentsPaid === paymentDetails.installmentsTotal && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center text-green-700 font-semibold flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle className="w-5 h-5"/> All payments completed!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function PaymentDetailsPage() {
    return (
         <Suspense fallback={
            <Card className="w-full max-w-2xl mx-auto shadow-xl">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-24 w-full" />
                  <div className="space-y-2 mt-6">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-40 w-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        }>
            <PaymentDetailsContent />
        </Suspense>
    )
}
