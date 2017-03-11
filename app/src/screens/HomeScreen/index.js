import React from 'react';

import Map from '../../containers/Map';
import Sidebar from '../../containers/Sidebar';


const HomeScreen = (props) => (
    <div className="row">
      <aside className="col-sm-12 col-md-3 sidebar">
        <Sidebar { ...props } />
      </aside>

      <main className="col-sm-12 map">
        <Map { ...props } />
      </main>
    </div>
);

export default HomeScreen;
