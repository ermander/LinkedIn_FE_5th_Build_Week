import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:3002/user",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

// Refresh token flow

authAxios.interceptors.response.use(
  (response) => response,
  function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === "/refreshToken"
    ) {
      console.log("Redirect to login!");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      return authAxios
        .post("/refreshToken", {
          refreshToken,
        })
        .then((response) => {
          if (response.status === 200) {
            // Setting my new token inside my local storage
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            // Retry again the original request with the brand new access token in Authorization header

            return axios(originalRequest, {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            });
          }
        });
    }
    return Promise.reject(error);
  }
);

export default authAxios;
