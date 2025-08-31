import axios from 'axios';
import * as crypto from 'crypto';

// PayTR test bilgileri
const MERCHANT_ID = "576786";
const MERCHANT_KEY = "QroA51zFtRnLeYjY";
const MERCHANT_SALT = "xi3yBKteR8tZjY1r";
const MERCHANT_OID = "ORDER123456";
const USER_IP = "85.34.78.112";
const EMAIL = "testnon3d@paytr.com";
const PAYMENT_AMOUNT = "10099";   // 100.99 TL -> Kuruş cinsinden
const CURRENCY = "TL";
const INSTALLMENT_COUNT = "0";
const NO_INSTALLMENT = "1";  // Taksitsiz işlem
const MAX_INSTALLMENT = "0";
const NON_3D = "0";
const TEST_MODE = "1";  // Test ortamında olduğu için 1, canlıda 0 olmalı
const OK_URL = "https://11fc2b4d2344.ngrok-free.app/";
const FAIL_URL = "https://11fc2b4d2344.ngrok-free.app/";
const USER_NAME = "PayTR Test";
const USER_ADDRESS = "İstanbul Türkiye";
const USER_PHONE = "05555555555";
const USER_BASKET = '[["Örnek Ürün","100.99",1]]';
const CC_OWNER = "PayTR Test";
const CARD_NUMBER = "9792030394440796";  // Kart numarası
const EXPIRY_MONTH = "12";  // Kart son kullanma ayı
const EXPIRY_YEAR = "25";  // Kart son kullanma yılı
const CLIENT_LANG = "tr";
const CVV = "000";  // Kart güvenlik kodu

// user_basket URL encode
const USER_BASKET_ENCODED = encodeURIComponent(USER_BASKET);

// Token hesaplama
const HASH_STR = `${MERCHANT_ID}${MERCHANT_OID}${PAYMENT_AMOUNT}${OK_URL}${FAIL_URL}${USER_BASKET_ENCODED}${NO_INSTALLMENT}${MAX_INSTALLMENT}${CURRENCY}${TEST_MODE}${MERCHANT_SALT}`;
const PAYTR_TOKEN = crypto.createHmac('sha256', MERCHANT_KEY).update(HASH_STR).digest('base64');

// Ödeme isteği için JSON veri
const postData = {
  merchant_id: MERCHANT_ID,
  user_ip: USER_IP,
  merchant_oid: MERCHANT_OID,
  email: EMAIL,
  payment_type: 'card',
  payment_amount: PAYMENT_AMOUNT,
  currency: CURRENCY,
  installment_count: INSTALLMENT_COUNT,
  no_installment: NO_INSTALLMENT,
  max_installment: MAX_INSTALLMENT,
  non_3d: NON_3D,
  test_mode: TEST_MODE,
  merchant_ok_url: OK_URL,
  merchant_fail_url: FAIL_URL,
  user_name: USER_NAME,
  user_address: USER_ADDRESS,
  user_phone: USER_PHONE,
  user_basket: USER_BASKET_ENCODED,
  cc_owner: CC_OWNER,
  card_number: CARD_NUMBER,
  expiry_month: EXPIRY_MONTH,
  expiry_year: EXPIRY_YEAR,
  cvv: CVV,
  client_lang: CLIENT_LANG,
  paytr_token: PAYTR_TOKEN
};

// PayTR'ye JSON formatında POST isteği gönderme
axios.post('https://www.paytr.com/odeme', postData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Ödeme isteği başarılı:', response.data);
})
.catch(error => {
  console.error('Ödeme isteği hatası:', error);
});
