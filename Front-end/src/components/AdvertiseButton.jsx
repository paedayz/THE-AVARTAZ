import React, { Component, Fragment } from "react";

//Redux
import { connect } from "react-redux";
import { addAdvertise } from "../redux/actions/userAction";

//MUI Stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AdvertiseButton extends Component {
  state = {
    open: false,
    description: "",
    lineId: "",
    contact: "",
    formData: new FormData(),
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];
    this.state.formData.append("image", image, image.name);
  };

  handleSubmit = () => {
    this.props.addAdvertise(this.state.formData, {
      description: this.state.description,
      lineId: this.state.lineId,
      contact: this.state.contact,
    });
    this.handleClose();
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.setState({ description: "" });
    this.setState({ lineId: "" });
    this.setState({ contact: "" });
  };
  render() {
    return (
      <Fragment>
        <Button variant="contained" color="primary" onClick={this.handleOpen}>
          Add Avertise
        </Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Add your advertise"}
          </DialogTitle>
          <span
            style={{ textAlign: "left", marginLeft: "28px", color: "gray" }}
          >
            Advertise Image
          </span>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              type="file"
              fullWidth
              onChange={this.handleImageChange}
              placeholder="Advertise Image"
            />

            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              label="LineId"
              type="text"
              fullWidth
              name="lineId"
              value={this.state.lineId}
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              label="Contact"
              type="text"
              fullWidth
              name="contact"
              value={this.state.contact}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="contained"
              color="secondary"
            >
              Cancle
            </Button>
            <Button
              onClick={this.handleSubmit}
              variant="contained"
              color="primary"
            >
              submit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect(null, { addAdvertise })(AdvertiseButton);
