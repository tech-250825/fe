// import { notFound } from "next/navigation";
// import { getRequestConfig } from "next-intl/server";
// import { locales } from "./config";

// // Can be imported from a shared config
// // export const locales = ['en', 'ko'];  => 업데이트: routing으로 변경

// export default getRequestConfig(async ({ locale }) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!locales.includes(locale as any)) notFound();

//   return {
//     messages: (await import(`./messages/${locale}.json`)).default,
//   };d
// });
