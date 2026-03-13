import {BrowserRouter,Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details';
import Result from './pages/Result';
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
function PrivateRoute({ children }) {

  const { loggedIn } = useContext(AuthContext);

  return loggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/list"
  element={<PrivateRoute>
      <List />
    </PrivateRoute>}/>
        <Route path="/details" element={<Details />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;