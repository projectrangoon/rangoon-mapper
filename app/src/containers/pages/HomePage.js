import React from 'react';

import Map from '../map';
import SideBar from '../sidebar';
import GetMeSomewhereModal from '../modals/GetMeSomewhereModal';

const HomePage = () => (
    <div>
        <Map />
        <SideBar />
        <GetMeSomewhereModal />
    </div>
);

export default HomePage;