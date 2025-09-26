import { AbstractPaymentProvider } from "@medusajs/framework/utils"

class CodProviderService extends AbstractPaymentProvider {
  static identifier = "cod"

  constructor(_, options) {
    super(_, options)
  }

  async getStatus(paymentData: any): Promise<string> {
    return paymentData?.status || "pending"
  }

  async initiatePayment(context: any): Promise<any> {
    return {
      id: `cod_${Date.now()}`,
      status: "pending",
      amount: context.amount,
      currency_code: context.currency_code,
    }
  }

  async capturePayment(paymentData: any): Promise<any> {
    return { ...paymentData, status: "captured" }
  }

  async cancelPayment(paymentData: any): Promise<any> {
    return { ...paymentData, status: "canceled" }
  }

  async refundPayment(paymentData: any, amount: number): Promise<any> {
    return { ...paymentData, status: "refunded", refunded_amount: amount }
  }
}

export default CodProviderService
