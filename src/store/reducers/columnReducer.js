import {
    FETCH_COLUMNS_REQUEST,
    FETCH_COLUMNS_SUCCESS,
    FETCH_COLUMNS_FAILURE,
    ADD_COLUMN,
    UPDATE_COLUMN,
    DELETE_COLUMN,
    MOVE_COLUMN
  } from '../actions/types';
  
  const initialState = {
    columnsByBoard: {},
    loading: false,
    error: null
  };
  
  export default function columnReducer(state = initialState, action) {
    switch (action.type) {
      // не изменяют исходный state, а создают новый!
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
      
      case MOVE_COLUMN:
        const { columnId: moveColumnId, boardId: moveBoardId, newIndex } = action.payload;
        const columns = [...state.columnsByBoard[moveBoardId]];
         const oldIndex = columns.findIndex(col => col.id === moveColumnId);
  
         if (oldIndex === -1) return state;
  
         // Remove from old position and insert at new position
         const [movedColumn] = columns.splice(oldIndex, 1);
         columns.splice(newIndex, 0, movedColumn);
  
         // Update indexes for all columns
        const updatedColumns = columns.map((col, idx) => ({
        ...col,
        index: idx
       }));
  
      return {
       ...state,
       columnsByBoard: {
        ...state.columnsByBoard,
       [moveBoardId]: updatedColumns
       }
      };
    default:
      return state;
    }
  }