import React from 'react';

import WebGLMap from '../../containers/webglmap';
import WebGLMapSidebar  from '../../containers/webglmapsidebar';

const BusScreen = (props) => (
  <div className="row">
    <main className="col-sm-12 col-md-10 map">
      <WebGLMap {...props} />
    </main>

    <aside className="col-sm-12 col-md-2 right-sidebar">
      <WebGLMapSidebar {...props} />
    </aside>
  </div>
);

export default BusScreen;
