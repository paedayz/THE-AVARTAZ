import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import AuthRoute from "./util/AuthRoute";
import PrivateRoute from "./util/PrivateRoute";
import "./App.css";
import axios from "axios";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userAction";

// Component
import Navbar from "./components/Navbar";

// Page
import start from "./pages/start";
import home from "./pages/home";
import Room from "./pages/Room";
import admin from "./pages/admin";
import loading from "./pages/landing";

let axiosDefaults = require("axios/lib/defaults");
axiosDefaults.baseURL =
  "https://asia-northeast1-the-avartaz.cloudfunctions.net/api";

const token = localStorage.FBIdToken;

if (token) {
  const decodeToken = jwtDecode(token);
  if (decodeToken.exp * 1000 < Date.now()) {
    window.location.href = "/";
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route
          path="/"
          render={(props) => {
            if (props.location.pathname !== "/loading") {
              return <Navbar />;
            }
          }}
        ></Route>

        <Switch>
          <Container>
            <AuthRoute exact path="/" component={start} />
            <PrivateRoute exact path="/home" component={home} />
            <PrivateRoute exact path="/room/:room" component={Room} />
            <PrivateRoute
              exact
              path="/room/:room/scream/:screamId"
              component={Room}
            />
            <PrivateRoute
              exact
              path="/admin/:adminName/:random"
              component={admin}
            />
            <Route exact path="/loading" component={loading} />
          </Container>
        </Switch>
      </Router>
    </Provider>
  );
}

const Container = styled.div`
  margin: 120px auto 0 auto;
  max-width: 1900px;
`;

export default App;
