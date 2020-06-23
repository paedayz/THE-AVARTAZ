import React, { Component } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styled from "styled-components";

// MUI stuff

export class HostsList extends Component {
  render() {
    dayjs.extend(relativeTime);
    const { avatarName, createdAt, status } = this.props.host;
    return (
      <Detail>
        Avartar Name:<Name>{avatarName}</Name> <br /> Begin:{" "}
        {dayjs(createdAt).fromNow()} <br /> Room: <Room>{status}</Room>
      </Detail>
    );
  }
}

const Name = styled.span`
  color: red;
`;

const Room = styled.span`
  color: blue;
`;

const Detail = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  text-align: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

export default HostsList;
