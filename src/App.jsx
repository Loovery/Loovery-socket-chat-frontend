import React, { Component } from 'react';
import { Provider } from 'react-redux';
import initStore from './utils/store';
import Chat from './components/Chat.jsx';

export default class App extends Component {
  render() {
    return (
      <Provider store={ initStore() }>
        <Chat />
      </Provider>
    );
  }
}
