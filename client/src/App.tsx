import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout1 from "./layouts/Layout1";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./route-protect/PrivateRoute";
import PlayingChess from "./components/PlayingChess";
import PlayingChess2 from "./components/PlayingChess2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout1 />}>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/playing-chess-friends" element={<PlayingChess />} />
            <Route path="/playing-chess-matching" element={<PlayingChess2 />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
