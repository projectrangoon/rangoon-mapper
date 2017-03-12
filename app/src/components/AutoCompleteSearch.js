import React, { Component } from 'react';
import { uniqueId, sortBy } from 'lodash';
import TextField from 'material-ui/TextField';
import { orange300, grey500, grey700 } from 'material-ui/styles/colors';

import { searchBusStops } from '../utils';

const styles = {
  underlineStyle: {
    borderColor: grey700,
  },
  underlineFocusStyle: {
    borderColor: orange300,
  },
  floatingLabelStyle: {
    color: orange300,
  },
  floatingLabelFocusStyle: {
    color: orange300,
  },
  hintStyle: {
    color: grey500,
  },
};

class AutoCompleteSearch extends Component {
  constructor(props) {
    super(props);
    const id = uniqueId();
    const source = [];
    this.props.source.forEach((obj) => {
      const found = source.some(el => el.bus_stop_id === obj.bus_stop_id);
      if (!found) { source.push(obj); }
    });
    this.state = {
      currentSelectedBusMenuLi: 0,
      source,
      value: this.props.defaultValue || '',
      typingTimer: 0,
      doneTypingInterval: 300,
      isLoading: false,
      isSelected: false,
      inputFocus: true,
      id,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.defaultValue,
    });
    if (nextProps.defaultValue !== this.state.value) {
      this.setState({
        results: [],
      });
    }
  }

  resetComponent = () => {
    this.setState({
      isLoading: false,
      isSelected: false,
      results: [],
      currentSelectedBusMenuLi: 0,
      value: '',
    });
    if (this.props.onChange) {
      this.props.onChange(null);
    }
  }

  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    this.setState({
      value: e.target.value,
      currentSelectedBusMenuLi: 0,
    });
  }

  handleKeyUp = () => {
    clearTimeout(this.state.typingTimer);
    if (this.state.value) {
      this.setState({
        typingTimer: setTimeout(this.searchBusStops, this.state.doneTypingInterval),
        isLoading: true,
      });
    } else {
      this.resetComponent();
      if (this.props.onSelect) {
        this.props.onSelect(null);
      }
    }
  }

  scrollIntoView = (li, ul) => {
    if (li.getBoundingClientRect().top > ul.clientHeight * 1.3 ||
      li.getBoundingClientRect().top < 110) {
      li.scrollIntoView();
    }
  }

  handleKeyDown = (e) => {
    const { currentSelectedBusMenuLi, results, value } = this.state;
    clearTimeout(this.state.typingTimer);

    switch (e.keyCode) {
      case 40: // Key down
        if (currentSelectedBusMenuLi === results.length - 1) {
          this.setState({
            currentSelectedBusMenuLi: results.length - 1,
          }, () => {
            const li =
              this.refs[this.state.currentSelectedBusMenuLi]; // eslint-disable-line 
            const ul = this.resultUl;
            this.scrollIntoView(li, ul);
          });
        } else {
          this.setState({
            currentSelectedBusMenuLi: currentSelectedBusMenuLi + 1,
          }, () => {
            const li =
              this.refs[this.state.currentSelectedBusMenuLi]; // eslint-disable-line 
            const ul = this.resultUl;
            this.scrollIntoView(li, ul);
          });
        }
        break;
      case 38: // key up
        if (currentSelectedBusMenuLi === 0) {
          this.setState({
            currentSelectedBusMenuLi: 0,
          }, () => {
            const li =
              this.refs[this.state.currentSelectedBusMenuLi]; // eslint-disable-line 
            const ul = this.resultUl;
            this.scrollIntoView(li, ul);
          });
        } else {
          this.setState({
            currentSelectedBusMenuLi: currentSelectedBusMenuLi - 1,
          }, () => {
            const li =
              this.refs[this.state.currentSelectedBusMenuLi]; // eslint-disable-line 
            const ul = this.resultUl;
            this.scrollIntoView(li, ul);
          });
        }
        break;
      case 13: // enter key
        if (value) {
          this.handleResultSelect(e, results[currentSelectedBusMenuLi]);
        }
        break;
      default:
        break;
    }
  }

  searchBusStops = () => {
    const sortByEngName =
      (result) => {
        result.name_en.toLowerCase().startsWith(this.props.defaultValue.toLowerCase());
      };

    const results =
      (sortBy(searchBusStops(this.state.source, this.props.defaultValue), sortByEngName)).reverse();

    return this.setState({
      isLoading: false,
      results,
    });
  }

  handleResultSelect = (e, payload) => {
    e.preventDefault();
    this.setState({
      value: `${payload.name_en} ${payload.name_mm}`,
      results: [],
      isSelected: true,
    });
    if (this.props.onSelect) {
      this.props.onSelect(payload);
    }
    if (this.props.onChange) {
      this.props.onChange(`${payload.name_en} ${payload.name_mm}`);
    }
  }

  removeInput = (e) => {
    e.preventDefault();
    this.resetComponent();
    if (this.props.onSelect) {
      this.props.onSelect(null);
    }
    if (this.props.onChange) {
      this.props.onChange(null);
    }
  }

  handleLiMouseEnter = (index) => {
    this.setState({
      currentSelectedBusMenuLi: index,
    });
  }

  handleFocus = () => {
    this.setState({
      inputFocus: true,
    });
  }

  render() {
    const {
      results,
      value,
      id,
      currentSelectedBusMenuLi,
      isLoading,
      isSelected,
    } = this.state;

    return (
      <div className="form-group to-from">
        <TextField
          hintText="Name of the bus stop"
          floatingLabelText={this.props.placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}
          value={value}
          key={id}
          fullWidth
          hintStyle={styles.hintStyle}
          underlineStyle={styles.underlineStyle}
          underlineFocusStyle={styles.underlineFocusStyle}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
        {value ? (
          <a tabIndex="-1" href="" onClick={this.removeInput}>
            <i className="material-icons">clear</i>
          </a>
        ) : (
          null
        )}
        {results && results.length > 0 ? (
          <div>
            <ul className="busmenu" ref={(resultUl) => { this.resultUl = resultUl; }}>
              {results.map((r, i) => (
                <li
                  key={r.bus_stop_id}
                  onMouseEnter={() => this.handleLiMouseEnter(i)}
                  className={currentSelectedBusMenuLi === i ? 'selected' : null}
                  ref={i}
                >
                  <a href="" onClick={e => this.handleResultSelect(e, r)}>
                    <strong>{r.name_en} - <span className="myanmar">{r.name_mm}</span></strong>
                    <small>{r.road_en} - <span className="myanmar">{r.road_mm}</span></small>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          ) : (
            <ul className="busmenu">
              {value && !isLoading && !isSelected ? (
                null // disable for now
              ) : (
                null
              )}
            </ul>
          )}

        <div />

      </div>
    );
  }
}


AutoCompleteSearch.defaultProps = {
  defaultValue: null,
};

AutoCompleteSearch.propTypes = {
  source: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  placeholder: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string,
};

export default AutoCompleteSearch;

/* <li>
  <a href="" onClick={e => e.preventDefault()}>
    <strong>{`No stops found with that name '${value}'`}</strong>
  </a>
</li>*/
