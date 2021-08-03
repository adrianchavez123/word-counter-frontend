import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "../Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Dashboard />
      </div>
    </Router>
  );
}

export default App;
