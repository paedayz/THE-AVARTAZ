import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styled from "styled-components";
import { uploadImage } from "../redux/actions/userAction";

// Component
import EditDetails from "../components/EditDetails";

// MUI stuff
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

class Profile extends Component {
  state = {
    random: null,
  };

  componentDidMount() {
    const num = Math.round(Math.random() * 1000000000000).toString();
    this.setState({ random: num });
  }

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      user: {
        credentials: {
          avatarName,
          createdAt,
          avatarImage,
          bio,
          website,
          location,
          status,
        },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
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

            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={this.handleImageChange}
            />
            <IconButton onClick={this.handleEditPicture}>
              <EditIcon color="primary" />
            </IconButton>
          </ImageBox>

          <p>
            <b>Welcome</b> {avatarName}
          </p>
          <p>
            <b>Joined</b> {dayjs(createdAt).format("MMM YYYY")}
          </p>
          {bio ? (
            <div>
              <p>
                <b>bio</b> {bio}
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

          <EditDetails />
          {status === "ban" && (
            <BanText>
              Sorry, You are Baned <br /> Because:{" "}
              {this.props.user.banDetail.cause} <br /> You will Release{" "}
              {dayjs(this.props.user.banDetail.release).fromNow()} <br /> By
              Avartaz Admin
            </BanText>
          )}
          {status !== "ban" && status !== "admin" && status !== "user" && (
            <div>
              <b>Host : </b>
              {status}
            </div>
          )}
          {status === "admin" && (
            <Button
              component={Link}
              to={`/admin/${avatarName}/${this.state.random}`}
              variant="contained"
              color="inherit"
            >
              Admin
            </Button>
          )}
        </Box>
      ) : (
        <p>Bye</p>
      )
    ) : (
      <div>
        <p>Still loading</p>
        <CircularProgress />
      </div>
    );

    return profileMarkup;
  }
}

const BanText = styled.h3`
  color: red;
`;

const ImageBox = styled.div`
  margin-left: 50px;
`;

const Box = styled(Paper)`
  width: 450px;
  height: 600px;
  font-family: Arial, Helvetica, sans-serif;
`;

const HostImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid blue 10px;
  border-style: double;
`;

const AdminImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid black 10px;
  border-style: double;
`;

const BanImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid red 5px;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: solid darkturquoise 5px;
`;

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionToProps = {
  uploadImage,
};

Profile.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(Profile));
