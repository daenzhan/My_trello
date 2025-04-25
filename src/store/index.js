import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './reducers/boardReducer';
import columnReducer from './reducers/columnReducer';
import taskReducer from './reducers/taskReducer';

export const store = configureStore({
  reducer: {
    boards: boardReducer,  // все будет храниться в state.boards
    columns: columnReducer,
    tasks: taskReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({  // промежточный ПО
    serializableCheck: false // можно payload  + перетаскивание
  })
});

export default store;