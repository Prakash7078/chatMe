import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import './style.scss';
import Register from "./Pages/Register";
import { useContext } from "react";
import { AuthContext } from "./ContextAPI/AuthContext";
function App() {
  const {currentUser}=useContext(AuthContext);
  const ProtectedRoute=({children})=>{
    if(!currentUser){
      return <Navigate to="/login"/>
    }
    return children
  }
  return (
    <BrowserRouter>
    <div className="app">
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/' element={<ProtectedRoute>
          <Home/>
        </ProtectedRoute>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
