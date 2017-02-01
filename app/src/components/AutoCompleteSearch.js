import React, { Component } from 'react';
import _ from 'lodash';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';

import { isEnglish } from '../utils';

class AutoCompleteSearch extends Component {
  componentWillMount() {
    const source = [];
    this.props.source.forEach((obj) => {
      const found = source.some(el => el.bus_stop_id === obj.bus_stop_id);
      if (!found) { source.push(obj); }
    });
    this.resetComponent();
    this.setState({ source });
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
    setTimeout(this.searchBusStops, 500);
  }

  searchBusStops = () => {
    if (this.state.value.length < 1) return this.resetComponent();
    const mmPattern = new RegExp(_.escapeRegExp(this.state.value), 'i');
    const engPattern = new RegExp(this.state.value.replace(/(\S+)/g, s => `\\b(${s})(.*)`).replace(/\s+/g, ''), 'gi');

    const isMatch = (result) => {
      if (isEnglish(this.state.value)) {
        return engPattern.test(result.name_en);
      }
      return mmPattern.test(result.name_mm);
    };
    const sorted = (result) => {
      if (isEnglish(this.state.value)) {
        return result.name_en.toLowerCase().startsWith(this.state.value.toLowerCase());
      }
      return result.name_mm.toLowerCase().startsWith(this.state.value.toLowerCase());
    };

    return this.setState({
      isLoading: false,
      results: _.sortBy(_.filter(this.state.source, isMatch), sorted),
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
    const { value, results } = this.state;

    return (
      <div>
        <Input
          style={{ borderRadius: 0, height: '3.5em' }}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          value={value}
          placeholder={this.props.placeholder}
        />
        <ul className="bus-menu">
          {results.reverse().map(r =>
            <li key={r.bus_stop_id}>
              <a href="" onClick={e => this.handleResultSelect(e, r)}>
                <Icon type="environment-o" />
                <strong>{`${r.name_en} - ${r.name_mm}`}</strong>
                <small>{`${r.road_en} - ${r.road_mm}`}</small>
              </a>
            </li>,
          )}
        </ul>
      </div>
    );
  }
}

AutoCompleteSearch.propTypes = {
  source: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  placeholder: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default AutoCompleteSearch;
