'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NavProgressBar = () => {
  return (
    <ProgressBar 
    height="5px"
    color="#000000"
    options={{ showSpinner: false }}
    shallowRouting />
  );
};

export default NavProgressBar;
