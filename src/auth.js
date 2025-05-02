import { api } from "./api";

export const register = async (email, password) => {
  try {
    const get_users = await api.get("/users");
    const user_exist = get_users.data.some(user => user.email === email);
    
    if (user_exist) {
      return { success: false, error: "пользователей с таким email уже есть!" };
    }

    const create = await api.post("/users", { email, password });
    return { success: true, data: create.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const get_users = await api.get("/users");
    const user = get_users.data.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: "неверный email или пароль!" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};