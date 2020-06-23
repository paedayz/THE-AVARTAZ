import React, { Component } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styled from "styled-components";
import PropTypes from "prop-types";
import DeleteScream from "./DeleteScream";
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataAction";
import ScreamDialog from "./ScreamDialog";
import Report from "./ReportEdit";
import ProfileDialog from "./ProfileDialog";

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Typography } from "@material-ui/core";

// Icons
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import RoomIcon from "@material-ui/icons/Room";
import ChatIcon from "@material-ui/icons/Chat";

class Scream extends Component {
  state = {
    open: false,
  };

  // Check if you already like this scream
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.scream.screamId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Function that make you like scream
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId);
  };

  // Function that make you unlike scream
  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      scream: {
        body,
        createdAt,
        avatarImage,
        avatarName,
        roomName,
        screamId,
        likeCount,
        commentCount,
      },
      user: { authenticated, credentials, status },
      current_room,
    } = this.props;

    const likeButton =
      !authenticated || status === "ban" ? (
        <IconButton title="Like">
          <FavoriteBorder color="primary" />
        </IconButton>
      ) : this.likedScream() ? (
        <IconButton title="Unlike" onClick={this.unlikeScream}>
          <FavoriteIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton title="Like" onClick={this.likeScream}>
          <FavoriteBorder color="primary" />
        </IconButton>
      );

    const deleteButton =
      (authenticated && avatarName === credentials.avatarName) ||
      status === "admin" ||
      status === current_room ? (
        <DeleteScream screamId={screamId} />
      ) : null;

    // const scream = this.props.scream
    return (
      <CardBox elevation={5}>
        {authenticated && status !== "ban" ? (
          <ProfileDialog avatarName={avatarName} avatarImage={avatarImage} />
        ) : (
          <Image image={avatarImage} title="Profile image" />
        )}

        <Content>
          <Delete>
            {authenticated && status !== "ban" && (
              <ReportButton title="Report Scream">
                <Report screamId={screamId} avatarName={avatarName} />
              </ReportButton>
            )}
            {deleteButton}
          </Delete>
          <Typography variant="h6" color="primary">
            {avatarName}
          </Typography>

          <Post>
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "25px" }}>
              {body}
            </Typography>
          </Post>
          {likeButton}
          <Like>{likeCount} Likes</Like>

          {authenticated && status !== "ban" ? (
            <ScreamDialog
              screamId={screamId}
              avatarName={avatarName}
              openDialog={this.props.openDialog}
            />
          ) : (
            <IconButton title="Comment">
              <ChatIcon color="primary" />
            </IconButton>
          )}
          <Like>{commentCount} Comments</Like>
          <From>
            <RoomIcon color="primary" /> <Room>{roomName} room</Room>
          </From>
        </Content>
      </CardBox>
    );
  }
}

const ReportButton = styled.span`
  margin-left: 5px;
`;

const Delete = styled.div`
  margin-left: 350px;
`;

const Post = styled.div`
  margin-top: 15px;
  margin-bottom: 25px;
`;

const Like = styled.span`
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
`;

const From = styled.span`
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  margin-left: 20px;
  color: gray;
`;

const Room = styled.span`
  color: black;
`;

const Image = styled(CardMedia)`
  min-width: 200px;
  min-height: 200px;
`;
const CardBox = styled(Card)`
  display: flex;
  margin: 10px;
`;
const Content = styled(CardContent)`
  padding: 25;
  object-fit: cover;
  text-align: left;
`;

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
  current_room: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  current_room: state.data.current_room,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(mapStateToProps, mapActionsToProps)(Scream);
