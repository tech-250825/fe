import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getInitialMediaItems } from "@/lib/library";
import { LibraryClient } from "@/components/library/LibraryClient";
import { getProfile } from "@/lib/profile";

export default async function LibraryPage() {
  const t = await getTranslations("Library");
  
  // Server-side authentication check like profile page
  const profile = await getProfile();
  
  // If not authenticated, show login required message
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">{t("loginRequired")}</p>
          <p className="text-sm text-muted-foreground">
            Please log in to view your library.
          </p>
        </div>
      </div>
    );
  }

  // Get cookies for media items fetch
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  // Get initial media items
  const mediaData = await getInitialMediaItems(cookieHeader, 24);

  return (
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
  );
}