import React, { Component } from 'react';

class BusServiceListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    }
  }

  renderServiceName(serviceName) {
    // all this trouble just to decode a HTML entity
    const parser = new DOMParser();
    const dom = parser.parseFromString(
      '<!doctype html><body>' + serviceName,
      'text/html');
    return dom.body.textContent;
  }

  render() {
    const isSelectedClass = this.state.isSelected ? 'selected' : '';
    return (
      <li className={isSelectedClass} onClick={this.props.onClick}>
        <span
          className="logo"
          style={{ backgroundColor: this.props.color }}
        >
        { this.props.serviceNo }
        </span>
        <span
          className="myanmar service-name"
        >
          {this.renderServiceName(this.props.service_name)}
        </span>
      </li>
    );
  }
}

export default BusServiceListItem;
