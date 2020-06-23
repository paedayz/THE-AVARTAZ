import React, { Component, Fragment } from "react";

// Redux
import { connect } from "react-redux";
import {
  setHostStatus,
  deleteHost,
  addRoom,
  deleteRoom,
} from "../../redux/actions/adminAction";

// MUI stuff
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class FunctionBtn extends Component {
  state = {
    anchorEl: null,
    openSetHost: false,
    openDeleteHost: false,
    openAddRoom: false,
    openDeleteRoom: false,
    avatarName: "",
    status: "",
    roomName: "",
    description: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleFunctionBtnClose = () => {
    this.setState({ anchorEl: null });
  };

  SetHostOpen = () => {
    this.setState({ openSetHost: true });
    this.handleFunctionBtnClose();
  };

  SetHostSubmit = () => {
    this.handleClickClose();
    this.props.setHostStatus(this.state.avatarName, {
      status: this.state.status,
    });
  };

  DeleteHostOpen = () => {
    this.setState({ openDeleteHost: true });
    this.handleFunctionBtnClose();
  };

  DeleteHostSubmit = () => {
    this.handleClickClose();
    this.props.deleteHost(this.state.status);
  };

  AddRoomOpen = () => {
    this.setState({ openAddRoom: true });
    this.handleFunctionBtnClose();
  };

  AddRoomSubmit = () => {
    this.handleClickClose();
    this.props.addRoom({
      roomName: this.state.roomName,
      description: this.state.description,
    });
  };

  DeleteRoomOpen = () => {
    this.setState({ openDeleteRoom: true });
    this.handleFunctionBtnClose();
  };

  DeleteRoomSubmit = () => {
    this.handleClickClose();
    this.props.deleteRoom(this.state.roomName);
  };

  handleClickClose = () => {
    this.setState({ openSetHost: false });
    this.setState({ status: "" });
    this.setState({ avatarName: "" });
    this.setState({ roomName: "" });
    this.setState({ description: "" });
    this.setState({ openDeleteHost: false });
    this.setState({ openAddRoom: "" });
    this.setState({ openDeleteRoom: false });
  };

  render() {
    return (
      <Fragment>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          variant="contained"
          color="primary"
        >
          Host <br />
          functions
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleFunctionBtnClose}
        >
          <MenuItem onClick={this.SetHostOpen}>Set Host</MenuItem>
          <MenuItem onClick={this.DeleteHostOpen}>Delete Host</MenuItem>
          <MenuItem onClick={this.AddRoomOpen}>Add Room</MenuItem>
          <MenuItem onClick={this.DeleteRoomOpen}>Delete Room</MenuItem>
        </Menu>

        {/* SET HOST */}

        <Dialog
          open={this.state.openSetHost}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClickClose}
        >
          <DialogTitle>{"Set Host"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Avatar Name"
              type="text"
              fullWidth
              name="avatarName"
              value={this.state.avatarName}
              onChange={this.handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Status"
              type="text"
              fullWidth
              name="status"
              value={this.state.status}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClickClose}
              color="secondary"
              variant="contained"
            >
              Cancle
            </Button>
            <Button
              onClick={this.SetHostSubmit}
              color="primary"
              variant="contained"
            >
              submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE HOST */}

        <Dialog
          open={this.state.openDeleteHost}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClickClose}
        >
          <DialogTitle>{"Delete Host"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Status"
              type="text"
              fullWidth
              name="status"
              value={this.state.status}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClickClose}
              color="secondary"
              variant="contained"
            >
              Cancle
            </Button>
            <Button
              onClick={this.DeleteHostSubmit}
              color="primary"
              variant="contained"
            >
              submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add room */}

        <Dialog
          open={this.state.openAddRoom}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClickClose}
        >
          <DialogTitle>{"Add Room"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Room Name"
              type="text"
              fullWidth
              name="roomName"
              value={this.state.roomName}
              onChange={this.handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClickClose}
              color="secondary"
              variant="contained"
            >
              Cancle
            </Button>
            <Button
              onClick={this.AddRoomSubmit}
              color="primary"
              variant="contained"
            >
              submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE ROOM */}

        <Dialog
          open={this.state.openDeleteRoom}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClickClose}
        >
          <DialogTitle>{"Delete Host"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Room Name"
              type="text"
              fullWidth
              name="roomName"
              value={this.state.roomName}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClickClose}
              color="secondary"
              variant="contained"
            >
              Cancle
            </Button>
            <Button
              onClick={this.DeleteRoomSubmit}
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

const mapActionsToProps = {
  setHostStatus,
  deleteHost,
  addRoom,
  deleteRoom,
};

export default connect(null, mapActionsToProps)(FunctionBtn);
