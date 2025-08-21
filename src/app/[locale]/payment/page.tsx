"use client"

import PortOne from "@portone/browser-sdk/v2"
import { useEffect, useState } from "react"

type Item = {
  id: string
  name: string
  price: number
  currency: string
}

export default function PaymentPage() {
  const [item, setItem] = useState<Item | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<{ status: string; message?: string }>({
    status: "IDLE",
  })

  // 더미 데이터 넣기
  useEffect(() => {
    const dummy: Item = {
      id: "shoes",
      name: "신발",
      price: 1000,
      currency: "KRW",
    }
    setItem(dummy)
  }, [])

  if (item == null) {
    return (
      <dialog open>
        <article aria-busy>결제 정보를 불러오는 중입니다.</article>
      </dialog>
    )
  }

  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentStatus({ status: "PENDING" })
    const paymentId = randomId()

    // 실제 결제 SDK 호출
    const payment = await PortOne.requestPayment({
      storeId: "store-e4038486-8d83-41a5-acf1-844a009e0d94",
      channelKey: "channel-key-fc5f33bb-c51e-4ac7-a0df-4dc40330046d",
      paymentId,
      orderName: item.name,
      totalAmount: item.price,
      currency: item.currency,
      payMethod: "CARD",
      customer: {
        fullName: "테스트 사용자",
        email: "example@test.com",
        phoneNumber: "01012345678",
      },
      customData: { item: item.id },
    })

    if ((payment as any).code !== undefined) {
      setPaymentStatus({ status: "FAILED", message: (payment as any).message })
      return
    }

    // 서버에 complete API가 없으니 더미 처리
    setPaymentStatus({ status: "PAID" })
  }

  const isWaitingPayment = paymentStatus.status !== "IDLE"

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <article>
            <div className="item">
              <div className="item-image">
                <img src={`/${item.id}.png`} alt={item.name} />
              </div>
              <div className="item-text">
                <h5>{item.name}</h5>
                <p>{item.price.toLocaleString()}원</p>
              </div>
            </div>
            <div className="price">
              <label>총 구입 가격</label> {item.price.toLocaleString()}원
            </div>
          </article>
          <button type="submit" aria-busy={isWaitingPayment} disabled={isWaitingPayment}>
            결제
          </button>
        </form>
      </main>

      {paymentStatus.status === "FAILED" && (
        <dialog open>
          <header>
            <h1>결제 실패</h1>
          </header>
          <p>{paymentStatus.message}</p>
          <button type="button" onClick={() => setPaymentStatus({ status: "IDLE" })}>
            닫기
          </button>
        </dialog>
      )}

      <dialog open={paymentStatus.status === "PAID"}>
        <header>
          <h1>결제 성공</h1>
        </header>
        <p>결제에 성공했습니다.</p>
        <button type="button" onClick={() => setPaymentStatus({ status: "IDLE" })}>
          닫기
        </button>
      </dialog>
    </>
  )
}
