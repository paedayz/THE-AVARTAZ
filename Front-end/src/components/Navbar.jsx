import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import store from "../redux/store";
import { logoutUser } from "../redux/actions/userAction";
import PostScream from "./PostScream";
import Notifications from "./Notifications";
import { getRoomData } from "../redux/actions/dataAction";

// Redux
import { connect } from "react-redux";

// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// Icon
import HomeIcon from "@material-ui/icons/Home";

const logout = () => {
  window.location.href = "/";
  store.dispatch(logoutUser());
};

class Navbar extends Component {
  render() {
    const {
      authenticated,
      data: { current_room },
    } = this.props;

    return (
      <div>
        <AppBar style={{ backgroundColor: "rgba(0,0,0,1)" }}>
          {authenticated ? (
            <Fragment>
              <BlankTwo></BlankTwo>
              <Grid container>
                <Grid item sm={3} xs={12}></Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant="h3" component={Link} to={"/"}>
                    THE AVARTAZ
                  </Typography>
                  <Room>
                    {current_room === "Home" ? " " : `${current_room} Room`}
                  </Room>
                </Grid>
                <Grid item sm={3} xs={12}>
                  {current_room === "Home" ||
                  current_room === "ADMIN" ? null : (
                    <PostScream />
                  )}

                  <IconButton component={Link} to="/home">
                    <HomeIcon style={{ color: "white" }} />
                  </IconButton>

                  <IconButton>
                    <Notifications style={{ color: "white" }} />
                  </IconButton>

                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={logout}
                    style={{ marginLeft: "20px" }}
                  >
                    logout
                  </Button>
                </Grid>
              </Grid>
              {current_room === "Home" && <br />}
            </Fragment>
          ) : (
            <Fragment>
              <Blank></Blank>
              <Typography variant="h4">Welcome to THE AVARTAZ</Typography>
              <Blank></Blank>
            </Fragment>
          )}
        </AppBar>
      </div>
    );
  }
}

const Room = styled.div`
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  margin-bottom: 5px;
`;

const Blank = styled.div`
  margin-top: 30px;
`;
const BlankTwo = styled.div`
  margin-top: 15px;
`;

const mapActionToProps = {
  logoutUser,
  getRoomData,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  data: state.data,
});

Navbar.propTypes = {
  authenticated: Proptypes.bool.isRequired,
  logoutUser: Proptypes.func.isRequired,
  data: Proptypes.object.isRequired,
};

export default connect(mapStateToProps, mapActionToProps)(Navbar);
