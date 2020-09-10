import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MyNetworkProfiles from "./MyNetworkProfiles";
import "../../styles/MyNetwork.css";
import NavBar from "../NavBar";
import authAxios from "../HOC/http";

class MyNetwork extends React.Component {
  state = {
    data: [],
  };
  bufferToBase64(buf) {
    var binstr = Array.prototype.map
      .call(buf, function (ch) {
        return String.fromCharCode(ch);
      })
      .join("");
    return btoa(binstr);
  }

  componentDidMount = async () => {
    const resp = await authAxios.get(`http://localhost:3002/user/`);
    console.log(resp);

    this.setState({ data: resp.data });
  };

  render() {
    return (
      <Container className="networkContainer">
        <Row>
          <NavBar />
          <Col className="col-12 myNetworkUsersCol">
            <Row className="row-cols-6">
              {this.state.data.map(function (data, i) {
                return <MyNetworkProfiles data={data} key={i} />;
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MyNetwork;
