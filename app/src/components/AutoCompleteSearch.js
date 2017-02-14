import React, { Component } from 'react';
import _ from 'lodash';

import { searchBusStops } from '../utils';

class AutoCompleteSearch extends Component {
  componentWillMount() {
    const id = _.uniqueId();
    const source = [];
    this.props.source.forEach((obj) => {
      const found = source.some(el => el.bus_stop_id === obj.bus_stop_id);
      if (!found) { source.push(obj); }
    });
    this.resetComponent();
    this.setState({
      source,
      value: this.props.defaultStop ? `(${this.props.defaultStop.name_en} - ${this.props.defaultStop.name_mm}) (${this.props.defaultStop.road_en} - ${this.props.defaultStop.road_mm})` : '',
      typingTimer: 0,
      doneTypingInterval: 300,
      id,
    });
  }

  resetComponent = () => this.setState({
    isLoading: false,
    results: [],
    value: '',
  })

  handleChange = (e) => {
    this.setState({
      isLoading: true,
      value: e.target.value,
    });
  }

  handleKeyUp = () => {
    clearTimeout(this.state.typingTimer);
    if (this.state.value) {
      this.setState({
        typingTimer: setTimeout(this.searchBusStops, this.state.doneTypingInterval),
      });
    } else {
      this.resetComponent();
    }
  }

  handleKeyDown = () => {
    clearTimeout(this.state.typingTimer);
  }

  searchBusStops = () => {
    const sortByEngName =
      result => result.name_en.toLowerCase().startsWith(this.state.value.toLowerCase());

    return this.setState({
      isLoading: false,
      results:
      (_.sortBy(searchBusStops(this.state.source, this.state.value), sortByEngName)).reverse(),
    });
  }

  handleResultSelect = (e, payload) => {
    e.preventDefault();
    this.setState({
      value: `(${payload.name_en} - ${payload.name_mm}) (${payload.road_en} - ${payload.road_mm})`,
      results: [],
    });
    if (this.props.onSelect) {
      this.props.onSelect(payload);
    }
  }

  render() {
    const { value, results, id } = this.state;

    return (
      <form>
        <div className="form-group">
          <label className="sr-only" htmlFor={id}>From</label>
          <input
            value={value}
            type="text"
            id={id}
            className="form-control"
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
          />
          <ul className="bus-menu">
            {results.map(r =>
              <li key={r.bus_stop_id}>
                <a href="" onClick={e => this.handleResultSelect(e, r)}>
                  <strong>{`${r.name_en} - ${r.name_mm}`}</strong>
                  <small>{`${r.road_en} - ${r.road_mm}`}</small>
                </a>
              </li>,
            )}
          </ul>
        </div>
      </form>
    );
  }
}

AutoCompleteSearch.defaultProps = {
  defaultStop: null,
};

AutoCompleteSearch.propTypes = {
  source: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  placeholder: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  defaultStop: React.PropTypes.object,
};

export default AutoCompleteSearch;
