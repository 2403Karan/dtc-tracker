import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Price from "./components/Price";
import Stop from "./components/Stop";
import StopTimings from "./components/StopTimings";
import FareDetails from "./components/FareDetails";
import TripSchedule from "./components/TripSchedule";
import Trip from "./components/Trip";
import RouteDetails from "./components/RouteDetails";
import 'bootstrap/dist/css/bootstrap.min.css';
import About from "./components/About";
import Contact from "./components/Contact";


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stop" element={<Stop />} />
          <Route path="/stop/:stopNo" element={<StopTimings />} />
          <Route path="/fare" element={<Price />} />
          <Route path="/fareCharges" element={<FareDetails />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/trip/:tripId" element={<TripSchedule />} />
          <Route path="/routeDetails" element={<RouteDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
    </Router>
  );
}

export default App;
