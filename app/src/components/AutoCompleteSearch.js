import React, { Component } from 'react';
import _ from 'lodash';
import TextField from 'material-ui/TextField';

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
      currentSelectedBusMenuLi: 0,
      source,
      value: this.props.defaultStop ? `${this.props.defaultStop.name_en} (${this.props.defaultStop.name_mm})` : '',
      typingTimer: 0,
      doneTypingInterval: 300,
      id,
    });
  }

  resetComponent = () => this.setState({
    isLoading: false,
    results: [],
    currentSelectedBusMenuLi: 0,
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

  handleKeyDown = (e) => {
    const { currentSelectedBusMenuLi, results } = this.state;
    clearTimeout(this.state.typingTimer);
    // When Key down
    if (e.keyCode === 40) {
      e.preventDefault();
      if (currentSelectedBusMenuLi === results.length - 1) {
        this.setState({
          currentSelectedBusMenuLi: 0,
        });
      } else {
        this.setState({
          currentSelectedBusMenuLi: currentSelectedBusMenuLi + 1,
        });
      }
    } else if (e.keyCode === 38) { // When key up
      e.preventDefault();
      if (currentSelectedBusMenuLi === 0) {
        this.setState({
          currentSelectedBusMenuLi: results.length - 1,
        });
      } else {
        this.setState({
          currentSelectedBusMenuLi: currentSelectedBusMenuLi - 1,
        });
      }
    } else if (e.keyCode === 13) { // On Enter
      this.handleResultSelect(e, results[currentSelectedBusMenuLi]);
    }
  }

  searchBusStops = () => {
    const sortByEngName =
      (result) => {
        result.name_en.toLowerCase().startsWith(this.state.value.toLowerCase());
      };

    const results =
      (_.sortBy(searchBusStops(this.state.source, this.state.value), sortByEngName)).reverse();

    return this.setState({
      isLoading: false,
      results,
    });
  }

  handleResultSelect = (e, payload) => {
    e.preventDefault();
    this.setState({
      value: `${payload.name_en} (${payload.name_mm})`,
      results: [],
    });
    if (this.props.onSelect) {
      this.props.onSelect(payload);
    }
  }

  handleUpdateInput = (value) => {
    this.setState({
      value,
    });
  };

  handleLiMouseEnter = (index) => {
    this.setState({
      currentSelectedBusMenuLi: index,
    });
  }

  render() {
    const { results, value, id, currentSelectedBusMenuLi } = this.state;

    return (
      <div className="form-group">
        <TextField
          hintText="Type Bustop name to search..."
          floatingLabelText={this.props.placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          value={value}
          key={id}
          fullWidth
        />
        <div className="busmenu-wrapper">
          <ul className="busmenu">
            {results.map((r, i) => (
              <li
                key={r.bus_stop_id}
                onMouseEnter={() => this.handleLiMouseEnter(i)}
                className={currentSelectedBusMenuLi === i ? 'selected' : null}
              >
                <a href="" onClick={e => this.handleResultSelect(e, r)}>
                  <strong>{`${r.name_en} - ${r.name_mm}`}</strong>
                  <small>{`${r.road_en} - ${r.road_mm}`}</small>
                </a>
              </li>
              ))
            }
          </ul>
        </div>
      </div>
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
        /* <label className="sr-only" htmlFor={id}>From</label>
        <input
          value={value}
          type="text"
          id={id}
          className="form-control"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
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
        </ul>*/
        /* <Paper
          style={{
            display: 'inline-block',
            float: 'left',
            width: '100%',
          }}
        >
          <Menu>
            {results.map(r =>
              <MenuItem
                key={r.bus_stop_id}
                primaryText={`${r.name_en} - ${r.name_mm}`}
                leftIcon={<MapsPlace />}
              />,
            )}
          </Menu>
        </Paper>*/
