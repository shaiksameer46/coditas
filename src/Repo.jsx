import React, { Component } from "react";
class Repo extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="panel panel-default panelstyle">
          <table className="table table-dark">
            <thead>
              <tr>
                <th style={{ color: "yellow" }}>Repository Name</th>
                <th style={{ color: "yellow" }}>Repository language</th>
              </tr>
            </thead>
            <tbody>
              {this.props.repos.map(repo => (
                <tr key={repo.id}>
                  <td>
                    <p>{repo.name}</p>
                  </td>
                  <td>
                    <p>{repo.language}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Repo;
