import { api } from "./api";

export const register = async (email, password) => {
  try {
    // Проверяем, существует ли уже пользователь с таким email
    const usersResponse = await api.get("/users");
    const userExists = usersResponse.data.some(user => user.email === email);
    
    if (userExists) {
      return { success: false, error: "Пользователь с таким email уже существует" };
    }

    const response = await api.post("/users", { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.get("/users");
    const user = response.data.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: "Неверный email или пароль" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};