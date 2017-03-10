import React from 'react';

import WebGLMap from '../../containers/webglmap';
import WebGLMapSidebar  from '../../containers/webglmapsidebar';

const BusScreen = (props) => (
  <div className="row">
    <main className="col-sm-12 col-md-9 map">
      <WebGLMap {...props} />
    </main>

    <aside className="col-sm-12 col-md-3 right-sidebar">
      <WebGLMapSidebar {...props} />
    </aside>
  </div>
);

export default BusScreen;
