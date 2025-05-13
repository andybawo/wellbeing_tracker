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
