"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">서비스 이용약관</h1>
          <p className="text-gray-300">최종 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 호잇 스튜디오(이하 "회사")가 제공하는 AI 영상 및 이미지 생성 서비스(이하 "서비스")의 
              이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제2조 (정의)</h2>
            <p className="text-gray-700 leading-relaxed">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li><strong>"서비스"</strong>란 회사가 제공하는 AI 영상 및 이미지 생성 플랫폼을 의미합니다.</li>
              <li><strong>"이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
              <li><strong>"회원"</strong>이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 의미합니다.</li>
              <li><strong>"콘텐츠"</strong>란 서비스를 통해 생성되는 영상, 이미지 등의 디지털 자료를 의미합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다. 
              회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 
              공지한 날로부터 효력을 발생합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제4조 (회원가입)</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
              <li>회원가입신청자는 반드시 실명으로 본인의 정보를 제공하여야 합니다.</li>
              <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제5조 (서비스의 제공 및 변경)</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>회사는 회원에게 아래와 같은 서비스를 제공합니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>AI 기반 영상 생성 서비스</li>
                  <li>AI 기반 이미지 생성 서비스</li>
                  <li>생성된 콘텐츠의 저장 및 관리 서비스</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </li>
              <li>회사는 서비스의 내용을 변경할 수 있으며, 변경사항은 사전에 공지합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제6조 (서비스 이용시간)</h2>
            <p className="text-gray-700 leading-relaxed">
              서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다. 
              단, 회사는 시스템 정기점검, 증설 및 교체를 위해 당해 서비스를 일시적으로 중단할 수 있으며, 
              예정되어 있는 작업으로 인한 서비스 일시중단은 서비스를 통해 사전에 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제7조 (이용자의 의무)</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>이용자는 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>신청 또는 변경시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제8조 (저작권의 귀속 및 이용제한)</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
              <li>이용자가 서비스를 통해 생성한 콘텐츠에 대한 저작권은 이용자에게 귀속됩니다.</li>
              <li>이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제9조 (계약해지 및 이용제한)</h2>
            <p className="text-gray-700 leading-relaxed">
              이용자가 이용계약을 해지하고자 하는 때에는 이용자 본인이 서비스를 통하여 회사에 해지신청을 하여야 합니다. 
              회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 
              경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제10조 (손해배상 등)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 
              동 손해가 회사의 고의 또는 중대한 과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지 아니합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제11조 (회사 정보)</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>상호:</strong> 호잇 스튜디오</p>
              <p className="text-gray-700 mb-2"><strong>대표자:</strong> 김민재</p>
              <p className="text-gray-700 mb-2"><strong>사업자등록번호:</strong> 109-43-51540</p>
              <p className="text-gray-700 mb-2"><strong>주소:</strong> 서울시 성북구 동소문로 63 드림트리 빌딩</p>
              <p className="text-gray-700"><strong>이메일:</strong> han1000llm@gmail.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">부칙</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 {new Date().toLocaleDateString('ko-KR')}부터 적용됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}