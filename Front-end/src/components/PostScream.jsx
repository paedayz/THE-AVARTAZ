import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { postScream } from "../redux/actions/dataAction";

// Redux stuff
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// MUI stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// Icons

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postScream({ body: this.state.body }, this.props.current_room);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, errors: "" });
  };

  render() {
    const { errors } = this.state;
    const {
      UI: { loading },
      status,
    } = this.props;
    return (
      <Fragment>
        <IconButton onClick={this.handleOpen}>
          {status === "ban" ? null : (
            <AddIcon style={{ color: "white", fontSize: "35px" }} />
          )}
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <IconButton onClick={this.handleClose}>
            <Close />
          </IconButton>
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                lable="SCREAM!!"
                multiline
                rows="3"
                placeholder="add your scream"
                error={errors.body ? true : false}
                onChange={this.handleChange}
                fullWidth
              />
              <Submit
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                submit
                {loading && <CircularProgress size={30} />}
              </Submit>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const Submit = styled(Button)`
  margin-top: 40px;
`;

const Close = styled(CloseIcon)`
  position: relative;
  left: 45%;
  margin-top: 10;
`;

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  current_room: state.data.current_room,
  status: state.user.status,
});

export default connect(mapStateToProps, { postScream })(withRouter(PostScream));
