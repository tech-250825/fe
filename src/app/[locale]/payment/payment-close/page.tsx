"use client";

import { useEffect } from "react";

export default function PaymentClose() {
  useEffect(() => {
    // 브라우저 정책: 반드시 window.open()으로 연 창에서만 닫힘
    window.close();
  }, []);

  return (
    <div>
      <p>결제가 완료되었습니다. 창을 닫고 원래 화면으로 돌아가세요.</p>
      <button onClick={() => window.close()}>창 닫기</button>
    </div>
  );
}
