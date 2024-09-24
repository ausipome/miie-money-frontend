"use client"; // Ensure this runs on the client

import NextNProgress from 'nextjs-progressbar';
/* globals.css */
import 'nprogress/nprogress.css'; /* Import nprogress CSS */

const ProgressBar = () => {
  return (
    <NextNProgress
      color="#29d"          // Customize color
      startPosition={0.3}   // Customize start position
      stopDelayMs={200}     // Delay to stop the bar for smooth experience
      height={400}            // Height of the progress bar
      showOnShallow={true}  // Show progress bar even when navigating shallow routes
    />
  );
};

export default ProgressBar;
