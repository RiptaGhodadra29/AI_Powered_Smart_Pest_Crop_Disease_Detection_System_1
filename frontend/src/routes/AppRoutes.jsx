import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home";
import Upload from "../pages/Upload/Upload";
import PredictionResult from "../pages/PredictionResult/PredictionResult";
import Recommendation from "../pages/Recommendation/Recommendation";
import ProtectedRoute from "./ProtectedRoute";
import History from "../pages/History/History";
import PredictionDetail from "../pages/PredictionDetail/PredictionDetail";

const AppRoutes = () => {
  const location = useLocation();

  return (
    // Keying on the path remounts the page subtree per navigation, which
    // retriggers each page's entrance animation — a smooth cross-page feel.
    <div key={location.pathname} className="animate-page">
      <Routes location={location}>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/upload" element={ <ProtectedRoute> <Upload /> </ProtectedRoute> } />

      <Route path="/prediction-result" element={ <ProtectedRoute> <PredictionResult /> </ProtectedRoute> } />
     
      <Route path="/history" element={ <ProtectedRoute> <History /> </ProtectedRoute> } />

      <Route path="/history/:id" element={ <ProtectedRoute> <PredictionDetail /> </ProtectedRoute> } />

      <Route path="/recommendation" element={<Recommendation />} />

      

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      </Routes>
    </div>
  );
};

export default AppRoutes;