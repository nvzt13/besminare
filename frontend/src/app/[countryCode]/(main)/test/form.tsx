"use client"
import { useState } from "react"

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export function cartToPaytrBasket(cart: CartItem[]) {
  return cart.map((item) => [
    item.name,
    item.price.toFixed(2),
    item.quantity,
  ]);
}

export default function Checkout() {
  const cart: CartItem[] = [
    { name: "T-Shirt", price: 199.99, quantity: 1 },
    { name: "Pantolon", price: 349.50, quantity: 2 },
  ]

  const [form, setForm] = useState({
    email: "nevzatatalay79@gmail.com",
    amount: cart
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
    cardOwner: "nevzat",
    cardNumber: "4355084355084358",
    expMonth: "12",
    expYear: "2025",
    cvv: "000",
  })

  async function handlePay(e: React.FormEvent) {
  e.preventDefault()

  const prep = await fetch("http://localhost:9000/store/paytr/prepare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": "pk_8185b17d664a995f39e9d5b1918aa91ce966fc3870b656b74f7d649c403da833",
    },
    body: JSON.stringify({
      email: form.email,
      amount: form.amount,
      basket: cartToPaytrBasket(cart),
      installment_count: "0",
      non_3d: "0",
    }),
  }).then(r => r.json())
  const formEl = document.createElement("form")
  formEl.method = "POST"
  formEl.action = prep.postUrl

  Object.entries(prep.fields).forEach(([k, v]) => {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = String(k)
    input.value = String(v ?? "")
    formEl.appendChild(input)
  })

  const add = (name: string, value: string) => {
    const i = document.createElement("input")
    i.type = "hidden"
    i.name = name
    i.value = value
    formEl.appendChild(i)
  }
  add("cc_owner", form.cardOwner)
  add("card_number", form.cardNumber.replace(/\D/g, "")) // sadece rakamları al
  add("expiry_month", form.expMonth)
  add("expiry_year", form.expYear)
  add("cvv", form.cvv)

  document.body.appendChild(formEl)
  formEl.submit()
}

  return (
    <form onSubmit={handlePay}>
      <input
        type="email"
        placeholder="E-posta"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Kart sahibi"
        value={form.cardOwner}
        onChange={e => setForm({ ...form, cardOwner: e.target.value })}
      />
      <input
        type="text"
        placeholder="Kart numarası"
        value={form.cardNumber}
        onChange={e => setForm({ ...form, cardNumber: e.target.value })}
      />
      <input
        type="text"
        placeholder="Ay"
        value={form.expMonth}
        onChange={e => setForm({ ...form, expMonth: e.target.value })}
      />
      <input
        type="text"
        placeholder="Yıl"
        value={form.expYear}
        onChange={e => setForm({ ...form, expYear: e.target.value })}
      />
      <input
        type="text"
        placeholder="CVV"
        value={form.cvv}
        onChange={e => setForm({ ...form, cvv: e.target.value })}
      />
      <button type="submit">Öde</button>
    </form>
  )
}