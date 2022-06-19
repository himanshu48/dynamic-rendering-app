export const fetchAssets = async () => {
  try {
    const response = await fetch("/api/assets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = response.json();
    return json;
  } catch (error) {}
};
