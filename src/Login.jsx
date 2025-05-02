import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [registration_success, setRegistrationSuccess] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    if (result.success) {
      if (isLogin) {
        navigate("/");
      } else {
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
    <LoginContainer>
      <LoginForm onSubmit={submit}>
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {registration_success && isLogin && (
          <SuccessMessage>
           ты прошел регистрацию!
          </SuccessMessage>
        )}
        
        <FormGroup>
          <label>Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label>Пароль:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </FormGroup>
        
        <LoginButton type="submit">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </LoginButton>
        
        <ToggleButton 
          type="button" 
          onClick={() => {
            setIsLogin(!isLogin);
            setRegistrationSuccess(false);
            setError("");
          }}
        >
          {isLogin ? "нету аккаунта? регистрация!" : "уже есть аккаунт? войди!"}
        </ToggleButton>
      </LoginForm>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 600px;
  background-color: ${({ theme }) => theme.bgSecondary};
  transition: all 0.3s ease;
  padding: 2rem;
`;

const LoginForm = styled.form`
  background: ${({ theme }) => theme.bgPrimary};
  padding: 2.5rem;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.borderColor};

  h2 {
    margin-bottom: 1.75rem;
    text-align: center;
    color: ${({ theme }) => theme.textPrimary};
    font-size: 1.75rem;
    font-weight: 700;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;

  label {
    display: block;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 600;
    font-size: 0.9375rem;
  }
`;

const Input = styled.input`
  width: 85%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgPrimary};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryColor};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3a56d4; 
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const ToggleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primaryColor};
  cursor: pointer;
  font-size: 0.9375rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
  text-align: center;
  display: block;

  &:hover {
    color: ${({ theme }) => theme.primaryHover};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.errorColor};
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: rgba(16, 185, 129, 0.1);
  color: ${({ theme }) => theme.successColor};
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;