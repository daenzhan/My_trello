import { ADD_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK } from '../actions/types';

const initialState = {
  tasksByColumn: {},
  loading: false,
  error: null
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasksByColumn: {
          ...state.tasksByColumn,
          [action.payload.columnId]: [
            ...(state.tasksByColumn[action.payload.columnId] || []),
            action.payload.task
          ]
        }
      };
    case UPDATE_TASK:
      const columnId = Object.keys(state.tasksByColumn).find(key =>
        state.tasksByColumn[key].some(task => task.id === action.payload.taskId)
      );
      return {
        ...state,
        tasksByColumn: {
          ...state.tasksByColumn,
          [columnId]: state.tasksByColumn[columnId].map(task =>
            task.id === action.payload.taskId
              ? { ...task, title: action.payload.title }
              : task
          )
        }
      };
    case DELETE_TASK:
      const columnIdToUpdate = Object.keys(state.tasksByColumn).find(key =>
        state.tasksByColumn[key].some(task => task.id === action.payload)
      );
      return {
        ...state,
        tasksByColumn: {
          ...state.tasksByColumn,
          [columnIdToUpdate]: state.tasksByColumn[columnIdToUpdate].filter(
            task => task.id !== action.payload
          )
        }
      };
      case MOVE_TASK:
        const { taskId, fromColumnId, toColumnId, newIndex } = action.payload;
        
        // Создаем глубокую копию текущего состояния
        const newTasksByColumn = JSON.parse(JSON.stringify(state.tasksByColumn));
        
        // Находим задачу в исходной колонке
        const taskIndex = newTasksByColumn[fromColumnId]?.findIndex(task => task.id === taskId);
        if (taskIndex === -1 || taskIndex === undefined) return state;
        
        const taskToMove = { ...newTasksByColumn[fromColumnId][taskIndex] };
        
        // Удаляем задачу из исходной колонки
        newTasksByColumn[fromColumnId] = newTasksByColumn[fromColumnId].filter(
          task => task.id !== taskId
        );
        
        // Если перемещение внутри той же колонки
        if (fromColumnId === toColumnId) {
          // Вставляем задачу на новую позицию
          newTasksByColumn[toColumnId] = [...newTasksByColumn[toColumnId]];
          newTasksByColumn[toColumnId].splice(newIndex, 0, {
            ...taskToMove,
            columnId: toColumnId
          });
        } 
        // Если перемещение между колонками
        else {
          newTasksByColumn[toColumnId] = [
            ...(newTasksByColumn[toColumnId] || []),
            { ...taskToMove, columnId: toColumnId }
          ];
        }
        
        // Обновляем индексы всех задач в целевой колонке
        newTasksByColumn[toColumnId] = newTasksByColumn[toColumnId].map((task, idx) => ({
          ...task,
          index: idx
        }));
        
        return {
          ...state,
          tasksByColumn: newTasksByColumn
        };
    default:
      return state;
  }
}