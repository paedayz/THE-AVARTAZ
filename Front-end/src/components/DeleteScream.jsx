import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// MUI stuff
import DeleteButton from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

// Redux
import { connect } from "react-redux";
import { deleteScream } from "../redux/actions/dataAction";

class DeleteScream extends Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.setState({ open: false });
    setTimeout(function () {
      //Start the timer
      window.location.reload(false);
    }, 1000);
  };

  render() {
    return (
      <Fragment>
        <IconButton title="Delete" onClick={this.handleOpen}>
          <DeleteButton />
        </IconButton>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete this scream ?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={this.deleteScream}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
};

export default connect(null, { deleteScream })(DeleteScream);
