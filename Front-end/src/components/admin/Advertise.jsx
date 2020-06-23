import React, { Component, Fragment } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Redux
import { connect } from "react-redux";
import {
  acceptAdvertise,
  deleteAdvertise,
} from "../../redux/actions/adminAction";

// MUI stuff
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

export class Advertise extends Component {
  deleteAds = () => {
    this.props.deleteAdvertise(this.props.advertise.advertiseId);
  };

  acceptAds = () => {
    this.props.acceptAdvertise(this.props.advertise.advertiseId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      avatarName,
      description,
      accept,
      createdAt,
      advertiseImage,
    } = this.props.advertise;

    // FULL version of advertise data
    // const {
    //   avatarImage,
    //   avatarName,
    //   description,
    //   lineId,
    //   contact,
    //   accept,
    //   createdAt,
    //   advertiseId,
    //   advertiseImage,
    // } = this.props.advertise;

    const showAds = () => {
      window.open(advertiseImage);
    };
    return (
      <Fragment>
        <CardBox>
          <Card elevation={5}>
            <Image
              src={advertiseImage}
              style={{ cursor: "pointer" }}
              onClick={() => showAds()}
            />
            <Content>
              <Detail>
                From : {avatarName} ------ {dayjs(createdAt).fromNow()}
              </Detail>
              <ReportBody>{description}</ReportBody>

              <Detail />
              {accept === false && (
                <Fragment>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.acceptAds}
                  >
                    Accept
                  </Button>
                </Fragment>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={this.deleteAds}
              >
                Delete
              </Button>
            </Content>
          </Card>
        </CardBox>
      </Fragment>
    );
  }
}

const ReportBody = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Detail = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: gray;
`;

const Content = styled.span`
  margin-left: 10px;
  margin-top: 10px;
  float: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

const Image = styled.img`
  max-width: 150px;
  max-height: 150px;
  float: left;
`;

const CardBox = styled.div`
  margin-bottom: 20px;
`;

export default connect(null, { acceptAdvertise, deleteAdvertise })(Advertise);
