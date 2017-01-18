import React, { Component } from 'react';
import _ from 'lodash';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';

import { isEnglish } from '../utils';

class AutoCompleteSearch extends Component {
  componentWillMount() {
    const source = [];
    this.props.source.forEach(obj => {
        let found = source.some(el => {
            return el.bus_stop_id === obj.bus_stop_id;
        })
        if (!found) { source.push(obj) }
    })
    this.resetComponent();
    this.setState({ source });
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (payload) => {
    this.setState({
        value: isEnglish.test(this.state.value) ? payload.name_en + ` (${payload.road_en})` : payload.name_mm +  ` (${payload.road_mm})`,
        results: []
    })
    if (this.props.onSelect) {
        this.props.onSelect(payload);
    }
  }

  handleSearchChange = (e) => {
    this.setState({ isLoading: true, value: e.target.value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.name_en) || re.test(result.name_mm)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })
    }, 100)
  }

  render() {
    const { value, results } = this.state

    return (
        <div>
            <Input
                style={{borderRadius:0,height:'3.5em'}}
                onChange={this.handleSearchChange}
                value={value}
                placeholder={this.props.placeholder}
            />
            <ul className="bus-menu">
                {results.map(r =>
                <li key={r.bus_stop_id}>
                    <a onClick={() => this.handleResultSelect(r)}>
                        <Icon type="environment-o" />
                        <strong>{isEnglish.test(value) ? r.name_en : r.name_mm}</strong>
                        <small>{isEnglish.test(value) ? r.road_en : r.road_mm}</small>
                    </a>
                </li>
                )}
            </ul>
        </div>
    )
  }
}

AutoCompleteSearch.propTypes = {
    source: React.PropTypes.array.isRequired,
}

export default AutoCompleteSearch;