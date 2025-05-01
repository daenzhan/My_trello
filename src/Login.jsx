import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    if (result.success) {
      if (isLogin) {
        navigate("/");
      } else {
        // После успешной регистрации показываем сообщение и переключаем на форму входа
        setRegistrationSuccess(true);
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {registrationSuccess && isLogin && (
          <div className="success-message">
            Регистрация прошла успешно! Пожалуйста, войдите.
          </div>
        )}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        
        <button type="submit" className="login-button">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
        
        <button 
          type="button" 
          className="toggle-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setRegistrationSuccess(false);
            setError("");
          }}
        >
          {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
        </button>
      </form>
    </div>
  );
}