import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getInitialMediaItems } from "@/lib/library";
import { LibraryClient } from "@/components/library/LibraryClient";
import { LibraryAuthCheck } from "@/components/library/LibraryAuthCheck";

export default async function LibraryPage() {
  const t = await getTranslations("Library");
  
  // Get cookies for authentication
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  // Try to get initial media items (will return null if not authenticated)
  const mediaData = await getInitialMediaItems(cookieHeader, 24);

  return (
    <LibraryAuthCheck>
      <div className="min-h-screen bg-background">
        {mediaData ? (
          <LibraryClient
            initialItems={mediaData.items}
            initialNextCursor={mediaData.nextCursor}
            initialHasMore={mediaData.hasMore}
          />
        ) : (
          <div className="min-h-screen bg-background">
            <div className="bg-card border-b border-border sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {t("title")}
                    </h1>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-1 py-1">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  {t("empty.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("empty.subtitle")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </LibraryAuthCheck>
  );
}