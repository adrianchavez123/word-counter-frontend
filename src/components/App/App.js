import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import Dashboard from "../Dashboard";
import PrivateRoute from "../PrivateRoute";
import { Login, Signup, ForgotPassword, UpdateProfile } from "../Auth";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
