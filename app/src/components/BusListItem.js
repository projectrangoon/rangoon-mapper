import React, { Component } from 'react';

class BusServiceListItem extends Component {
  componentWillMount() {
    this.state = {
      isToggled: false,
    };
  }

  renderServiceName(serviceName) {
    // all this trouble just to decode a HTML entity
    const parser = new DOMParser();
    const dom = parser.parseFromString(
      '<!doctype html><body>' + serviceName,
      'text/html');
    return dom.body.textContent;
  }

  handleClick = (e, serviceNo) => {
    e.preventDefault();
    if (this.props.onSelectItem) {
      this.props.onSelectItem(serviceNo);
    }
  }

  handleToggleLine = (e, serviceNo) => {
    e.preventDefault();
    this.setState({ isToggled: !this.state.isToggled });
    if (this.props.onToggle) {
      this.props.onToggle(serviceNo);
    }
  }

  render() {
    const isToggledClass = this.state.isToggled ? 'selected' : '';
    return (
      <li className={isToggledClass} onClick={e => this.handleToggleLine(e, this.props.serviceNo)}>
        <span
          className="logo"
          style={{ backgroundColor: this.props.color }}
        >
          {this.props.serviceNo}
        </span>
        <span className="myanmar service-name">
          {this.renderServiceName(this.props.service_name)}
        </span>
        <i
          className="material-icons"
          onClick={e => this.handleClick(e, this.props.serviceNo)}
        >
          forward
        </i>
      </li>
    );
  }
}

export default BusServiceListItem;
