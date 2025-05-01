import { Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import List from "./List";
import Board from "./Board";
import Task from "./Task";
import { ThemeProvider } from "./ThemeContext";
import store from './store';
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <List />
              </ProtectedRoute>
            } />
            <Route path="/board/:id" element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            } />
            <Route path="/board/task/:id" element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            } />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}