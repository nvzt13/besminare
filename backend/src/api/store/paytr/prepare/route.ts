import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const {
      email,
      user_name,
      user_address,
      user_phone,
      amount,
      basket,
      user_ip,
    } = req.body

    const merchant_id = process.env.PAYTR_MERCHANT_ID!
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!

    const merchant_oid = "IN" + Date.now() // benzersiz sipariş numarası

    // Sepeti base64 encode et
    const user_basket = Buffer.from(JSON.stringify(basket)).toString("base64")

    const max_installment = "0"
    const no_installment = "0"
    const currency = "TL"
    const test_mode = "1" // canlıya geçince "0"
    const merchant_ok_url = "http://localhost:3000/payment/success"
    const merchant_fail_url = "http://localhost:3000/payment/fail"
    const timeout_limit = 30
    const debug_on = 1
    const lang = "tr"

    // Token için hash string oluştur
    const hashStr = `${merchant_id}${user_ip}${merchant_oid}${email}${amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`

    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hashStr + merchant_salt)
      .digest("base64")

    // PayTR API çağrısı
    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        merchant_id,
        user_ip,
        merchant_oid,
        email,
        payment_amount: amount.toString(),
        user_name,
        user_address,
        user_phone,
        merchant_ok_url,
        merchant_fail_url,
        user_basket,
        no_installment,
        max_installment,
        currency,
        test_mode,
        timeout_limit: timeout_limit.toString(),
        debug_on: debug_on.toString(),
        lang,
        paytr_token,
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      return res.json({ token: data.token })
    } else {
      return res.status(400).json(data)
    }
  } catch (err) {
    console.error("PayTR prepare error:", err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}