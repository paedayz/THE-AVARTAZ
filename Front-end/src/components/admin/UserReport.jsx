import React, { Component, Fragment } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../../redux/actions/dataAction";

// MUI stuff
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";

export class Report extends Component {
  state = {
    open: false,
  };

  handleClickClose = () => {
    this.setState({ open: false });
  };

  render() {
    dayjs.extend(relativeTime);
    const { from, reportDetail, createdAt, accused, image } = this.props.report;

    const {
      status,
      avatarImage,
      bio,
      website,
      location,
      avatarName,
    } = this.props.userData;

    const showProfile = () => {
      this.setState({ open: true });
      this.props.getUserData(accused);
    };
    return (
      <Fragment>
        <CardBox>
          <Card
            style={{
              borderRadius: "5%",
              padding: "40px",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
            elevation={5}
          >
            <ReportImage src={image} />
            <Content>
              <Detail>
                From : {from} ------ {dayjs(createdAt).fromNow()}
              </Detail>
              <ReportBody>{reportDetail}</ReportBody>
              <br />
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => showProfile()}
              >
                {accused}
              </Button>
              <Detail />
            </Content>
          </Card>
        </CardBox>

        <Dialog open={this.state.open} onClose={this.handleClickClose}>
          <Box elevation={10}>
            <br />
            <ImageBox>
              {status === "ban" ? (
                <BanImage src={avatarImage} />
              ) : (
                <Image src={avatarImage}></Image>
              )}
            </ImageBox>

            <p>
              <b>User name : </b> {avatarName}
            </p>
            {bio ? (
              <div>
                <p>
                  <b>Bio</b> {bio}
                </p>
                <p>
                  <b>website</b> {website}
                </p>
                <p>
                  <b>location</b> {location}
                </p>
              </div>
            ) : (
              ""
            )}
            {status !== "ban" && status !== "admin" && status !== "user" && (
              <div>
                <b>Host : </b>
                {status}
              </div>
            )}
          </Box>
        </Dialog>
      </Fragment>
    );
  }
}

const ImageBox = styled.div`
  margin-left: 50px;
`;

const Box = styled(Paper)`
  width: 450px;
  height: 600px;
  font-family: Arial, Helvetica, sans-serif;
`;

const BanImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  left: -7%;
  border: solid red 5px;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  left: -7%;
  border: solid darkturquoise 5px;
`;

const ReportBody = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Detail = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: white;
`;

const Content = styled.span`
  margin-left: 10px;
  margin-top: 10px;
  float: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

const ReportImage = styled.img`
  min-width: 30px;
  min-height: 30px;
  max-width: 150px;
  max-height: 150px;
  float: left;
`;

const CardBox = styled.div`
  margin-bottom: 20px;
`;

const mapStateToProps = (state) => ({
  userData: state.data.userData,
});

export default connect(mapStateToProps, { getUserData })(Report);
