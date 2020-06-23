import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

class Comments extends Component {
  render() {
    const { comments } = this.props;

    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, avatarImage, avatarName } = comment;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
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
                    </Content>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && <Line />}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

const Line = styled.hr`
  border-bottom: 1px solid gray;
  width: 100%;
`;

const Content = styled.div`
  padding: 25;
  margin-left: 30px;
  margin-top: 20px;

  object-fit: cover;
  text-align: left;
`;

const Image = styled.img`
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
`;

export default Comments;
