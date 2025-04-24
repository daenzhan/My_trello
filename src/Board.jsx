import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeContext";
import "./board.css";
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchColumns, 
  addColumn, 
  updateColumn, 
  deleteColumn 
} from './store/actions/columnActions';
import { 
  addTask, 
  updateTask, 
  deleteTask,
  moveTask
} from './store/actions/taskActions';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Card = ({ task, onEdit, onDelete, disabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: task.id, columnId: task.columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className="card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span onClick={() => onEdit(task.columnId, task.id, task.title)}>
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.columnId, task.id)}
        disabled={disabled}
        className="delete-btn"
      >
        ×
      </button>
    </div>
  );
};

const Column = ({ 
  column, 
  tasks, 
  onColumnEdit, 
  onColumnDelete, 
  onTaskAdd, 
  onTaskEdit, 
  onTaskDelete,
  onTaskMove,
  disabled
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item) => {
        onTaskMove(item.id, item.columnId, column.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`column ${isOver ? 'is-over' : ''}`}>
      <div className="column-header">
        <h3 onClick={() => onColumnEdit(column.id, column.title)}>
          {column.title}
        </h3>
        <button 
          onClick={() => onColumnDelete(column.id)}
          disabled={disabled}
          className="delete-column-btn"
        >
          ×
        </button>
      </div>
      
      {tasks.map(task => (
        <Card 
          key={task.id} 
          task={task} 
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          disabled={disabled}
        />
      ))}
      
      <button
        onClick={() => onTaskAdd(column.id)}
        disabled={disabled}
        className="add-btn"
      >
        + Добавить карточку
      </button>
    </div>
  );
};

