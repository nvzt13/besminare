import crypto from "crypto"

// NOT: Türleri basit tuttum; istersen MedusaRequest/MedusaResponse tiplerini ekleyebilirsin.
export async function POST(req: any, res: any) {
  const {
    email,
    amount,                 // "100.99" gibi string veya 100.99
    basket,                 // [["Ürün", "50.00", 1], ...]
    installment_count = "0",
    currency = "TL",
    non_3d = "0",           // Non-3D için 1 (bu yetki mağazada açık olmalı)
    payment_type = "card",  // hep 'card'
    client_lang = "tr",
    merchant_ok_url = "https://site.com/order/success",
    merchant_fail_url = "https://site.com/order/fail",
  } = req.body

  const merchant_id = process.env.PAYTR_MERCHANT_ID!
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!

  // Gerçek istemci IP'sini çıkar (proxy arkasında X-Forwarded-For öncelikli)
  const forwarded = (req.headers["x-forwarded-for"] || "") as string
  const user_ip =
    (forwarded.split(",")[0] || req.socket?.remoteAddress || "127.0.0.1").trim()

  const merchant_oid = "IN" + Date.now().toString() // benzersiz sipariş no

  // PayTR dokümanı: hash string sırası
  // merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
  const test_mode = "0" // canlıdayken test etmek istersen 1 gönderebilirsin
  const payment_amount =
    typeof amount === "number" ? amount.toFixed(2) : String(amount)

  const hashStr = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hashStr + merchant_salt)
    .digest("base64")

  return res.json({
    postUrl: "https://www.paytr.com/odeme", // form buraya POST edilecek
    fields: {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_type,
      payment_amount,
      currency,
      test_mode,
      non_3d,
      merchant_ok_url,
      merchant_fail_url,
      user_name: req.body.user_name || "Test Kullanıcı",
      user_address: req.body.user_address || "Adres",
      user_phone: req.body.user_phone || "05555555555",
      user_basket: JSON.stringify(basket || []), // [["Ürün","50.00",1],...]
      debug_on: "1",
      client_lang,
      paytr_token,
      installment_count,
      card_type: req.body.card_type || "", // taksitli işlemde tip gerekirse
      // İsteğe bağlı: sync_mode: "1" // JSON cevap dönsün istersen
    },
  })
}
