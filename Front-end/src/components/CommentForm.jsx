import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Redux stuff
import { connect } from "react-redux";
import { submitComment } from "../redux/actions/dataAction";

//MUI stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

class CommentForm extends Component {
  state = {
    body: "",
    errors: "",
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
        body: "",
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: " " });
      console.log(this.state.body);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { authenticated } = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on scream"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", marginBottom: "15px" }}
          >
            Submit
          </Button>
        </form>
        <Line />
      </Grid>
    ) : null;

    return commentFormMarkup;
  }
}

const Line = styled.hr`
  border-bottom: 1px solid whitesmoke;
  width: 100%;
`;

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { submitComment })(CommentForm);
