import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AdminRoute = ({
  component: Component,
  authenticated,
  status,
  ...rest
}) => {
  console.log(status);
  console.log(authenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        status === "admin"
          ? (console.log("From: AdminRoute1"), (<Component {...props} />))
          : (console.log("From: AdminRoute2"), (<Redirect to="/home" />))
      }
    />
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  status: state.user.status,
});

AdminRoute.propTypes = {
  user: PropTypes.object,
};

export default connect(mapStateToProps)(AdminRoute);
