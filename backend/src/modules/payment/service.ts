import { AbstractPaymentProvider } from "@medusajs/framework/utils"

type Options = {
  apiKey: string
  secretKey: string
  merchantId: string
  baseUrl?: string
}

class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "paytr"

  protected options_: Options

  constructor(container, options: Options) {
    super(container)
    this.options_ = options
  }

  async authorizePayment(paymentSession: any, context: any): Promise<any> {
    return {
      status: "pending",
      data: { session_id: "paytr_session_token" },
    }
  }

  async capturePayment(payment: any): Promise<any> {
    return { ...payment, status: "captured" }
  }

  async cancelPayment(payment: any): Promise<any> {
    return { ...payment, status: "canceled" }
  }

  async refundPayment(payment: any, amount: number): Promise<any> {
    return { ...payment, status: "refunded", refunded_amount: amount }
  }

  async deletePayment(paymentSession: any): Promise<any> {
    return { ...paymentSession, deleted: true }
  }

  async retrievePayment(paymentId: string): Promise<any> {
    return { id: paymentId, status: "authorized" }
  }

  async updatePayment(paymentSession: any, update: any): Promise<any> {
    return { ...paymentSession, ...update }
  }

  async getWebhookActionAndData(eventData: any): Promise<{ action: string; data: any }> {
    return { action: "authorize", data: eventData }
  }

  /**
   * Yeni: Ödeme başlatma
   */
  async initiatePayment(context: {
    amount: number
    currency_code: string
    order_id: string
    customer: any
  }): Promise<any> {
    return {
      session_id: "paytr_session_token",
      order_id: context.order_id,
      amount: context.amount,
      status: "pending",
    }
  }

  /**
   * Yeni: Ödeme durumunu sorgulama
   */
  async getPaymentStatus(paymentData: any): Promise<
    "pending" | "authorized" | "captured" | "canceled" | "refunded"
  > {
    // Burada PayTR API’den status çekebilirsin
    return "authorized"
  }
}

export default MyPaymentProviderService
