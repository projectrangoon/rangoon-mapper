import React, { Component } from 'react'; 
import _ from 'lodash';
import Input from 'antd/lib/input';

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
        value: payload.name_mm,
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
    }, 500)
  }

  render() {
    const { value, results } = this.state

    return (
        <div style={{minHeight:'35vh'}}>
            <Input
                style={{borderRadius:0,height:'3.5em'}}
                onChange={this.handleSearchChange}
                value={value}
                placeholder={this.props.placeholder}
            />
            <ul style={{maxHeight:'30vh', overflow:'scroll'}}>
            {results.map(r => 
                <li onClick={() => this.handleResultSelect(r)} key={r.bus_stop_id}>{r.name_mm}</li>
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