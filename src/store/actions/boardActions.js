import { api } from '../../api';
import {
  FETCH_BOARDS_REQUEST,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD
} from './types';

export const fetchBoards = () => async (dispatch) => {
  dispatch({ type: FETCH_BOARDS_REQUEST });
  try {
    const response = await api.get('/boards');
    dispatch({ type: FETCH_BOARDS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_BOARDS_FAILURE, payload: error.message });
  }
};

export const addBoard = (title) => async (dispatch) => {
  try {
    const response = await api.post('/boards', { title });
    dispatch({ type: ADD_BOARD, payload: response.data });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBoard = (id, title) => async (dispatch) => {
  try {
    await api.patch(`/boards/${id}`, { title });
    dispatch({ type: UPDATE_BOARD, payload: { id, title } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteBoard = (id) => async (dispatch) => {
  try {
    await api.delete(`/boards/${id}`);
    dispatch({ type: DELETE_BOARD, payload: id });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};