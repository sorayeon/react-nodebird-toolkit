import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';

import store from '../store/configureStore';

const App = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>NodeBird</title>
    </Head>
    <Component {...pageProps} />
  </Provider>
);
App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any.isRequired,
};
// redux, saga 설정
export default App;
