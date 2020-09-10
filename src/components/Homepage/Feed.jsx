import React, { Component } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import Posts from "./Posts";
import "../../styles/HomePage.css";
import FetchPosts from "../HOC/FetchPosts";
import authAxios from "../HOC/http";

const BASE_URL = "http://localhost:3002";

class Feed extends Component {
  state = {
    posts: [],
    numberOfPosts: "",
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
    const usersData = await authAxios.get(`${BASE_URL}/user`);

    const currentUserData = await authAxios.get(
      `${BASE_URL}/user/${this.props.match.params.id}`
    );

    this.setState({
      // experiences: expData,
      users: usersData.data,
      user: currentUserData.data,
      loading: false,
    });
  };
  //

  /*
  componentDidUpdate = async (prevState) => {
    if (this.state.numberOfPosts !== prevState.numberOfPosts) {
      let refetch = await fetch("https://be-linkedin.herokuapp.com/posts");
      let posts = refetch.json();
      this.setState({ posts, loading: false });
    }
  };
*/
  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Container id="feed" fluid>
        <Row>
          <hr></hr>
          {this.state.loading ? (
            <div
              className="col col-12 d-flex justify-content-center"
              id="loadingAnimation"
            >
              <img src="https://i.stack.imgur.com/h6viz.gif" alt="" />
            </div>
          ) : (
            this.state.posts.map((element, i) => {
              return (
                <Posts
                  user={this.state.username}
                  delPost={this.props.deletePost}
                  post={element}
                  key={i}
                />
              );
            })
          )}
        </Row>
      </Container>
    );
  }
}

export default Feed;
