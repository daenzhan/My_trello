import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './reducers/boardReducer';
import columnReducer from './reducers/columnReducer';
import taskReducer from './reducers/taskReducer';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export default store;