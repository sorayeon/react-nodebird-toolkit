import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from '../reducers';

function getServerState() {
  return typeof document !== 'undefined'
    ? JSON.parse(document.querySelector('#__NEXT_DATA__').textContent)?.props.pageProps.initialState
    : undefined;
}
const serverState = getServerState();

export default configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
  preloadedState: serverState, // SSR
});
