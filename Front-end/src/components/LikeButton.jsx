import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataAction";

// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import IconButton from "@material-ui/core/IconButton";

class LikeButton extends Component {
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
    this.props.unlikeScream(this.props.screamId);
  };

  // Function that make you unlike scream
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  render() {
    const {
      scream: { likeCount },
      user: { authenticated },
    } = this.props;

    const likeButton = !authenticated ? (
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
    return (
      <Fragment>
        {likeButton}

        <Like>{likeCount} Likes</Like>
      </Fragment>
    );
  }
}

const Like = styled.span`
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
`;

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  scream: state.data.scream,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
