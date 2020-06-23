import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getRoomData, getAcceptAdvertise } from "../redux/actions/dataAction";
import { connect } from "react-redux";

class Home extends Component {
  componentDidMount() {
    document.getElementById("bottom").scrollIntoView();
    this.props.getRoomData();
    this.props.getAcceptAdvertise();
  }
  render() {
    return (
      <Background id="bottom">
        <Avartaz>THE AVARTAZ</Avartaz>
        <Link to="/home">
          <Button>Start</Button>
        </Link>
        <Bird></Bird>
      </Background>
    );
  }
}

//style

const fly = keyframes`
  from {
    top: 50%;
    left: 94.5%;
    opacity: 1;
    
  }
  to {
    top: 20%;
    left: 64.5%;
    opacity: 0 ;
  }
`;

const Background = styled.div`
  background-image: url(/img/homeBackground.jpg);
  position: relative;
  height: 100vh;
  width: 100%;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
`;

const Avartaz = styled.div`
  font-size: 5rem;
  text-align: center;
  font-family: Courier;
  position: absolute;
  top: 10%;
  left: 33%;
  border-width: 2px 1px solid black;
`;

const Button = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  display: block;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 2px solid black;
  position: absolute;
  top: 50%;
  left: 45%;
  cursor: pointer;
  &:hover {
    border: 2px solid white;
  }
  font-size: 2.5rem;
  font-family: "Courier New", Courier, monospace;
  color: white;
`;

const Bird = styled.div`
  background-image: url(/img/bird.gif);
  display: block;
  position: absolute;
  top: 50%;
  left: 94.5%;
  height: 5vh;
  width: 2.5%;
  transform: rotate(10deg);
  animation: ${fly} infinite 20s linear;
`;

export default connect(null, { getRoomData, getAcceptAdvertise })(Home);
