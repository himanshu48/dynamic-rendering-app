export const fetchLogin = async (obj: any) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const json = response.json();
    return json;
  } catch (error) {}
};

export const fetchSignup = async (obj: any) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const json = response.json();
    return json;
  } catch (error) {}
};
