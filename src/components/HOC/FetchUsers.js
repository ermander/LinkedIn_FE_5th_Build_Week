import React from "react";
import axios from "axios";

function userData(WrappedComponent) {
  return class PP extends React.Component {
    state = {
      users: [],
    };
    componentDidMount() {
      this.fetchUsers();
    }
    async fetchUsers() {
      let usersData = {
        method: "GET",
        url: `http://localhost:3002/user`,
      };
      let users = await axios(usersData);
      this.setState({ users: users.data }, () => console.log(this.state.users));
    }
    render() {
      return <WrappedComponent users={this.state.users} />;
    }
  };
}
export default userData;
