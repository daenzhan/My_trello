import {
    FETCH_BOARDS_REQUEST,
    FETCH_BOARDS_SUCCESS,
    FETCH_BOARDS_FAILURE,
    ADD_BOARD,
    UPDATE_BOARD,
    DELETE_BOARD
  } from '../actions/types';
  
  const initialState = {
    boards: [],
    loading: false,
    error: null
  };
  
  export default function boardReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_BOARDS_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_BOARDS_SUCCESS:
        return { ...state, loading: false, boards: action.payload };
      case FETCH_BOARDS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case ADD_BOARD:
        return { ...state, boards: [...state.boards, action.payload] };
      case UPDATE_BOARD:
        return {
          ...state,
          boards: state.boards.map(board =>
            board.id === action.payload.id ? { ...board, title: action.payload.title } : board
          )
        };
      case DELETE_BOARD:
        return {
          ...state,
          boards: state.boards.filter(board => board.id !== action.payload)
        };
      default:
        return state;
    }
  }