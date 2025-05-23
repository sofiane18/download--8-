
export type Engine = string;

export interface Model {
  name: string;
  years: number[];
  engines: Engine[];
}

export interface Brand {
  name: string;
  models: Model[];
}

export interface SelectedVehicle {
  brand?: string;
  model?: string;
  year?: number;
  engine?: string;
}

export interface CompatibleVehicle {
  brand: string;
  model?: string;
  years?: number[];
  engine?: string;
}

export interface Product {
  id: string;
  name:string;
  store: string;
  location: string;
  wilaya?: string;
  price: number;
  description: string;
  imageUrl?: string;
  mainCategory: string;
  subCategory: string;
  reviews: number;
  storeAddress: string;
  compatibleVehicles?: CompatibleVehicle[];
}

export interface Service {
  id: string;
  name: string;
  store: string;
  location: string;
  wilaya?: string;
  price: number;
  description: string;
  imageUrl?: string;
  mainCategory: string;
  subCategory: string;
  reviews: number;
  storeAddress: string;
  compatibleVehicles?: CompatibleVehicle[];
}

export interface Store {
  id: string;
  name: string;
  location: string;
  wilaya: string;
  type: string;
  address: string;
  imageUrl?: string;
  rating: number;
}

export type FulfillmentStatus =
  | 'Pending Pickup'       // System initial state, store hasn't necessarily confirmed readiness
  | 'Pickup Confirmed'     // Store has confirmed the order is ready for customer pickup
  | 'Service Scheduled'    // Service booked, waiting for appointment date
  | 'Item Picked Up'       // Product collected by customer
  | 'Service Completed'    // Service rendered to customer
  | 'Cancelled';           // Order has been cancelled

// This type is for derived display purposes, not stored directly on Order
export type CalculatedPaymentStatus =
  | 'Paid in Full'
  | 'Payment Pending'      // For new installment plans where first payment is due/upcoming
  | 'Installments Ongoing' // Actively paying installments
  | 'Installment Overdue'  // At least one installment is overdue
  | 'Awaiting Final Payment'; // Only the last installment is due/upcoming


export type PaymentInstallmentStatus = 'Paid' | 'Due' | 'Overdue' | 'Upcoming';

export interface PaymentInstallment {
  date: string; // ISO string
  amount: number;
  status: PaymentInstallmentStatus;
}

export interface PaymentDetails {
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  installmentAmount: number;
  nextPaymentDate?: string; // ISO string
  paymentFrequency: 'Monthly' | 'Weekly' | 'Bi-Weekly' | 'Single';
  paymentHistory: PaymentInstallment[];
  isInstallment: boolean;
}

export interface Order {
  orderId: string;
  itemId: string;
  itemType: 'product' | 'service';
  itemName: string;
  itemPrice: number;
  timestamp: number; // Milliseconds for order placement
  buyerId: string;
  qrCodeValue: string;
  confirmationCode: string;
  fulfillmentStatus: FulfillmentStatus;
  paymentDetails: PaymentDetails;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: keyof typeof import('lucide-react');
  type: 'product' | 'service';
  subCategories: SubCategory[];
}

// This is the comprehensive car brand data
export const carBrandsData: Brand[] = [
  {
    name: "Toyota",
    models: [
      {
        name: "Corolla",
        years: [
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.3L Petrol",
          "1.6L Petrol",
          "1.8L Hybrid"
        ]
      },
      {
        name: "Hilux",
        years: [
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "2.4L Diesel",
          "2.8L Diesel",
          "3.0L Diesel"
        ]
      },
      {
        name: "Land Cruiser",
        years: [
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "4.0L Petrol",
          "4.5L Diesel",
          "5.7L Petrol"
        ]
      }
    ]
  },
  {
    name: "Renault",
    models: [
      {
        name: "Symbol",
        years: [
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020
        ],
        engines: [
          "1.2L Petrol",
          "1.5L Diesel"
        ]
      },
      {
        name: "Clio",
        years: [
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.2L Petrol",
          "1.5L Diesel",
          "1.6L Petrol"
        ]
      },
      {
        name: "Megane",
        years: [
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.6L Petrol",
          "1.9L Diesel",
          "2.0L Petrol"
        ]
      }
    ]
  },
  {
    name: "Hyundai",
    models: [
      {
        name: "Accent",
        years: [
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.4L Petrol",
          "1.6L Petrol"
        ]
      },
      {
        name: "Elantra",
        years: [
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.6L Petrol",
          "2.0L Petrol",
          "1.6L Diesel"
        ]
      },
      {
        name: "Tucson",
        years: [
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "2.0L Petrol",
          "2.0L Diesel",
          "1.6L Turbo"
        ]
      }
    ]
  },
  {
    name: "Peugeot",
    models: [
      {
        name: "208",
        years: [
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.2L Petrol",
          "1.5L Diesel"
        ]
      },
      {
        name: "301",
        years: [
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.6L Diesel",
          "1.6L Petrol"
        ]
      },
      {
        name: "308",
        years: [
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.6L Petrol",
          "2.0L Diesel"
        ]
      }
    ]
  },
  {
    name: "Volkswagen",
    models: [
      {
        name: "Golf",
        years: [
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.4L TSI",
          "1.6L Diesel",
          "2.0L GTI"
        ]
      },
      {
        name: "Passat",
        years: [
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.8L TSI",
          "2.0L Diesel",
          "3.6L V6"
        ]
      },
      {
        name: "Polo",
        years: [
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.2L Petrol",
          "1.4L Diesel"
        ]
      }
    ]
  },
  {
    name: "Mercedes-Benz",
    models: [
      {
        name: "C-Class",
        years: [
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "1.6L Petrol",
          "2.0L Diesel",
          "3.0L V6"
        ]
      },
      {
        name: "E-Class",
        years: [
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "2.0L Petrol",
          "2.2L Diesel",
          "3.5L V6"
        ]
      },
      {
        name: "GLC",
        years: [
          2015,
          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022
        ],
        engines: [
          "2.0L Petrol",
          "2.1L Diesel",
          "3.0L Hybrid"
        ]
      }
    ]
  }
];
