// "use client";

// import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
// import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   CreditCard,
//   Download,
//   FileText,
//   Package,
//   RefreshCw,
//   Settings,
//   Zap,
//   Check,
//   Crown,
//   Star,
//   Sparkles,
// } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import { toast } from "sonner";

// const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

// // 크레딧 패키지 정의
// const creditPackages = [
//   {
//     id: "basic",
//     name: "Basic",
//     credits: 100,
//     price: 10000,
//     popular: false,
//     features: ["기본 AI 생성", "표준 해상도", "개인 사용"],
//     icon: <Package className="w-5 h-5" />,
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     credits: 500,
//     price: 45000,
//     popular: true,
//     features: ["고급 AI 생성", "고해상도", "상업적 사용", "우선 지원"],
//     icon: <Crown className="w-5 h-5" />,
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     credits: 1200,
//     price: 100000,
//     popular: false,
//     features: [
//       "프리미엄 AI 생성",
//       "최고 해상도",
//       "무제한 상업적 사용",
//       "24/7 지원",
//       "특별 모델 접근",
//     ],
//     icon: <Sparkles className="w-5 h-5" />,
//   },
// ];

// const invoices = [
//   {
//     id: "INV-001",
//     date: "Mar 1, 2024",
//     amount: "45,000원",
//     credits: "500 크레딧",
//     status: "완료",
//   },
//   {
//     id: "INV-002",
//     date: "Feb 1, 2024",
//     amount: "10,000원",
//     credits: "100 크레딧",
//     status: "완료",
//   },
//   {
//     id: "INV-003",
//     date: "Jan 1, 2024",
//     amount: "100,000원",
//     credits: "1,200 크레딧",
//     status: "완료",
//   },
// ];

// export default function UserBilling() {
//   const { userProfile } = useAuth();
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//   const [widgets, setWidgets] = useState(null);
//   const [ready, setReady] = useState(false);
//   const [orderId, setOrderId] = useState("");
//   const [customerKey, setCustomerKey] = useState("");

//   // 사용자별 고유키 생성
//   useEffect(() => {
//     if (userProfile?.id) {
//       setCustomerKey(`CUSTOMER_${userProfile.id}`);
//     }
//   }, [userProfile]);

//   // 주문번호 생성
//   useEffect(() => {
//     setOrderId(uuidv4());
//   }, [selectedPackage]);

//   // Toss Payments 위젯 초기화
//   useEffect(() => {
//     if (!customerKey) return;

//     async function fetchPaymentWidgets() {
//       try {
//         const tossPayments = await loadTossPayments(clientKey);
//         const paymentWidgets = tossPayments.widgets({
//           customerKey,
//         });
//         setWidgets(paymentWidgets);
//       } catch (error) {
//         console.error("결제 위젯 초기화 오류:", error);
//         toast.error("결제 시스템을 불러올 수 없습니다.");
//       }
//     }

//     fetchPaymentWidgets();
//   }, [customerKey]);

//   // 결제 UI 렌더링
//   useEffect(() => {
//     if (!widgets || !selectedPackage) return;

//     async function renderPaymentWidgets() {
//       try {
//         await widgets.setAmount({
//           currency: "KRW",
//           value: selectedPackage.price,
//         });

//         await Promise.all([
//           widgets.renderPaymentMethods({
//             selector: "#payment-method",
//             variantKey: "DEFAULT",
//           }),
//           widgets.renderAgreement({
//             selector: "#agreement",
//             variantKey: "AGREEMENT",
//           }),
//         ]);

//         setReady(true);
//       } catch (error) {
//         console.error("결제 UI 렌더링 오류:", error);
//         toast.error("결제 화면을 불러올 수 없습니다.");
//       }
//     }

//     renderPaymentWidgets();
//   }, [widgets, selectedPackage]);

//   const handlePackageSelect = (pkg) => {
//     setSelectedPackage(pkg);
//     setShowPaymentDialog(true);
//     setReady(false);
//   };

//   const handlePayment = async () => {
//     if (!widgets || !ready || !selectedPackage) return;

//     try {
//       await widgets.requestPayment({
//         orderId: orderId,
//         orderName: `${selectedPackage.name} 크레딧 패키지`,
//         successUrl: `${window.location.origin}/payment/success`,
//         failUrl: `${window.location.origin}/payment/fail`,
//         customerEmail: userProfile?.email || "customer@example.com",
//         customerName: userProfile?.nickname || "사용자",
//       });
//     } catch (error) {
//       console.error("결제 요청 오류:", error);
//       toast.error("결제 요청 중 오류가 발생했습니다.");
//     }
//   };

//   const currentCredits = userProfile?.credit || 0;
//   const usedCredits = Math.max(0, 1000 - currentCredits);
//   const usagePercentage = (usedCredits / 1000) * 100;

