import {createStore, compose, applyMiddleware} from 'redux';
import {persistState} from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import thunk from 'redux-thunk'

const enhancer = compose(
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&#]+)\b/
    )
  ),
  applyMiddleware(thunk)
);

export default function configureStore() {
  const store = createStore(rootReducer, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
