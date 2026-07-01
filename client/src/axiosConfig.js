import axios from "axios";

// Xác định URL động theo môi trường
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/"
    : process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";

// CHỈ KHỞI TẠO DUY NHẤT 1 LẦN Ở ĐÂY
const instance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Lấy token từ localStorage
    let token =
      window.localStorage.getItem("persist:auth") &&
      JSON.parse(window.localStorage.getItem("persist:auth"))?.token?.slice(
        1,
        -1,
      );

    // Gắn token vào header an toàn (không ghi đè các header mặc định khác)
    config.headers = {
      ...config.headers,
      authorization: token ? `Bearer ${token}` : null,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
