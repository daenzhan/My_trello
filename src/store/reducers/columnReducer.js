import {
    FETCH_COLUMNS_REQUEST,
    FETCH_COLUMNS_SUCCESS,
    FETCH_COLUMNS_FAILURE,
    ADD_COLUMN,
    UPDATE_COLUMN,
    DELETE_COLUMN
  } from '../actions/types';
  
  const initialState = {
    columnsByBoard: {},
    loading: false,
    error: null
  };
  
  export default function columnReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_COLUMNS_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_COLUMNS_SUCCESS:
        return {
          ...state,
          columnsByBoard: {
            ...state.columnsByBoard,
            [action.payload.boardId]: action.payload.columns
          },
          loading: false
        };
      case FETCH_COLUMNS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case ADD_COLUMN:
        return {
          ...state,
          columnsByBoard: {
            ...state.columnsByBoard,
            [action.payload.boardId]: [
              ...(state.columnsByBoard[action.payload.boardId] || []),
              action.payload.column
            ]
          }
        };
      case UPDATE_COLUMN:
        const boardId = Object.keys(state.columnsByBoard).find(key =>
          state.columnsByBoard[key].some(col => col.id === action.payload.columnId)
        );
        return {
          ...state,
          columnsByBoard: {
            ...state.columnsByBoard,
            [boardId]: state.columnsByBoard[boardId].map(column =>
              column.id === action.payload.columnId
                ? { ...column, title: action.payload.title }
                : column
            )
          }
        };
      case DELETE_COLUMN:
        const boardIdToUpdate = Object.keys(state.columnsByBoard).find(key =>
          state.columnsByBoard[key].some(col => col.id === action.payload)
        );
        return {
          ...state,
          columnsByBoard: {
            ...state.columnsByBoard,
            [boardIdToUpdate]: state.columnsByBoard[boardIdToUpdate].filter(
              column => column.id !== action.payload
            )
          }
        };
      default:
        return state;
    }
  }