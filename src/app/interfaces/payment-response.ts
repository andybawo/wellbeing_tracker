export interface PaystackPaymentInitiationResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
}

export interface FlutterwavePaymentInitiationResponse {
  status: string;
  message: string;
  data?: {
    link?: string;
  };
}

export interface PaymentResponse {
  status?: boolean | string;
  success?: boolean;
  message: string;
  data:
    | {
        authorization_url?: string;
        access_code?: string;
        reference?: string;
        link?: string; // For Flutterwave
      }
    | string
    | null;
  errors?: any[];
}
