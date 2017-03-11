import React from 'react';

import WebGLMap from '../../containers/WebGLMap';
import BusServicesSidebar from '../../containers/BusServicesSidebar';

const BusScreen = (props) => (
  <div className="row">
    <main className="col-sm-12 col-md-9 map">
      <WebGLMap {...props} />
    </main>

    <aside className="col-sm-12 col-md-3 right-sidebar">
      <BusServicesSidebar {...props} />
    </aside>
  </div>
);

export default BusScreen;
