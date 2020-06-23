import React, { Component } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styled from "styled-components";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { releaseBanUser } from "../../redux/actions/adminAction";

// MUI stuff
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

class BanList extends Component {
  submit = () => {
    this.props.releaseBanUser(this.props.ban.avatarName);
  };
  render() {
    dayjs.extend(relativeTime);
    const { avatarName, createdAt, release } = this.props.ban;
    return (
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item sm="9" xm="12">
          <Detail>
            Avartar Name:<Name>{avatarName}</Name> <br /> Start:{" "}
            {dayjs(createdAt).fromNow()} <br /> End:{" "}
            <Room>{dayjs(release).fromNow()}</Room>
          </Detail>
        </Grid>
        <Grid item sm="3" xm="12">
          <Btn>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.submit}
            >
              sudden <br />
              release
            </Button>
          </Btn>
        </Grid>
      </Grid>
    );
  }
}

const Btn = styled.div`
  margin-top: 35px;
  margin-right: 50px;
`;

const Name = styled.span`
  color: red;
`;

const Room = styled.span`
  color: blue;
`;

const Detail = styled.div`
  margin-top: 30px;
  margin-left: 20px;
  text-align: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

BanList.propTypes = {
  releaseBanUser: PropTypes.func.isRequired,
};

export default connect(null, { releaseBanUser })(BanList);
