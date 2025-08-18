"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">개인정보 처리방침</h1>
          <p className="text-gray-300">최종 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-700 leading-relaxed">
              호잇 스튜디오(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>서비스 제공 및 계약의 이행</li>
              <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
              <li>AI 영상 및 이미지 생성 서비스 제공</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>고객지원 및 문의사항 처리</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>회원정보: 회원 탈퇴 시까지</li>
              <li>생성된 콘텐츠: 계정 삭제 후 30일</li>
              <li>서비스 이용 기록: 3년</li>
              <li>결제 정보: 5년</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. 처리하는 개인정보의 항목</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>필수항목: 이메일 주소, 비밀번호</li>
              <li>선택항목: 닉네임, 프로필 이미지</li>
              <li>자동 수집 항목: IP주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 정보주체의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며, 
              정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 
              개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. 개인정보 처리의 위탁</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>AWS (Amazon Web Services): 클라우드 서버 및 데이터 저장</li>
              <li>결제대행사: 결제 처리 및 관련 업무</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-gray-700 leading-relaxed">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. 개인정보보호책임자</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>성명:</strong> 김민재</p>
              <p className="text-gray-700 mb-2"><strong>직책:</strong> 대표</p>
              <p className="text-gray-700 mb-2"><strong>연락처:</strong> han1000llm@gmail.com</p>
              <p className="text-gray-700"><strong>주소:</strong> 서울시 성북구 동소문로 63 드림트리 빌딩</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. 개인정보 처리방침의 변경</h2>
            <p className="text-gray-700 leading-relaxed">
              이 개인정보 처리방침은 {new Date().toLocaleDateString('ko-KR')}부터 적용됩니다. 
              법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}