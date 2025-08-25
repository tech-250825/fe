// "use client";

// import { useLocale } from "next-intl";
// import { usePathname, useRouter } from "@/i18n/routing";
// import { routing } from "@/i18n/routing";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Globe, Check } from "lucide-react";

// const localeNames = {
//   ko: "한국어",
//   en: "English",
// };

// export default function LocaleSwitcherDropdown() {
//   const locale = useLocale();
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLocaleChange = (newLocale: string) => {
//     router.push(pathname, { locale: newLocale });
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div className="flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md">
//           <Globe className="h-4 w-4" />
//           {localeNames[locale as keyof typeof localeNames]}
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {routing.locales.map((loc) => (
//           <DropdownMenuItem
//             key={loc}
//             onClick={() => handleLocaleChange(loc)}
//             className="gap-2"
//           >
//             <div className="flex items-center justify-between w-full">
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-muted-foreground">
//                   {loc.toUpperCase()}
//                 </span>
//                 <span>{localeNames[loc as keyof typeof localeNames]}</span>
//               </div>
//               {locale === loc && <Check className="h-4 w-4" />}
//             </div>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

const localeNames = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

interface LocaleSwitcherDropdownProps {
  showButton?: boolean; // 버튼 표시 여부
  onLanguageChange?: () => void; // 언어 변경 시 콜백
}

export default function LocaleSwitcherDropdown({
  showButton = true,
  onLanguageChange,
}: LocaleSwitcherDropdownProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    // 언어 변경 후 콜백 실행
    onLanguageChange?.();
  };

  // 언어 옵션들만 렌더링 (사이드바용) - 한국어 제외
  if (!showButton) {
    return (
      <>
        {routing.locales.filter(loc => loc !== 'ko').map((loc) => (
          <div
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {loc.toUpperCase()}
              </span>
              <span>{localeNames[loc as keyof typeof localeNames]}</span>
            </div>
            {locale === loc && <Check className="h-4 w-4" />}
          </div>
        ))}
      </>
    );
  }

  // 기존 드롭다운 버튼 (헤더용)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {localeNames[locale as keyof typeof localeNames]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.filter(loc => loc !== 'ko').map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="gap-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {loc.toUpperCase()}
                </span>
                <span>{localeNames[loc as keyof typeof localeNames]}</span>
              </div>
              {locale === loc && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
