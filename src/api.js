import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.response.use(   // (interceptor) это типо перехватчик
  (response) => response,
  (error) => {
    const error_message = error.response?.data?.message || error.message;  // либо то что я настроила или просто база
    return Promise.reject(error_message);
  }
);

// pending — ожидание
// fulfilled — успешно выполнено
// rejected — выполнено с ошибкой