import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// MUI stuff
import Grid from "@material-ui/core/Grid";

class FooterBar extends Component {
  render() {
    return (
      <Bar>
        <Grid container spacing={5}>
          <Item item sm={4} xs={12}>
            logout
          </Item>
          <Item item sm={4} xs={12}>
            <AddBtn>+</AddBtn>
            <p>
              <b>Add Post</b>
            </p>
          </Item>
          <Item item sm={4} xs={12}>
            notification
          </Item>
        </Grid>
      </Bar>
    );
  }
}

const AddBtn = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: solid 2px gray;
  box-shadow: 2px 2px 4px gray;
  font-size: 30px;
`;

const Item = styled(Grid)`
  margin-top: 15px;
`;

const Bar = styled.ul`
  list-style-type: none;
  width: 100%;
  height: 120px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  float: center;
  background-color: lightblue;
  border: solid 1px gray;
  position: fixed;
  top: 80%;
  box-shadow: 0px 5px 10px gray;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

export default FooterBar;
