import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var initialCenter = { lng: -90.1056957, lat: 29.9717272 }

ReactDOM.render(
  <App initialCenter={initialCenter} />,
  document.getElementById('root')
);
