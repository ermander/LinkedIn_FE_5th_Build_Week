import React from "react";
import { Col, Image } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import PageViewer from "./PageViewer";
import authAxios from "../HOC/http";

class SideBar extends React.Component {
  state = {
    data: [],
    mainUser: "user1",
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
    console.log(this.state.data.slice(0, 6));
    return (
      <Col className="col-4 sideBar">
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>Edit public profile & URL</span>
            <FaQuestionCircle />
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <span>Add profile in another language</span>
            <FaQuestionCircle />
          </div>
        </div>
        <div className="banerContainer">
          <Image
            src="https://blog.academyoflearning.com/wp-content/uploads/2017/09/linkedin-gif.gif"
            style={{ width: 100 + "%" }}
          />
        </div>
        <div className="mt-4">
          <h2>People Also Viewed</h2>
          <ul>
            {this.state.data.slice(0, 10).map(function (data, i) {
              return <PageViewer data={data} key={i} />;
            })}
          </ul>
        </div>
      </Col>
    );
  }
}

export default SideBar;
