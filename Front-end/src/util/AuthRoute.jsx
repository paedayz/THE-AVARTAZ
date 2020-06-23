import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AuthRoute = ({
  component: Component,
  authenticated,
  status,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  status: state.user.credentials.status,
});

AuthRoute.propTypes = {
  user: PropTypes.object,
};

export default connect(mapStateToProps)(AuthRoute);
