import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getRoomScreams } from "../redux/actions/dataAction";

// Component
import Scream from "../components/Scream";
import Profile from "../components/Profile";

//MUI stuff
import CircleProgress from "@material-ui/core/CircularProgress";

class Room extends Component {
  state = {
    screams: null,
    screamIdParam: null,
  };

  componentDidMount() {
    this.props.getRoomScreams(this.props.match.params.room);
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });
  }

  render() {
    const { screams, loading } = this.props.data;
    const { screamIdParam } = this.state;

    let recentScreamsMarkup = loading ? (
      <CircleProgress size="60px" />
    ) : screams.length === 0 ? (
      <p>No screams from this room</p>
    ) : !screamIdParam ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map((scream) => {
        if (scream.screamId !== screamIdParam)
          return <Scream key={scream.screamId} scream={scream} />;
        else return <Scream key={scream.screamId} scream={scream} openDialog />;
      })
    );

    return (
      <Grid container justify="center" spacing={10}>
        <Grid item sm={5} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Room.propTypes = {
  getRoomScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getRoomScreams })(Room);
