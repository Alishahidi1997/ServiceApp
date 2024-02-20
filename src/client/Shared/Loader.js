import React from 'react';
import PropagateLoader
  from 'react-spinners/PropagateLoader';

export default () => (
  <div className="parentDisable" width="100%">
    <div className="overlay-box">
      <PropagateLoader
        // css={override}
        sizeUnit="px"
        size={25}
        color="white"
        loading
      />
    </div>
  </div>
);
