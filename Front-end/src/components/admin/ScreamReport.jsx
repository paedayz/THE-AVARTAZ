import React, { Component, Fragment } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

// MUI stuff
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

export class Report extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      screamId,
      from,
      reportDetail,
      createdAt,
      room,
      image,
    } = this.props.report;
    return (
      <Fragment>
        <CardBox>
          <Card
            style={{
              borderRadius: "5%",
              padding: "40px",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            elevation={5}
          >
            <Image src={image} />
            <Content>
              <Detail>
                From : {from} ------ {dayjs(createdAt).fromNow()}
              </Detail>
              <ReportBody>{reportDetail}</ReportBody>
              <Detail>{room} room</Detail>
              <Button
                component={Link}
                to={`/room/${room}/scream/${screamId}`}
                variant="contained"
                size="small"
                color="secondary"
              >
                Scream
              </Button>
              <Detail />
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
  color: white;
`;

const Content = styled.span`
  margin-left: 10px;
  margin-top: 10px;
  float: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;

const Image = styled.img`
  min-width: 30px;
  min-height: 30px;
  max-width: 150px;
  max-height: 150px;
  float: left;
`;

const CardBox = styled.div`
  margin-bottom: 20px;
`;

export default Report;
