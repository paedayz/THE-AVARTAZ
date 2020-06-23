import React, { Component } from "react";
import PropTypes from "prop-types";
import { submitReport } from "../redux/actions/dataAction";

// Redux stuff
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// MUI stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// icon stuff
import ReportButton from "@material-ui/icons/Report";

export class Report extends Component {
  state = {
    body: "",
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitReport(this.props.screamId, {
      body: this.state.body,
      room: this.props.currentRoom,
    });
    this.handleClose();
  };

  render() {
    return (
      <span>
        <IconButton onClick={this.handleOpen}>
          <ReportButton color="secondary" />
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Report</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="body"
                type="text"
                label="Report detail"
                multiline
                rows="3"
                placeholder="Please tell us why you want to report"
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              variant="contained"
              color="primary"
            >
              SUBMIT
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

Report.propTypes = {
  submitReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentRoom: state.data.current_room,
});

export default connect(mapStateToProps, { submitReport })(withRouter(Report));
