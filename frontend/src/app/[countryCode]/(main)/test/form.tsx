"use client"
import { useState } from "react"

export default function Checkout() {
  const [token, setToken] = useState<string | null>(null)

  const handlePay = async () => {
    const res = await fetch("http://localhost:9000/store/paytr/prepare", {
      method: "POST",
          headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": "pk_8185b17d664a995f39e9d5b1918aa91ce966fc3870b656b74f7d649c403da833",
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
    })

    const data = await res.json()
    if (data.token) setToken(data.token)
    console.log(data.token)
  }

  return (
    <div className="p-6">
      <button
        onClick={handlePay}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ödeme Başlat
      </button>

      {token && (
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          width="100%"
          height="6000"
          frameBorder="0"
          scrolling="no"
        />
      )}
    </div>
  )
}