import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import graph from '../../experiment/adjancencyList.json';
import { adjacencyListLoaded } from './actions/map';
import './App.css';
// import { distance } from './utils';

class App extends Component {
  componentWillMount() {
    this.props.loadGraph();
  }
  render() {
    return (
      <Row type="flex" className="app">
        <Col xs={24} md={18}>
          <main className="map">
            {this.props.main}
          </main>
        </Col>
        <Col xs={24} md={6}>
          <aside className="sidebar">
            {this.props.sidebar}
          </aside>
        </Col>
      </Row>
    );
  }
}

App.propTypes = {
  main: React.PropTypes.element.isRequired,
  sidebar: React.PropTypes.element.isRequired,
  loadGraph: React.PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  loadGraph: () => dispatch(adjacencyListLoaded(graph)),
});

const mapStateToProps = () => ({

});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
