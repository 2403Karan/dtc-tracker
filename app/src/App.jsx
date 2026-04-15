import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/login";
import AppSidebar from "./appSidebar/AppSidebar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Stop from "./components/Stop";
import StopTimings from "./components/StopTimings";
import Fare from "./components/Price";
import RouteDetails from "./components/RouteDetails";
import FareDetails from "./components/FareDetails";
import Contact from "./components/Contact";
import TripDetails from "./components/TripDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AppSidebar />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="stop" element={<Stop />} />
            <Route path="stop/:stopNo" element={<StopTimings />} />
            <Route path="fare" element={<Fare />} />
            <Route path="fareCharges" element={<FareDetails />} />
            <Route path="routeDetails" element={<RouteDetails />} />
            <Route path="trip/:tripId/schedule" element={<TripDetails />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;