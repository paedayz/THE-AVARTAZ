import React, { Component, Fragment } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataAction";
import { reportUser } from "../redux/actions/userAction";

// MUI stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

class ProfileDialog extends Component {
  state = {
    open: false,
    openReport: false,
    avatarName: this.props.avatarName,
    body: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleClickClose = () => {
    this.setState({ open: false });
  };

  handleReportOpen = () => {
    this.setState({ openReport: true });
    this.handleClickClose();
  };

  handleReportClose = () => {
    this.setState({ openReport: false });
  };

  handleSubmitReport = () => {
    this.props.reportUser(this.props.userData.avatarName, {
      body: this.state.body,
    });
    this.handleReportClose();
  };

  render() {
    const showProfile = () => {
      this.setState({ open: true });
      this.props.getUserData(this.state.avatarName);
    };
    const {
      status,
      avatarImage,
      createdAt,
      bio,
      website,
      location,
      avatarName,
    } = this.props.userData;
    return (
      <Fragment>
        <ProfilePic
          image={this.props.avatarImage}
          title="Profile image"
          onClick={() => showProfile()}
        />

        {/* User Profile */}

        <Dialog open={this.state.open} onClose={this.handleClickClose}>
          <Box elevation={10}>
            <br />
            <ImageBox>
              {status === "ban" ? (
                <BanImage src={avatarImage} />
              ) : status === "admin" ? (
                <AdminImage src={avatarImage} />
              ) : status !== "user" ? (
                <HostImage src={avatarImage} />
              ) : (
                <Image src={avatarImage} />
              )}
            </ImageBox>

            <p>
              <b>Hi! I'm </b> {avatarName}
            </p>
            <p>
              <b>Joined</b> {dayjs(createdAt).format("MMM YYYY")}
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
                <br />
              </div>
            )}

            {status !== "ban" && (
              <Button
                style={{ marginTop: "1rem" }}
                onClick={this.handleReportOpen}
                variant="contained"
                color="secondary"
              >
                Report
              </Button>
            )}
          </Box>
        </Dialog>

        {/* Report User */}

        <Dialog
          open={this.state.openReport}
          keepMounted
          onClose={this.handleReportClose}
        >
          <DialogTitle>{"Report This User"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Why"
              type="text"
              fullWidth
              name="body"
              value={this.state.body}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleReportClose}
              color="secondary"
              variant="contained"
            >
              Cancle
            </Button>
            <Button
              onClick={this.handleSubmitReport}
              color="primary"
              variant="contained"
            >
              submit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const HostImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid blue 10px;
  border-style: double;
  position: relative;
  left: -7%;
`;

const AdminImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid black 10px;
  border-style: double;
  position: relative;
  left: -7%;
`;

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

const ProfilePic = styled(CardMedia)`
  min-width: 200px;
  min-height: 200px;
  cursor: pointer;
`;

const mapStateToProps = (state) => ({
  userData: state.data.userData,
});

export default connect(mapStateToProps, { getUserData, reportUser })(
  ProfileDialog
);
