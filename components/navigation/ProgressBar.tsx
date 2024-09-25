'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import '../../app/globals.css';

const NavProgressBar = () => {
  return (
    <ProgressBar 
    options={{ showSpinner: false }}
    shallowRouting />
  );
};

export default NavProgressBar;
