import React from "react";
import { getInitialPublicContent } from "@/lib/home";
import HomeClient from "@/components/home/HomeClient";

const HomePage: React.FC = async () => {
  // Fetch initial public content on server
  const { content, nextCursor, hasMore } = await getInitialPublicContent();

  return (
    <HomeClient 
      initialContent={content}
      initialNextCursor={nextCursor}
      initialHasMore={hasMore}
    />
  );
};

export default HomePage;
