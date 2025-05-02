import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "./ThemeContext";
import "./List.css";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards, addBoard, updateBoard, deleteBoard } from './store/actions/boardActions';
import { useAuth } from "./AuthContext.jsx";



export default function List() {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const { isDarkMode, toggle_theme } = useTheme();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();


  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
    }
  }, [dispatch, user]);

  const handleAddBoard = useCallback(async () => {
    if (!newBoardTitle.trim()) {
      dispatch({ type: 'SET_ERROR', payload: "Название не может быть пустым!" });
      return;
    }
    const result = await dispatch(addBoard(newBoardTitle));
    if (result.success) {
      setNewBoardTitle("");
    }
  }, [newBoardTitle, dispatch]);
  
  const { boards, loading, error } = useSelector(state => ({
    boards: state.boards.boards,
    loading: state.boards.loading,
    error: state.boards.error
  }));

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleUpdateBoard = useCallback(async (id, currentTitle) => {
    const newTitle = prompt("Введите название:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    await dispatch(updateBoard(id, newTitle));
  }, [dispatch]);

  const handleDeleteBoard = useCallback(async (id) => {
    if (!confirm("Удалить доску?")) return;
    await dispatch(deleteBoard(id));
  }, [dispatch]);

  const input_change = useCallback((e) => {
    setNewBoardTitle(e.target.value);
  }, []);

  const memo_boards = useMemo(() => (
    boards.map(board => (
      <li key={board.id} className="board-item">
        <Link to={`/board/${board.id}`} className="board-link">
          {board.title}
        </Link>
        <div className="board-actions">
          <button
            onClick={() => handleUpdateBoard(board.id, board.title)}
            className="edit-button"
            disabled={loading}
          >
            Изменить
          </button>
          <button
            onClick={() => handleDeleteBoard(board.id)}
            className="delete-button"
            disabled={loading}
          >
            Удалить
          </button>
        </div>
      </li>
    ))
  ), [boards, loading, handleUpdateBoard, handleDeleteBoard]);

  return (
    <div className="list-page">
      <nav className="main-nav">
        <Link to="/" className="home-link">
          <svg className="home-icon" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Главная
        </Link>
        <div className="nav-actions">
          <button onClick={toggle_theme} className="theme-toggle">
            {isDarkMode ? "" : ""}
          </button>
          {user && (
            <button onClick={logout} className="logout-button">
              Выйти ({user.email})
            </button>
          )}
        </div>
      </nav>

      <div className="list-container">
        <h2 className="list-header">Мои доски</h2>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-indicator">Загрузка...</div>}

        <div className="input-group">
          <input
            type="text"
            value={newBoardTitle}
            onChange={input_change}
            placeholder=""
            className="list-input"
            disabled={loading}
          />
          <button 
            onClick={handleAddBoard}
            className="list-button"
            disabled={loading || !newBoardTitle.trim()}
          >
            Создать
          </button>
        </div>
        
        <ul className="board-list">
          {memo_boards}
        </ul>
      </div>
    </div>
  );
}