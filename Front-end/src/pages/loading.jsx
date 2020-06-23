import React, { Component, Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Stretch } from "styled-loaders-react";

class home extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.history.push("/home");
    }, 2000);
  }

  render() {
    return (
      <Fragment>
        <Stretch size="40px" rectWidth="1px" />
      </Fragment>
    );
  }
}

export default home;
