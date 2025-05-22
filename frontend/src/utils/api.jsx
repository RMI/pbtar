export const callApi = async (path, apiKey = "") => {
  // For browser environment, use the public URL
  const isInBrowser = typeof window !== "undefined";

  // Get API port from environment variables, with fallback to 8000
  const apiPort = import.meta.env.PBTAR_API_PORT || "8000";

  // Base URL logic - use different approach for browser vs container
  const baseUrl = isInBrowser
    ? `http://localhost:${apiPort}` // Browser access
    : import.meta.env.PBTAR_API_URL; // Container-to-container

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
