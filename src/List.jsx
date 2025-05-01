import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "./ThemeContext";
import "./List.css";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards, addBoard, updateBoard, deleteBoard } from './store/actions/boardActions';
import { useAuth } from "./AuthContext";


export default function List() {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const { isDarkMode, toggle_theme } = useTheme();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  
  const { boards, loading, error } = useSelector(state => ({
    boards: state.boards.boards,
    loading: state.boards.loading,
    error: state.boards.error
  }));

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

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
            {isDarkMode ? "Светлая" : "Тёмная"}
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
            placeholder="Название доски"
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




// import { Link } from "react-router-dom";
// import { useState, useEffect, useCallback, useMemo } from "react";
// import { api } from "./api";
// import { useTheme } from "./ThemeContext";
// import "./List.css";



// export default function List() {
//   const [boards, setBoards] = useState([]);
//   const [newBoardTitle, setNewBoardTitle] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { isDarkMode, toggle_theme } = useTheme();

//   const get_boards = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/boards");
//       setBoards(response.data);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "ошибка загрузки досок!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     get_boards();
//   }, [get_boards]);

//   const add_board = useCallback(async () => {
//     if (!newBoardTitle.trim()) {
//       setError("название не может быть пустым!");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await api.post("/boards", { title: newBoardTitle });
//       setBoards(prev => [...prev, response.data]);
//       setNewBoardTitle("");
//       setError(null);
//     } catch (err) {
//       setError(err.message || "ошибка создания доски!");
//     } finally {
//       setLoading(false);
//     }
//   }, [newBoardTitle]);

//   const update_board = useCallback(async (id, currentTitle) => {
//     const newTitle = prompt("напишите название:", currentTitle);
//     if (!newTitle || newTitle === currentTitle) return;

//     try {
//       setLoading(true);
//       await api.patch(`/boards/${id}`, { title: newTitle });
//       setBoards(prev => prev.map(board => 
//         board.id === id ? { ...board, title: newTitle } : board
//       ));
//       setError(null);
//     } catch (err) {
//       setError(err.message || "ошибка обновления доски!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const delete_board = useCallback(async (id) => {
//     if (!confirm("точно удаляем?")) return;

//     try {
//       setLoading(true);
//       await api.delete(`/boards/${id}`);
//       setBoards(prev => prev.filter(board => board.id !== id));
//       setError(null);
//     } catch (err) {
//       setError(err.message || "ошибка удаления доски! ");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const input_change = useCallback((e) => {
//     setNewBoardTitle(e.target.value);
//     setError(null);
//   }, []);

//   const memo_boards = useMemo(() => (
//     boards.map(board => (
//       <li key={board.id} className="board-item">
//         <Link to={`/board/${board.id}`} className="board-link">
//           {board.title}
//         </Link>
//         <div className="board-actions">
//           <button
//             onClick={() => update_board(board.id, board.title)}
//             className="edit-button"
//             disabled={loading}
//           >
//             Изменить
//           </button>
//           <button
//             onClick={() => delete_board(board.id)}
//             className="delete-button"
//             disabled={loading}
//           >
//             Удалить
//           </button>
//         </div>
//       </li>
//     ))
//   ), [boards, loading, update_board, delete_board]);

//   return (
//     <div className="list-page">
//       <nav className="main-nav">
//         <Link to="/" className="home-link">
//           <svg className="home-icon" viewBox="0 0 24 24">
//             <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
//           </svg>
//           Главная
//         </Link>
//         <button onClick={toggle_theme} className="theme-toggle">
//           {isDarkMode ? " светлая" : " тёмная"}
//         </button>
//       </nav>

//       <div className="list-container">
//         <h2 className="list-header">Мои доски</h2>
        
//         {error && <div className="error-message">{error}</div>}
//         {loading && <div className="loading-indicator">загрузка...</div>}

//         <div className="input-group">
//           <input
//             type="text"
//             value={newBoardTitle}
//             onChange={input_change}
//             placeholder=""
//             className="list-input"
//             disabled={loading}
//           />
//           <button 
//             onClick={add_board}
//             className="list-button"
//             disabled={loading || !newBoardTitle.trim()}
//           >
//             Создать
//           </button>
//         </div>
        
//         <ul className="board-list">
//           {memo_boards}
//         </ul>
//       </div>
//     </div>
//   );
// } 