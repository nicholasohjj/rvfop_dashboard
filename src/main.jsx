import React from 'react'
import ReactDOM from 'react-dom/client'
import original from 'react95/dist/themes/original';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {  styleReset } from 'react95';
import App from './App';
import { H } from 'highlight.run';
import { ErrorBoundary } from '@highlight-run/react';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

H.init('ng2xnjpd', {
	serviceName: "frontend-app",
	tracingOrigins: true,
	networkRecording: {
		enabled: true,
		recordHeadersAndBody: true,
		urlBlocklist: [
			// insert full or partial urls that you don't want to record here
			// Out of the box, Highlight will not record these URLs (they can be safely removed):
			"https://www.googleapis.com/identitytoolkit",
			"https://securetoken.googleapis.com",
		],
	},
});



ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
      <GlobalStyles />
      <ThemeProvider theme={original}>
    <App /> 
  </ThemeProvider>
  </React.StrictMode>,
)
