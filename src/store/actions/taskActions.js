import { api } from '../../api';
import { ADD_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK, LOAD_TASKS } from './types';



// ВОООТ АСИНХРОН

export const addTask = (columnId, title) => async (dispatch) => {
  try {
    const response = await api.post('/tasks', { columnId, title });
    dispatch({ 
      type: ADD_TASK, 
      payload: { columnId, task: response.data } // сохраняем все потому что асинхроооон
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTask = (taskId, columnId, title) => async (dispatch) => {
  try {
    await api.patch(`/tasks/${taskId}`, { title });
    dispatch({ 
      type: UPDATE_TASK, 
      payload: { taskId, columnId, title } 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteTask = (taskId, columnId) => async (dispatch) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    dispatch({ 
      type: DELETE_TASK, 
      payload: { taskId, columnId } // Теперь передаем и columnId
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const moveTask = (taskId, fromColumnId, toColumnId) => async (dispatch) => {
  try {
    await api.patch(`/tasks/${taskId}`, { columnId: toColumnId });
    dispatch({ 
      type: MOVE_TASK, 
      payload: { taskId, fromColumnId, toColumnId } 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loadTasks = () => async (dispatch) => {
  try {
    const response = await api.get('/tasks');
    dispatch({
      type: LOAD_TASKS,
      payload: response.data
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
