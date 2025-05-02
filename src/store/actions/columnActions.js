import { api } from '../../api';
import {
  FETCH_COLUMNS_REQUEST,
  FETCH_COLUMNS_SUCCESS,
  FETCH_COLUMNS_FAILURE,
  ADD_COLUMN,
  UPDATE_COLUMN,
  DELETE_COLUMN,
  MOVE_COLUMN
} from './types';

export const fetchColumns = (boardId) => async (dispatch) => {
  dispatch({ type: FETCH_COLUMNS_REQUEST });
  try {
    const response = await api.get(`/columns?boardId=${boardId}&_embed=tasks`);
    dispatch({ 
      type: FETCH_COLUMNS_SUCCESS, 
      payload: { boardId, columns: response.data } 
    });
  } catch (error) {
    dispatch({ type: FETCH_COLUMNS_FAILURE, payload: error.message });
  }
};

export const addColumn = (boardId, title) => async (dispatch) => {
  try {
    const response = await api.post('/columns', { boardId, title });
    dispatch({ 
      type: ADD_COLUMN, 
      payload: { boardId, column: response.data } 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateColumn = (columnId, title) => async (dispatch) => {
  try {
    await api.patch(`/columns/${columnId}`, { title });
    dispatch({ 
      type: UPDATE_COLUMN, 
      payload: { columnId, title } 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteColumn = (columnId) => async (dispatch) => {
  try {
    await api.delete(`/columns/${columnId}`);
    dispatch({ type: DELETE_COLUMN, payload: columnId });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const moveColumn = (columnId, newIndex) => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardId = Object.keys(state.columns.columnsByBoard).find(key =>
      state.columns.columnsByBoard[key].some(col => col.id === columnId)
    );
    
    if (!boardId) throw new Error('Column not found');
    
    await api.patch(`/columns/${columnId}`, { index: newIndex });
    dispatch({ 
      type: MOVE_COLUMN, 
      payload: { columnId, boardId, newIndex } 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};