//   return (
//     <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
//       <div className="mx-auto max-w-4xl">
//         {/* Header */}
//         <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
//           <div>
//             <h1 className="text-2xl font-semibold">크레딧 & 결제</h1>
//             <p className="text-muted-foreground text-sm">
//               크레딧을 구매하고 결제 내역을 관리하세요
//             </p>
//           </div>
//           <Button variant="outline">
//             <Settings className="mr-2 size-4" />
//             결제 설정
//           </Button>
//         </div>

//         {/* 현재 크레딧 상태 */}
//         <Card className="mb-8 p-0">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Zap className="text-primary size-5" />
//                   <h2 className="text-lg font-semibold">현재 크레딧</h2>
//                   <Badge>보유 중</Badge>
//                 </div>
//                 <p className="text-muted-foreground mt-1 text-sm">
//                   {currentCredits.toLocaleString()} 크레딧 보유 중
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-primary">
//                   {currentCredits.toLocaleString()}
//                 </div>
//                 <p className="text-muted-foreground text-sm">사용 가능</p>
//               </div>
//             </div>

//             <div className="mt-6 space-y-4">
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <RefreshCw className="text-primary size-4" />
//                     <span className="text-sm font-medium">월간 사용량</span>
//                   </div>
//                   <span className="text-sm">
//                     {usedCredits.toLocaleString()} / 1,000
//                   </span>
//                 </div>
//                 <Progress value={usagePercentage} className="h-2" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* 크레딧 패키지 */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4">크레딧 패키지</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {creditPackages.map((pkg) => (
//               <Card
//                 key={pkg.id}
//                 className={`relative p-0 ${pkg.popular ? "border-primary" : ""}`}
//               >
//                 {pkg.popular && (
//                   <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
//                     <Badge className="bg-primary text-primary-foreground">
//                       <Star className="w-3 h-3 mr-1" />
//                       인기
//                     </Badge>
//                   </div>
//                 )}
//                 <CardContent className="p-6">
//                   <div className="text-center">
//                     <div className="flex items-center justify-center mb-3">
//                       {pkg.icon}
//                     </div>
//                     <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
//                     <div className="mb-2">
//                       <span className="text-2xl font-bold">
//                         {pkg.credits.toLocaleString()}
//                       </span>
//                       <span className="text-muted-foreground ml-1">크레딧</span>
//                     </div>
//                     <div className="text-primary font-semibold mb-4">
//                       {pkg.price.toLocaleString()}원
//                     </div>
//                     <ul className="space-y-2 mb-6 text-sm">
//                       {pkg.features.map((feature, index) => (
//                         <li key={index} className="flex items-center gap-2">
//                           <Check className="w-4 h-4 text-green-500" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                     <Button
//                       onClick={() => handlePackageSelect(pkg)}
//                       className="w-full"
//                       variant={pkg.popular ? "default" : "outline"}
//                     >
//                       구매하기
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* 결제 내역 */}
//         <Card className="p-0">
//           <CardContent className="p-6">
//             <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
//               <h2 className="text-lg font-semibold">결제 내역</h2>
//               <Button variant="outline" size="sm">
//                 <Download className="mr-2 size-4" />
//                 전체 다운로드
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {invoices.map((invoice) => (
//                 <div
//                   key={invoice.id}
//                   className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="bg-muted rounded-md p-2">
//                       <FileText className="text-muted-foreground size-4" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{invoice.id}</p>
//                       <p className="text-muted-foreground text-sm">
//                         {invoice.date} • {invoice.credits}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <Badge variant="outline">{invoice.status}</Badge>
//                     <span className="font-medium">{invoice.amount}</span>
//                     <Button variant="ghost" size="sm">
//                       <Download className="size-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* 결제 다이얼로그 */}
//         <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>크레딧 구매</DialogTitle>
//               <DialogDescription>
//                 {selectedPackage?.name} 패키지를 구매하시겠습니까?
//               </DialogDescription>
//             </DialogHeader>

//             {selectedPackage && (
//               <div className="space-y-6">
//                 {/* 패키지 정보 */}
//                 <Card className="p-0">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         {selectedPackage.icon}
//                         <span className="font-semibold">
//                           {selectedPackage.name}
//                         </span>
//                       </div>
//                       <Badge>
//                         {selectedPackage.credits.toLocaleString()} 크레딧
//                       </Badge>
//                     </div>
//                     <Separator className="my-4" />
//                     <div className="flex items-center justify-between">
//                       <span>결제 금액</span>
//                       <span className="text-lg font-bold text-primary">
//                         {selectedPackage.price.toLocaleString()}원
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* 결제 UI */}
//                 <div id="payment-method" className="min-h-[200px]" />
//                 <div id="agreement" />

//                 {/* 결제 버튼 */}
//                 <Button
//                   onClick={handlePayment}
//                   disabled={!ready}
//                   className="w-full"
//                   size="lg"
//                 >
//                   {ready
//                     ? `${selectedPackage.price.toLocaleString()}원 결제하기`
//                     : "결제 준비중..."}
//                 </Button>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }
