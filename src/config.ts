export const locales = ["ko", "en"] as const;

export const config = {
  apiUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8090"
      : "https://api.hoit.ai.kr",
};
