import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// MUI stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

// Redux
import { connect } from "react-redux";
import { banUser } from "../../redux/actions/adminAction";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class BanFuncBtn extends Component {
  state = {
    open: false,
    avatarName: "",
    cause: "",
    release: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    this.props.banUser(this.state.avatarName, {
      cause: this.state.cause,
      release: this.state.release,
    });
    this.handleClickClose();
  };

  handleClick = () => {
    this.setState({ open: true });
  };
  handleClickClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Fragment>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          variant="contained"
          color="secondary"
        >
          Ban User
        </Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClickClose}
        >
          <DialogTitle>{"Ban User"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Avatar name"
              type="text"
              fullWidth
              name="avatarName"
              value={this.state.avatarName}
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              label="Why"
              type="text"
              fullWidth
              name="cause"
              value={this.state.cause}
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              label="When user Release"
              type="text"
              fullWidth
              name="release"
              placeholder="example: year,month,day"
              value={this.state.release}
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
              onClick={this.handleSubmit}
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

BanFuncBtn.propTypes = {
  banUser: PropTypes.func.isRequired,
};

export default connect(null, { banUser })(BanFuncBtn);
