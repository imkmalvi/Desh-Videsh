export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Force sync (temporary fix, since no global state)
  window.location.href = "/login";
};