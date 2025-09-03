import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { merchant_oid, status, total_amount, hash } = req.body

  const merchant_key = process.env.PAYTR_MERCHANT_KEY!
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!

  const paytr_token = merchant_oid + merchant_salt + status + total_amount
  const token = crypto
    .createHmac("sha256", merchant_key)
    .update(paytr_token)
    .digest("base64")

  if (token !== hash) {
    return res.status(400).send("Bad hash")
  }

  if (status === "success") {
    // ✅ siparişi başarılı olarak işaretle
  } else {
    // ❌ ödeme başarısız
  }

  return res.send("OK")
}