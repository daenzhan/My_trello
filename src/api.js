// api.js - пример улучшенного API с проверкой авторизации
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["Authorization"] = `Bearer ${userId}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { api };

// import axios from "axios";

// const API_BASE_URL = "http://localhost:3001"; 

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 5000,
//   headers: { "Content-Type": "application/json" },
// });


// api.interceptors.response.use(   // (interceptor) это типо перехватчик
//   (response) => response,
//   (error) => {
//     const error_message = error.response?.data?.message || error.message;  // либо то что я настроила или просто база
//     return Promise.reject(error_message);
//   }
// );

// // pending — ожидание
// // fulfilled — успешно выполнено
// // rejected — выполнено с ошибкой