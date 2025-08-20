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
          <p className="text-gray-300">최종 업데이트: 2025.08.18.</p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제1조(목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              호잇스튜디오(이하 '회사'라고 함)가 제공하는 AI 영상 및 이미지 생성 서비스(이하 '서비스'라고 함)의 이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제2조(정의)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <div className="text-gray-700 ml-4 space-y-2">
              <p>1. "서비스"란 회사가 제공하는 AI 영상 및 이미지 생성 플랫폼을 의미합니다.</p>
              <p>2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</p>
              <p>3. "회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 의미합니다.</p>
              <p>4. "콘텐츠"란 서비스를 통해 생성되는 영상, 이미지 등의 디지털 자료를 의미합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제3조(약관의 효력 및 변경)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</p>
              <p>2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지한 날로부터 효력을 발생합니다.</p>
              <p>3. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제4조(회원가입)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</p>
              <p>2. 회원가입신청자는 반드시 실명으로 본인의 정보를 제공하여야 합니다.</p>
              <p>3. 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.</p>
              <div className="ml-4 space-y-1">
                <p>가. 가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</p>
                <p>나. 실명이 아니거나 타인의 명의를 이용한 경우</p>
                <p>다. 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제5조(서비스의 제공 및 변경)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회사는 회원에게 아래와 같은 서비스를 제공합니다.</p>
              <div className="ml-4 space-y-1">
                <p>가. AI 기반 영상 생성 서비스</p>
                <p>나. AI 기반 이미지 생성 서비스</p>
                <p>다. 생성된 콘텐츠의 저장 및 관리 서비스</p>
                <p>라. 기타 회사가 정하는 서비스</p>
              </div>
              <p>2. 회사는 운영정책상의 이유로 서비스의 내용을 변경할 수 있으며, 변경사항은 사전에 공지합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제6조(서비스 이용시간)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.</p>
              <p>2. 회사는 시스템 정기점검, 증설 및 교체를 위해 당해 서비스를 일시적으로 중단할 수 있으며, 예정되어 있는 작업으로 인한 서비스 일시중단은 서비스를 통해 사전에 공지합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제7조(이용자의 의무)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 이용자는 다음 행위를 하여서는 안 됩니다.</p>
              <div className="ml-4 space-y-1">
                <p>가. 신청 또는 변경시 허위 내용의 등록</p>
                <p>나. 타인의 정보 도용</p>
                <p>다. 회사가 게시한 정보의 변경</p>
                <p>라. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</p>
                <p>마. 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                <p>바. 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                <p>사. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제8조(금지행위 및 제재조치)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 이용자는 다음 각 호의 행위를 하여서는 안 되며, 이를 위반할 경우 회사는 즉시 계정을 정지시킬 수 있습니다.</p>
              <div className="ml-4 space-y-1">
                <p>가. 딥페이크(deepfake) 기술을 이용하여 타인의 초상권을 침해하거나 허위정보를 생성하는 행위</p>
                <p>나. 아동·청소년의 성보호에 관한 법률(아청법)에 위배되는 콘텐츠를 제작, 유포, 소지하는 행위</p>
                <p>다. 타인의 명예를 훼손하거나 인격권을 침해하는 콘텐츠를 제작하는 행위</p>
                <p>라. 범죄에 활용될 수 있는 콘텐츠를 제작하거나 범죄 목적으로 서비스를 이용하는 행위</p>
                <p>마. 저작권법을 위반하는 콘텐츠를 제작하거나 타인의 지적재산권을 침해하는 행위</p>
              </div>
              <p>2. 회사는 전항의 위반행위를 발견한 경우 사전 통지 없이 해당 계정을 영구 정지시킬 수 있으며, 관련 법령에 따라 수사기관에 신고할 수 있습니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제9조(콘텐츠에 대한 책임)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 서비스를 통해 생성된 모든 콘텐츠에 대한 책임은 이용자 본인에게 있습니다.</p>
              <p>2. 이용자가 생성한 콘텐츠로 인하여 발생하는 모든 법적 분쟁, 손해배상, 저작권 침해, 명예훼손, 범죄 활용 등의 문제는 해당 이용자가 전적으로 책임져야 하며, 회사는 이에 대해 일체의 책임을 지지 않습니다.</p>
              <p>3. 이용자가 제작한 콘텐츠가 관련 법령(아청법, 저작권법, 형법 등)에 위배되는 경우, 모든 법적 책임은 해당 이용자에게 있으며 회사는 어떠한 책임도 부담하지 않습니다.</p>
              <p>4. 회사는 이용자가 생성한 콘텐츠의 적법성, 도덕성, 안전성을 보장하지 않으며, 해당 콘텐츠의 내용을 사전에 검토하거나 승인할 의무가 없습니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제10조(저작권의 귀속 및 이용제한)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</p>
              <p>2. 이용자가 서비스를 통해 생성한 콘텐츠에 대한 저작권은 이용자에게 귀속됩니다.</p>
              <p>3. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제11조(서비스 이용제한)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
              <p>2. 회사는 제8조에서 정한 금지행위를 한 이용자에 대하여는 사전 통지 없이 즉시 서비스 이용을 영구 정지시킬 수 있습니다.</p>
              <p>3. 본 조에 따른 서비스 이용제한에 대해 이용자는 이의를 제기할 수 있으나, 명백한 금지행위가 확인된 경우 회사의 결정은 번복되지 않습니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제12조(계약해지)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 이용자가 이용계약을 해지하고자 하는 때에는 이용자 본인이 서비스를 통하여 회사에 해지신청을 하여야 합니다.</p>
              <p>2. 회사는 이용자가 본 약관을 위반한 경우 즉시 이용계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제13조(손해배상 및 면책조항)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가 회사의 고의 또는 중대한 과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지 아니합니다.</p>
              <p>2. 회사는 이용자가 생성한 콘텐츠로 인하여 발생하는 모든 법적 분쟁, 손해, 피해에 대해 일체의 책임을 지지 않습니다.</p>
              <p>3. 이용자가 본 서비스를 이용하여 제3자에게 손해를 끼친 경우, 이용자는 자신의 책임과 비용으로 회사를 면책시켜야 합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제14조(분쟁해결)</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>1. 회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</p>
              <p>2. 제1항의 노력에도 불구하고 분쟁이 해결되지 아니하는 경우, 관할법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">제15조(회사 정보)</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>상호:</strong> 호잇스튜디오</p>
              <p className="text-gray-700 mb-2"><strong>대표자:</strong> 김민재</p>
              <p className="text-gray-700 mb-2"><strong>사업자등록번호:</strong> 109-43-51540</p>
              <p className="text-gray-700 mb-2"><strong>주소:</strong> 서울시 성북구 동소문로 63 드림트리 빌딩</p>
              <p className="text-gray-700 mb-2"><strong>이메일:</strong> han1000llm@gmail.com</p>
              <p className="text-gray-700"><strong>전화번호:</strong> 029243358</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">부칙</h2>
            <p className="text-gray-700 leading-relaxed">
              제1조 본 약관은 2025.08.18.부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}