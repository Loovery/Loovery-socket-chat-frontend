import update from 'react-addons-update';
import { SEND_MESSAGE } from '../actions/chat';

const initialStore = {
  messages: ['test', 'test2'],
};

export default function messageReducer(store = initialStore, action) {
  const actions = {
    [SEND_MESSAGE]: () => {
      return update(store, {
        messages: {
          $push: [action.text],
        },
      });
    },
  };

  if (actions[action.type]) {
    return actions[action.type]();
  }
  return store;
}
