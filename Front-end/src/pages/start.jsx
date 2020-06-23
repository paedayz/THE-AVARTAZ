import React, { Component, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { getScreams } from "../redux/actions/dataAction";

// Redux
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component
import Scream from "../components/Scream";
import Signup from "./signup";
import Login from "./login";
import Button from "@material-ui/core/Button";
import Circularprogress from "@material-ui/core/CircularProgress";

class start extends Component {
  state = {
    login: true,
    finish: false,
  };

  componentWillUnmount() {
    this.setState({ finish: true });
  }

  componentDidMount() {
    this.props.getScreams("Start");
  }

  changeMode = () => {
    this.setState({ login: !this.state.login });
  };

  render() {
    const token = localStorage.FBIdToken;

    if (token) {
      window.location.href = "/loading";
    }
    const { screams, loading } = this.props.data;
    let recentScreamsMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <Circularprogress />
    );

    let mode = this.state.login ? <Login></Login> : <Signup></Signup>;

    return (
      <Fragment>
        {!this.state.finish ? (
          <Grid container spacing={5} justify="center">
            <Grid item sm={5} xs={12}>
              {recentScreamsMarkup}
            </Grid>
            <Grid item sm={3} xs={12}>
              {mode}
              <Button
                variant="contained"
                color="primary"
                onClick={this.changeMode}
                style={{ marginTop: 50 }}
              >
                MODE
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Circularprogress />
        )}
      </Fragment>
    );
  }
}

start.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(start);
