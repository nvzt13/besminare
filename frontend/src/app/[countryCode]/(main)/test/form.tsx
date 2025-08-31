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
  const [form, setForm] = useState({
    email: "",
    amount: "",
    cardOwner: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  })

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()

    const prep = await fetch("/store/paytr/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    add("cc_owner",  form.cardOwner)
    add("card_number", form.cardNumber.replace(/\s+/g, ""))
    add("expiry_month", form.expMonth)
    add("expiry_year",  form.expYear)
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
      {/* diğer inputlar... */}
      <button type="submit">Öde</button>
    </form>
  )
}
