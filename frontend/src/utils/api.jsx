export const callApi = async (path, apiKey = "") => {
  // For browser environment, use the public URL
  const isInBrowser = typeof window !== "undefined";

  // Base URL logic - use different approach for browser vs container
  const baseUrl = isInBrowser
    ? "http://localhost:80" // Browser access
    : import.meta.env.VITE_API_URL; // Container-to-container

  // Make sure path starts with a slash if not already
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // DO NOT add /api prefix - routes are directly exposed
  const url = `${baseUrl}${normalizedPath}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${error.message}`);
    throw error;
  }
};
