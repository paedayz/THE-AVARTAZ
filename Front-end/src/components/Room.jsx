import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// MUI stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";

class Room extends Component {
  render() {
    const {
      room: { roomName },
    } = this.props;
    // const classes = this.props.classes
    return (
      <CardBox elevation={5}>
        <Content>
          <Typography
            variant="h6"
            component={Link}
            to={`/room/${roomName}`}
            style={{ color: "black" }}
          >
            {roomName}
          </Typography>
        </Content>
      </CardBox>
    );
  }
}

const CardBox = styled(Card)`
  display: flex;
  margin: 10px;
`;
const Content = styled(CardContent)`
  padding: 25;
  object-fit: cover;
  text-align: left;
`;

export default Room;
