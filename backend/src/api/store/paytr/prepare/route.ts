import crypto from "crypto"

export async function POST(req: any, res: any) {
  const {
    email,
    amount,
    basket,
    installment_count = "0",
    currency = "TL",
    non_3d = "0",
    payment_type = "card",
    client_lang = "tr",
    merchant_ok_url = "https://site.com/order/success",
    merchant_fail_url = "https://site.com/order/fail",
    card_type = "",
    user_name = "Test Kullanıcı",
    user_address = "Adres",
    user_phone = "05555555555",
  } = await req.body

  const merchant_id = process.env.PAYTR_MERCHANT_ID!
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!

  const forwarded = (req.headers["x-forwarded-for"] || "") as string
  const user_ip = "5.229.127.76"

  const merchant_oid = "IN" + Date.now().toString()

  const test_mode = "0"
  const payment_amount = "100"

  // Hash
  const hashStr = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`
  const paytr_token = crypto
    .createHmac("sha256", merchant_key )
    .update(hashStr + merchant_salt)
    .digest("base64")

  // Zorunlu alanlar
  const no_installment = "0"   // 0: taksit yapılabilir, 1: sadece tek çekim
  const max_installment = "12" // en fazla 12 taksit

  const fields = {
  merchant_id,
  user_ip,
  merchant_oid,
  email,
  payment_amount,
  payment_type,
  currency,
  test_mode,
  non_3d,
  merchant_ok_url,
  merchant_fail_url,
  user_name,
  user_address,
  user_phone,
  user_basket: JSON.stringify(basket || []),
  debug_on: "1",
  client_lang,   // senin eklediğin
  lang: client_lang, // PayTR’un istediği
  paytr_token,
  installment_count,
  card_type,
  no_installment,
  max_installment,
}

  console.log("PayTR Gönderilen Alanlar:", fields)

  return res.json({
    postUrl: "https://www.paytr.com/odeme",
    fields,
  })
}