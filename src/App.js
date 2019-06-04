import React, { Component } from "react";
import "./App.css";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
//import Dropdownbar from "./Dropdownbar";
//import { Route, Switch, Link} from 'react-router-dom';

class App extends Component {
  state = {
    username: "",
    users: [],
    repos: [],
    toggle: false,
    currentPage: 1,
    todosPerPage: 10
  };

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit = async event => {
    event.preventDefault();
    const query = this.state.username;
    const { data: users } = await axios.get(
      "https://api.github.com/search/users?q=" + query
    );
    this.setState({ users: users.items });
    this.setState({ username: "" });
    this.setState({ details: "Details" });
    this.setState({ repos: "" });
  };

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  handleChange = event => {
    this.setState({ username: event.target.value });
  };

  repodetails = async search => {
    const { data: repos } = await axios.get(
      "https://api.github.com/users/" + search + "/repos"
    );
    this.setState({ repos });
    console.log(this.state.repos[0].owner.login);
    this.setState(state => ({
      toggle: !state.toggle
    }));
  };

  sortasc = data => {
    function sortOn(property) {
      var sortOrder = 1;

      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }

      return function(a, b) {
        if (sortOrder === -1) {
          return b[property].localeCompare(a[property]);
        } else {
          return a[property].localeCompare(b[property]);
        }
      };
    }
    const info = data.sort(sortOn("login"));
    this.setState({ users: info });
  };

  sortdsc = data => {
    function sortOn(property) {
      var sortOrder = 1;

      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }

      return function(a, b) {
        if (sortOrder === -1) {
          return b[property].localeCompare(a[property]);
        } else {
          return a[property].localeCompare(b[property]);
        }
      };
    }
    const info = data.sort(sortOn("-login"));
    this.setState({ users: info });
  };

  render() {
    const { currentPage, todosPerPage, users } = this.state;

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = users.slice(indexOfFirstTodo, indexOfLastTodo);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(users.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li>
          <button
            className="btn btn-small"
            key={number}
            id={number}
            onClick={this.handleClick}
          >
            {number}
          </button>
        </li>
      );
    });

    return (
      <React.Fragment>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark container mt-1">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <Dropdown className="dropdownstyle">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Sort By Name
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={this.sortasc.bind(this, this.state.users)}
                  >
                    Name A-Z
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={this.sortdsc.bind(this, this.state.users)}
                  >
                    Name Z-A
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ul>
            <form
              onSubmit={this.handleSubmit}
              className="form-inline my-2 my-lg-0 formstyle"
            >
              <input
                className="form-control mr-sm-2"
                id="search"
                type="text"
                autoComplete="off"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="Enter user name"
              />
              <button
                type="submit"
                className="btn btn-outline-success my-2 my-sm-0"
              >
                search
              </button>
            </form>
          </div>
        </nav>

        {this.state.users.length
          ? currentTodos.map(user => (
              <div className="template jumbotron">
                <div>
                  <img
                    src={user.avatar_url}
                    className="iconDetails rounded-circle"
                    alt="not found git_image"
                  />
                </div>
                <div className="styleplate">
                  <h2>{user.login}</h2>
                  <h5>Profile : {user.html_url}</h5>
                  <button
                    className="buttonstyle btn btn-primary"
                    onClick={this.repodetails.bind(this, user.login)}
                  >
                    {this.state.toggle ? "Collapse" : "Details"}
                  </button>
                  <p className="valuestyle">Data one : Value one</p>
                  <p className="valuestyle">Data two : Value two</p>
                </div>
                {this.state.repos.length ? (
                  <div className="panel panel-default panelstyle">
                    <table className="table table-dark">
                      {this.state.repos.map(repo =>
                        this.state.toggle &&
                        repo.owner.login === user.login ? (
                          <tbody>
                            <tr key={repo.id}>
                              <td>
                                <p>{repo.name}</p>
                              </td>
                              <td>
                                <p>{repo.language}</p>
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          ""
                        )
                      )}
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))
          : ""}
        <div className="col xs-6-push layout">
          <ul className="pagination">{renderPageNumbers}</ul>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
