import { createStore } from 'redux';
import initReducers from '../reducers';

const initStore = () => {
  const innitialStore = {};

  return createStore(
    initReducers,
    innitialStore,
  );
};

export default initStore;