export default function Board() {
  const { id: boardId } = useParams();
  const [error, setError] = useState(null);
  const { isDarkMode, toggle_theme } = useTheme();
  const dispatch = useDispatch();
  
  const columns = useSelector(state => 
    state.columns.columnsByBoard[boardId] || []
  );
  const loading = useSelector(state => state.columns.loading);
  const tasks = useSelector(state => state.tasks.tasksByColumn);

  useEffect(() => {
    dispatch(fetchColumns(boardId));
  }, [boardId, dispatch]);

  const handleAddColumn = useCallback(async () => {
    const title = prompt("Введите название:");
    if (!title) return;
    const result = await dispatch(addColumn(boardId, title));
    if (!result.success) {
      setError(result.error);
    }
  }, [boardId, dispatch]);

  const handleUpdateColumn = useCallback(async (columnId, currentTitle) => {
    const newTitle = prompt("Введите название:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    const result = await dispatch(updateColumn(columnId, newTitle));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleDeleteColumn = useCallback(async (columnId) => {
    if (!confirm("Удалить колонку?")) return;
    const result = await dispatch(deleteColumn(columnId));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleAddTask = useCallback(async (columnId) => {
    const title = prompt("Введите название:");
    if (!title) return;
    const result = await dispatch(addTask(columnId, title));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleUpdateTask = useCallback(async (columnId, taskId, currentTitle) => {
    const newTitle = prompt("Введите название:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    const result = await dispatch(updateTask(taskId, newTitle));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleDeleteTask = useCallback(async (columnId, taskId) => {
    if (!confirm("Удалить задачу?")) return;
    const result = await dispatch(deleteTask(taskId));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleMoveTask = useCallback(async (taskId, fromColumnId, toColumnId) => {
    const result = await dispatch(moveTask(taskId, fromColumnId, toColumnId));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-page">
        <nav className="main-nav">
          <Link to="/" className="home-link">
            <svg className="home-icon" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Главная
          </Link>
          <button onClick={toggle_theme} className="theme-toggle">
            {isDarkMode ? "Светлая" : "Тёмная"}
          </button>
        </nav>

        <div className="board-container">
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-indicator">Загрузка...</div>}

          <button
            onClick={handleAddColumn}
            disabled={loading}
            className="add-column-btn"
          >
            + Добавить колонку
          </button>

          <div className="board">
            {columns.map(column => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks[column.id] || []}
                onColumnEdit={handleUpdateColumn}
                onColumnDelete={handleDeleteColumn}
                onTaskAdd={handleAddTask}
                onTaskEdit={handleUpdateTask}
                onTaskDelete={handleDeleteTask}
                onTaskMove={handleMoveTask}
                disabled={loading}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}


// import { useParams, Link } from "react-router-dom";
// import { useState, useEffect, useCallback, useMemo } from "react";
// import { api } from "./api";
// import { useTheme } from "./ThemeContext";
// import "./board.css";


// export default function Board() {
//   const { id } = useParams();
//   const [columns, set_columns] = useState([]);
//   const [error, set_error] = useState(null);
//   const [loading, set_loading] = useState(false);
//   const { isDarkMode, toggle_theme } = useTheme();

//   const get_columns = useCallback(async () => {
//     set_loading(true);
//     try {
//       const response = await api.get(`/columns?boardId=${id}&_embed=tasks`);
//       set_columns(response.data);
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка загрузки колонок!");
//     } finally {
//       set_loading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     get_columns();
//   }, [get_columns]);

//   const add_column = useCallback(async () => {
//     const title = prompt("напиши название:");
//     if (!title) return;

//     try {
//       set_loading(true);
//       const response = await api.post("/columns", { boardId: id, title });
//       set_columns(prev => [...prev, { ...response.data, tasks: [] }]);
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка создания колонки!");
//     } finally {
//       set_loading(false);
//     }
//   }, [id]);

//   const update_column = useCallback(async (columnId, currentTitle) => {
//     const newTitle = prompt("напиши название:", currentTitle);
//     if (!newTitle || newTitle === currentTitle) return;

//     try {
//       set_loading(true);
//       await api.patch(`/columns/${columnId}`, { title: newTitle });
//       set_columns(prev => prev.map(col => 
//         col.id === columnId ? { ...col, title: newTitle } : col
//       ));
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка обновления колонки!");
//     } finally {
//       set_loading(false);
//     }
//   }, []);

//   const delete_column = useCallback(async (columnId) => {
//     if (!confirm("удалим колонку?")) return;

//     try {
//       set_loading(true);
//       await api.delete(`/columns/${columnId}`);
//       set_columns(prev => prev.filter(col => col.id !== columnId));
//       set_error(null);
//     } catch (err) {
//       setError(err.message || "ошибка удаления колонки!");
//     } finally {
//       set_loading(false);
//     }
//   }, []);


//   const add_task = useCallback(async (columnId) => {
//     const title = prompt("напиши название:");
//     if (!title) return;

//     try {
//       set_loading(true);
//       const response = await api.post("/tasks", { columnId, title });
//       set_columns(prev => prev.map(col => 
//         col.id === columnId 
//           ? { ...col, tasks: [...(col.tasks || []), response.data] } 
//           : col
//       ));
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка создания задачи!");
//     } finally {
//       set_loading(false);
//     }
//   }, []);

//   const update_task = useCallback(async (columnId, taskId, currentTitle) => {
//     const newTitle = prompt("напиши название", currentTitle);
//     if (!newTitle || newTitle === currentTitle) return;

//     try {
//       set_loading(true);
//       await api.patch(`/tasks/${taskId}`, { title: newTitle });
//       set_columns(prev => prev.map(col => 
//         col.id === columnId ? {
//           ...col,
//           tasks: col.tasks?.map(task => 
//             task.id === taskId ? { ...task, title: newTitle } : task
//           )
//         } : col
//       ));
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка обновления задачи!");
//     } finally {
//       set_loading(false);
//     }
//   }, []);

//   const delete_task = useCallback(async (columnId, taskId) => {
//     if (!confirm("точно удалим задачу?")) return;

//     try {
//       set_loading(true);
//       await api.delete(`/tasks/${taskId}`);
//       set_columns(prev => prev.map(col => 
//         col.id === columnId 
//           ? { ...col, tasks: col.tasks?.filter(t => t.id !== taskId) } 
//           : col
//       ));
//       set_error(null);
//     } catch (err) {
//       set_error(err.message || "ошибка удаления задачи!");
//     } finally {
//       set_loading(false);
//     }
//   }, []);

//   const memo_columns = useMemo(() => (
//     columns.map(column => (
//       <div key={column.id} className="column">
//         <div className="column-header">
//           <h3 onClick={() => update_column(column.id, column.title)}>
//             {column.title}
//           </h3>
//           <button 
//             onClick={() => delete_column(column.id)}
//             disabled={loading}
//             className="delete-column-btn"
//           >
//             ×
//           </button>
//         </div>
        
//         {column.tasks?.map(task => (
//           <div key={task.id} className="card">
//             <span onClick={() => update_task(column.id, task.id, task.title)}>
//               {task.title}
//             </span>
//             <button
//               onClick={() => delete_task(column.id, task.id)}
//               disabled={loading}
//               className="delete-btn"
//             >
//               ×
//             </button>
//           </div>
//         ))}
        
//         <button
//           onClick={() => add_task(column.id)}
//           disabled={loading}
//           className="add-btn"
//         >
//           + Добавить карточку
//         </button>
//       </div>
//     ))
//   ), [columns, loading, update_column, delete_column, update_task, delete_task, add_task]);

//   return (
//     <div className="board-page">
//       <nav className="main-nav">
//         <Link to="/" className="home-link">
//           <svg className="home-icon" viewBox="0 0 24 24">
//             <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
//           </svg>
//           Главная
//         </Link>
//         <button onClick={toggle_theme} className="theme-toggle">
//           {isDarkMode ? "светлая" : "тёмная"}
//         </button>
//       </nav>

//       <div className="board-container">
//         {error && <div className="error-message">{error}</div>}
//         {loading && <div className="loading-indicator">загрузка...</div>}

//         <button
//           onClick={add_column}
//           disabled={loading}
//           className="add-column-btn"
//         >
//           + Добавить колонку
//         </button>

//         <div className="board">
//           {memo_columns}
//         </div>
//       </div>
//     </div>
//   );
// } 