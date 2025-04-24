// import { Routes, Route } from "react-router-dom";
// import List from "./List";
// import Board from "./Board";
// import Task from "./Task";
// import { ThemeProvider } from "./ThemeContext";

// export default function App() {
//   return (
//     <ThemeProvider>
//       <Routes>
//         <Route path="/" element={<List />} />
//         <Route path="/board/:id" element={<Board />} />
//         <Route path="/board/task/:id" element={<Task />} />
//       </Routes>
//     </ThemeProvider>
//   );
// }

import { Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import List from "./List";
import Board from "./Board";
import Task from "./Task";
import { ThemeProvider } from "./ThemeContext";
import store from './store'; // Импортируем созданный store

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/board/task/:id" element={<Task />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}