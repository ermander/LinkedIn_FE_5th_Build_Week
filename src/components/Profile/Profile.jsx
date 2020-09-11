import React, { Component } from "react";
import Footer from "../Footer";
import MainJumbotron from "./MainJumbotron";
import SideBar from "./SideBar";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import NavBar from "../NavBar";
import Experiences from "./Experiences";
//import axios from "axios";
import axios from "../HOC/http";

import { Link, withRouter } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "../../styles/ProfilePage.css";

const BASE_URL = "http://localhost:3002";

class Profile extends Component {
  state = {
    users: [],
    user: {
      experiences: [],
    },
    show: false,
    searchKey: "",
    loading: true,
    name: "",
  };

  componentDidMount = async () => {
    this.fetchData();
  };

  fetchData = async () => {
    // 1) mi prendo i miei dati => axiox.get (user / ) <= prenderlo dall'url!!!!
    const usersData = await axios.get(`${BASE_URL}/user`);
    // 2) fetchare le exp
    const currentUserData = await axios.get(
      `${BASE_URL}/user/${this.props.match.params.id}`
    );

    this.setState({
      // experiences: expData,
      users: usersData.data,
      user: currentUserData.data,
      loading: false,
    });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchData();
    }
  };

  // async fetchExperience() {
  //   let experience = {
  //     method: "GET",
  //     url: `http://localhost:3002/profile/${this.state.username}/experience`,
  //     headers: {
  //       Authorization: "Basic " + btoa("user7:3UU5dYFvenRuRP7E"),
  //     },
  //   };
  //   let users = {
  //     method: "GET",
  //     url: `http://localhost:3002/profile/`,
  //     headers: {
  //       Authorization: "Basic " + btoa("user7:3UU5dYFvenRuRP7E"),
  //     },
  //   };
  //   let experiences = await axios(experience);
  //   let experiencesData = experiences.data;
  //   experiencesData.forEach((experience) => {
  //     if (experience.image) {
  //       const base64 = this.bufferToBase64(experience.image.data);
  //       experience.image = base64;
  //     }
  //   });
  //   let usersData = await axios(users);
  //   this.setState({
  //     experiences: experiencesData,
  //     users: usersData.data,
  //     loading: false,
  //   });
  // }
  render() {
    return (
      <>
        <NavBar />
        {this.state.loading ? (
          <div id="loadingAnimation">
            <img src="https://i.stack.imgur.com/h6viz.gif" alt="" />
          </div>
        ) : (
          <Container className="mt-5 pt-3">
            <Row>
              <Col className="col-8">
                <MainJumbotron />
                <div id="experiences">
                  <div id="header">
                    <p>Experience</p>
                    {this.state.username === "user1" && (
                      <Link to="/addExperience">
                        <FaPlus />
                      </Link>
                    )}
                  </div>
                  {this.state.user.experiences.map((element) => {
                    console.log(element);
                    return (
                      <Experiences
                        user={this.state.username}
                        id={element._id}
                        currentUser={element.username}
                        image={element.image}
                        role={element.role}
                        company={element.company}
                        startDate={element.startDate}
                      />
                    );
                  })}
                </div>
              </Col>
              <SideBar />
            </Row>
            <Footer />
          </Container>
        )}
      </>
    );
  }
}

export default withRouter(Profile);
