import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Updated to include both possible response formats
interface PaymentResponse {
  status?: boolean | string;
  success?: boolean;
  message: string;
  data:
    | {
        authorization_url?: string;
        access_code?: string;
        reference?: string;
      }
    | string
    | null;
  errors?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Initiates a payment transaction with either Paystack or Flutterwave.
   *
   * @param gateway The payment gateway to use ('paystack' or 'flutterwave').
   * @param packageId The ID of the package being purchased.
   * @param token The user's authentication token.
   * @returns An Observable containing the payment initiation response.
   */
  initiatePayment(
    gateway: 'paystack' | 'flutterwave',
    packageId: number,
    token: string
  ): Observable<PaymentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}/payment/${gateway}`;
    const body = {
      id: packageId,
    };

    // console.log('Initiate Payment Request Body:', JSON.stringify(body)); // Log the request body

    return this.http.post<PaymentResponse>(url, packageId, { headers }).pipe(
      tap((response) =>
        console.log('Initiate Payment Success Response:', response)
      ), // Log successful responses
      catchError((error: any) => {
        // Use 'any' to capture the full error object
        // console.error(`Error initiating payment with ${gateway}:`, error);
        // console.error('Full Error Response:', error); // Log the entire error object
        // console.error(
        //   'Backend Validation Errors (if any):',
        //   error?.error?.errors
        // ); // Keep logging validation errors

        return of({
          status: false, // Assuming your PaymentResponse has a 'status' property
          message: `Failed to initiate payment with ${gateway}`,
          data: null,
          errors: [error.message || 'Unknown error'],
        });
      })
    );
  }

  /**
   * Verifies a payment transaction using the transaction reference.
   *
   * @param transactionRef The transaction reference ID.
   * @param token The user's authentication token.
   * @returns An Observable containing the payment verification response.
   */
  verifyPayment(
    transactionRef: string,
    token: string
  ): Observable<PaymentResponse> {
    const verificationUrl = `${this.apiUrl}/payment/verify/${transactionRef}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .post<PaymentResponse>(verificationUrl, {}, { headers })
      .pipe(
        tap((response) =>
          console.log('Payment verification response:', response)
        ),
        catchError((error) => {
          // console.error('Error verifying payment:', error);
          return of({
            status: false,
            message: 'Payment verification failed',
            data: null,
            errors: [error.message || 'Unknown error'],
          });
        })
      );
  }

  /**
   * Creates a new subscription record after successful payment verification.
   *
   * @param packageId The ID of the package.
   * @param token The user's authentication token.
   * @returns An Observable containing the new subscription response.
   */
  newSubscription(
    packageId: number,
    token: string
  ): Observable<PaymentResponse> {
    const subscriptionUrl = `${this.apiUrl}/payment/newsubscription`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Modified to handle plain text response
    return this.http
      .post(subscriptionUrl, packageId, {
        headers,
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<string>) => {
          // console.log('Raw subscription response:', response.body);
          // Convert the text response to our PaymentResponse format
          return {
            status: response.ok,
            success: response.ok, // Include both status and success for compatibility
            message: response.body || 'Subscription created successfully',
            data: null,
          } as PaymentResponse;
        }),
        catchError((error) => {
          // console.error('Error creating new subscription:', error);
          return of({
            status: false,
            success: false,
            message: 'Failed to create new subscription',
            data: null,
            errors: [error.message || 'Unknown error'],
          });
        })
      );
  }

  /**
   * Combines payment verification and new subscription creation into a single operation.
   *
   * @param transactionRef The transaction reference ID.
   * @param token The user's authentication token.
   * @param packageId The ID of the package.
   * @returns An Observable containing the result of the combined operation.
   */
  verifyAndCreateSubscription(
    transactionRef: string,
    token: string,
    packageId: number
  ): Observable<PaymentResponse> {
    return this.verifyPayment(transactionRef, token).pipe(
      switchMap((verificationResponse: PaymentResponse) => {
        // Check for both success and status fields to handle inconsistent backend responses
        const isVerified =
          verificationResponse.success === true ||
          verificationResponse.status === true ||
          verificationResponse.status === 'true';

        // console.log('Is payment verified?', isVerified, verificationResponse);

        if (isVerified) {
          return this.newSubscription(packageId, token);
        } else {
          return of({
            status: false,
            success: false,
            message: 'Payment verification failed',
            data: null,
            errors: verificationResponse.errors || [
              'Unknown verification error',
            ],
          });
        }
      }),
      catchError((error) => {
        // console.error('Error in verifyAndCreateSubscription:', error);
        return of({
          status: false,
          success: false,
          message: 'Error processing payment and subscription',
          data: null,
          errors: [error.message || 'Unknown error'],
        });
      })
    );
  }
}
