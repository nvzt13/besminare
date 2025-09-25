import { AbstractPaymentProvider } from "@medusajs/framework/utils";

type Options = {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  baseUrl?: string;
};

class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "paytr";

  protected options_: Options;

  constructor(container, options: Options) {
    super(container);
    this.options_ = options;
  }

  async authorizePayment(paymentSession: any, context: any): Promise<any> {
    const res = await fetch("http://localhost:9000/store/paytr/prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key":
          "pk_8185b17d664a995f39e9d5b1918aa91ce966fc3870b656b74f7d649c403da833",
      },
      body: JSON.stringify({
        email: "test@mail.com",
        user_name: "Nevzat Atalay",
        user_address: "Bitlis, Türkiye",
        user_phone: "05555555555",
        amount: 1000, // 10 TL
        basket: [
          ["Ürün 1", "10.00", 1],
          ["Ürün 2", "20.00", 2],
        ],
        user_ip: "88.250.110.22", // Gerçek client IP burada olmalı
      }),
    });

    const data = await res.json();
    if (data.token) {
      return {
        status: "pending",
        data: { token: data.token },
      };
    } else {
      throw new Error("PayTR token alınamadı: " + JSON.stringify(data));
    }
  }

  async capturePayment(payment: any): Promise<any> {
    return { ...payment, status: "captured" };
  }

  async cancelPayment(payment: any): Promise<any> {
    return { ...payment, status: "canceled" };
  }

  async refundPayment(payment: any, amount: number): Promise<any> {
    return { ...payment, status: "refunded", refunded_amount: amount };
  }

  async deletePayment(paymentSession: any): Promise<any> {
    return { ...paymentSession, deleted: true };
  }

  async retrievePayment(paymentId: string): Promise<any> {
    return { id: paymentId, status: "authorized" };
  }

  async updatePayment(paymentSession: any, update: any): Promise<any> {
    return { ...paymentSession, ...update };
  }

  async getWebhookActionAndData(
    eventData: any
  ): Promise<{ action: string; data: any }> {
    return { action: "authorize", data: eventData };
  }

  /**
   * Yeni: Ödeme başlatma
   */
  async initiatePayment(context: {
    amount: number;
    currency_code: string;
    order_id: string;
    customer: any;
  }): Promise<any> {
    return {
      session_id: "paytr_session_token",
      order_id: context.order_id,
      amount: context.amount,
      status: "pending",
    };
  }

  /**
   * Yeni: Ödeme durumunu sorgulama
   */
  async getPaymentStatus(
    paymentData: any
  ): Promise<"pending" | "authorized" | "captured" | "canceled" | "refunded"> {
    // Burada PayTR API’den status çekebilirsin
    return "authorized";
  }
}

export default MyPaymentProviderService;
