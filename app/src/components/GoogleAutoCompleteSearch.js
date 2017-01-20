import React from 'react';
import ReactDOM from 'react-dom';
import Input from 'antd/lib/input';

export default class AutoCompleteSearch extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    onPlacesChanged: React.PropTypes.func,
  }
  componentDidMount() {
    const { name } = this.props;
    const searchInput = ReactDOM.findDOMNode(this.refs[name]);
    this.searchBox = new window.google.maps.places.SearchBox(searchInput);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    this.searchBox.removeListener('places_changed', this.onPlacesChanged);
  }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }
  render() {
    const { name, className, placeholder } = this.props;
    return <Input ref={name} className={className} placeholder={placeholder} size="large" />;
  }
}
