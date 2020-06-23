import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

// Redux stuff
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getScream } from "../redux/actions/dataAction";

// MUI stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icon
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
      console.log("Open Dialog");
    }
  }

  handleOpen = () => {
    const { screamId, current_room } = this.props;
    let oldPath = `/room/${current_room}`;
    console.log(oldPath);

    const newPath = `/room/${current_room}/scream/${screamId}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, newPath, oldPath });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false, errors: "" });
  };

  render() {
    const {
      scream: {
        screamId,
        body,
        createdAt,
        commentCount,
        avatarName,
        avatarImage,
        comments,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <CircularProgress size={60} />
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <Image src={avatarImage} alt="Profile" />
        </Grid>
        <Grid item sm={7}>
          <Content>
            <Typography
              component={Link}
              color="primary"
              to={`/users/${avatarName}`}
            >
              {avatarName}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant="body1">{body}</Typography>
            <LikeButton screamId={screamId} />
            <IconButton>
              <ChatIcon color="primary" />
            </IconButton>
            <span>{commentCount} Comments</span>
          </Content>
        </Grid>
        <Line />
        <CommentForm screamId={screamId} />
        {comments && <Comments comments={comments} />}
      </Grid>
    );
    return (
      <Fragment>
        <IconButton title="Comment" onClick={this.handleOpen}>
          <ChatIcon color="primary" />
        </IconButton>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="sm"
          fullWidth
        >
          <Close>
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </Close>
          <DialogContent>{dialogMarkup}</DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const Line = styled.hr`
  border-bottom: 1px solid rgba(0, 0, 0, 1);
  width: 100%;
`;

const Content = styled.div`
  padding: 25;
  margin-left: 30px;

  object-fit: cover;
  text-align: left;
`;

const Close = styled.span`
  position: absolute;
  left: 90%;
`;

const Image = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 50%;
`;

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  avatarName: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
  current_room: state.data.current_room,
});

const mapActionsToProps = {
  getScream,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withRouter(ScreamDialog));
