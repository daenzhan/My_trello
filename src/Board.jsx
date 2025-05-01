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
  loadTasks,
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
    collect: (monitor) => ({    // следит
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
  const [{ isOver }, drop] = useDrop(() => ({     // сюда можно закидывать)
    accept: 'CARD',
    drop: (item) => {
        onTaskMove(item.id, item.columnId, column.id);
    },
    collect: (monitor) => ({  // находиться или нет
      isOver: !!monitor.isOver(),
    }),
  }));


  /// ОБЗАТЕЛЬНО - для реагирования || меняет || rev дом
  // isOver просветка
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
    dispatch(loadTasks());
  }, [boardId, dispatch]);

  const handleAddColumn = useCallback(async () => {
    const title = prompt("Введите название:");
    if (!title) return;
    const result = dispatch(addColumn(boardId, title));
    if (!result.success) {
      setError(result.error);
    }
  }, [boardId, dispatch]);

  const handleUpdateColumn = useCallback(async (columnId, currentTitle) => {
    const newTitle = prompt("Введите название:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    const result = dispatch(updateColumn(columnId, newTitle));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleDeleteColumn = useCallback(async (columnId) => {
    if (!confirm("Удалить колонку?")) return;
    const result = dispatch(deleteColumn(columnId));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleAddTask = useCallback(async (columnId) => {
    const title = prompt("Введите название:");
    if (!title) return;
    const result = dispatch(addTask(columnId, title));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleUpdateTask = useCallback(async (columnId, taskId, currentTitle) => {
    const newTitle = prompt("Введите название:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    const result = dispatch(updateTask(taskId, columnId, newTitle));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleDeleteTask = useCallback(async (columnId, taskId) => {
    if (!confirm("Удалить задачу?")) return;
    const result = dispatch(deleteTask(taskId, columnId));
    if (!result.success) {
      setError(result.error);
    }
  }, [dispatch]);

  const handleMoveTask = useCallback(async (taskId, fromColumnId, toColumnId) => {
    const result = dispatch(moveTask(taskId, fromColumnId, toColumnId));
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
