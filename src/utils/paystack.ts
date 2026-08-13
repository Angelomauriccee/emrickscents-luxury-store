declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status: string; message: string; transaction: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface PaystackPaymentArgs {
  email: string;
  amountInNaira: number;
  reference: string;
  customerName: string;
  phone: string;
  itemsSummary?: string;
  deliveryAddress?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export async function triggerPaystackPayment({
  email,
  amountInNaira,
  reference,
  customerName,
  phone,
  itemsSummary,
  deliveryAddress,
  onSuccess,
  onClose,
}: PaystackPaymentArgs): Promise<void> {
  const loaded = await loadPaystackScript();
  if (!loaded || !window.PaystackPop) {
    throw new Error('Failed to load Paystack payment gateway.');
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('Paystack Public Key is missing. Please configure VITE_PAYSTACK_PUBLIC_KEY in your .env file.');
  }

  const customFields = [
    {
      display_name: 'Customer Name',
      variable_name: 'customer_name',
      value: customerName,
    },
    {
      display_name: 'Phone Number',
      variable_name: 'phone_number',
      value: phone,
    },
  ];

  if (deliveryAddress) {
    customFields.push({
      display_name: 'Delivery Address',
      variable_name: 'delivery_address',
      value: deliveryAddress,
    });
  }

  if (itemsSummary) {
    customFields.push({
      display_name: 'Items Purchased',
      variable_name: 'items_purchased',
      value: itemsSummary,
    });
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(amountInNaira * 100), // Convert NGN to Kobo
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: customFields,
    },
    callback: (response) => {
      onSuccess(response.reference);
    },
    onClose: () => {
      onClose();
    },
  });

  handler.openIframe();
}
