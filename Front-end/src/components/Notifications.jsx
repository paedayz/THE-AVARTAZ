import React, { Component, Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styled from "styled-components";
import PropTypes from "prop-types";
import history from "../util/history";

// MUI stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../redux/actions/userAction";

class Notifications extends Component {
  state = {
    anchorEl: null,
  };

  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };

  watchNotification = (room, screamId) => {
    history.push(`/room/${room}/scream/${screamId}`);
    window.location.reload(false);
    this.props.markNotificationsRead(screamId);
  };

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="secondary"
              style={{ marginTop: "9px" }}
            >
              <NotificationsIcon style={{ color: "white" }} />
            </Badge>
          ))
        : (notificationsIcon = (
            <NotificationsIcon style={{ color: "white", marginTop: "9px" }} />
          ));
    } else {
      notificationsIcon = (
        <NotificationsIcon style={{ color: "white", marginTop: "9px" }} />
      );
    }

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const verb = not.type === "like" ? "liked" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const room = not.room;
          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.createdAt}>
              {icon}
              <Typography
                color="inherit"
                variant="body1"
                onClick={() => this.watchNotification(not.room, not.screamId)}
              >
                <Text color="red">{not.sender}</Text> {verb} your scream in{" "}
                <Text color="red">{room} room </Text>
                {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );

    return (
      <Fragment>
        <div aria-haspopup="true" onClick={this.handleOpen}>
          {notificationsIcon}
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onClick={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

const Text = styled.span`
  color: ${(props) => props.color};
`;

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
