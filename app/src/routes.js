import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import HomePage from './containers/pages/HomePage';
import PageNotFound from './components/PageNotFound';

module.exports = (
    <Route
        path="/"
        component={App}
    >
        <IndexRoute component={HomePage} />
        <Route
            path="*"
            component={PageNotFound}
        />
    </Route>
)