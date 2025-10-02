import { useState } from "react";
import {useNavigate, NavLink } from "react-router-dom";
import axios from "axios";


function Price() {
  const [source, setSource] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [possibleStops, setPossibleStops] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    proccedToFare()
  };

  const proccedToFare = () =>{
    if (sourceId !== "" && destinationId !== "") {
    console.log("source",source)
    console.log("destination",destination)
      navigate(`/fareCharges?from=${sourceId}&to=${destinationId}`,
        {state:
          {
           sourceName: source,
           destinationName: destination
          }
      }); 
    }
  }

  const fetchSuggestions = async (value, isSource) => {
    if (value.length > 1) {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/dtc_tracker/stop?stopName=${value}`);
        if (isSource) {
          setSourceSuggestions(res.data);
          setShowSourceSuggestions(true);
        } else {
          setDestSuggestions(res.data);
          setShowDestSuggestions(true);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    } else {
      isSource ? setShowSourceSuggestions(false) : setShowDestSuggestions(false);
    }
  };

  const fetchPossibleStops = async (stopId) => {
    try {
      console.log(stopId)      
      const res = await axios.get(`http://127.0.0.1:5000/dtc_tracker/fare?from=${stopId}`);
      setPossibleStops(res.data);
    } catch (err) {
      console.error("Error fetching possible stops:", err);
    }
  };

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setSourceId("");
    fetchSuggestions(value, true);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setDestinationId("");
    
    if (value.length > 1 && possibleStops.length > 0 ) {
      const suggestions = possibleStops.filter(stop =>
        stop.stop_name.toLowerCase().includes(value.toLowerCase())
      );
      setDestSuggestions(suggestions);
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const handleSourceSuggestionClick = (suggestion) => {
    setSource(suggestion.stop_name);
    setSourceId(suggestion.stop_id);
    setShowSourceSuggestions(false);
    fetchPossibleStops(suggestion.stop_id);
  };

  const handleDestSuggestionClick = (suggestion) => {
    setDestination(suggestion.stop_name);
    setDestinationId(suggestion.stop_id);
    setShowDestSuggestions(false);
    console.log("sourcename:",source)
    if (sourceId) {
      proccedToFare();
    }
  };

   const navLinks = [
        { to: "/", label: "Home" },
        { to: "/stop", label: "Stop" },
        { to: "/fare", label: "Price" },
        { to: "/contact", label: "Contact" },
        { to: "/about", label: "About us" }
      ];


  return (
   <div className="d-flex flex-column min-vh-100">
         {/* Navbar */}
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
           <NavLink className="navbar-brand fw-bold" to="/">
             DTC Tracker
           </NavLink>
           <button
             className="navbar-toggler"
             type="button"
             data-bs-toggle="collapse"
             data-bs-target="#navbarNav"
             aria-controls="navbarNav"
             aria-expanded="false"
             aria-label="Toggle navigation"
           >
             <span className="navbar-toggler-icon"></span>
           </button>
           <div className="collapse navbar-collapse" id="navbarNav">
             <ul className="navbar-nav ms-auto">
               {navLinks.map((link) => (
                 <li className="nav-item" key={link.to}>
                   <NavLink
                     to={link.to}
                     end={link.to === "/"}
                     className={({ isActive }) =>
                       isActive ? "nav-link active" : "nav-link"
                     }
                   >
                     {link.label}
                   </NavLink>
                 </li>
               ))}
             </ul>
           </div>
         </nav>
   
         {/* Main Content */}
         <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 bg-light text-center py-5">
           <h1 className="display-2 fw-bold text-dark mb-3">Check Fare!!</h1>
   
           <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
             {/* Source Input */}
             <div className="mb-3 position-relative">
               <input
                 type="text"
                 className="form-control"
                 id="source"
                 placeholder="Enter Source Stop Name"
                 value={source}
                 onChange={handleSourceChange}
                 autoComplete="off"
               />
               {showSourceSuggestions && sourceSuggestions.length > 0 && (
                 <ul className="list-group position-absolute w-100 z-3" style={{ top: "100%", left: 0 }}>
                   {sourceSuggestions.slice(0, 5).map((s, index) => (
                     <li
                       key={index}
                       className="list-group-item list-group-item-action p-2"
                       tabIndex={0}
                       style={{
                         cursor: "pointer",
                         backgroundColor: "#f8f9fa",
                         borderRadius: "5px",
                       }}
                       onClick={() => handleSourceSuggestionClick(s)}
                       onKeyDown={(e) => e.key === "Enter" && handleSourceSuggestionClick(s)}
                     >
                       <strong>{s.stop_name}</strong>
                       <small className="text-muted"> ({s.stop_id})</small>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
   
             {/* Destination Input */}
             <div className="mb-3 position-relative">
               <input
                 type="text"
                 className="form-control"
                 id="destination"
                 placeholder="Enter Destination Stop Name"
                 value={destination}
                 onChange={handleDestinationChange}
                 autoComplete="off"
               />
               {showDestSuggestions && destSuggestions.length > 0 && (
                 <ul className="list-group position-absolute w-100 z-3" style={{ top: "100%", left: 0 }}>
                   {destSuggestions.slice(0, 3).map((s, index) => (
                     <li
                       key={index}
                       className="list-group-item list-group-item-action p-2"
                       tabIndex={0}
                       style={{
                         cursor: "pointer",
                         backgroundColor: "#f8f9fa",
                         borderRadius: "5px",
                       }}
                       onClick={() => handleDestSuggestionClick(s)}
                       onKeyDown={(e) => e.key === "Enter" && handleDestSuggestionClick(s)}
                     >
                       <strong>{s.stop_name}</strong>
                       <small className="text-muted"> ({s.stop_id})</small>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
             <button type="submit" className="btn btn-primary w-100">
               Get Fare Details
             </button>
           </form>
         </div>
   
         <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
     );
}

export default Price;
