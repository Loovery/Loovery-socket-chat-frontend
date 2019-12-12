import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import Message from './Message';
import { showOnScreen, sendMessage, typing } from '../actions/chat';

let socket;

const SOCKET_SERVER = 'http://localhost:3005';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      isTyping: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    socket = io.connect(SOCKET_SERVER);

    socket.on('typing', res => {
      const { isTyping } = this.state;
      const { showOnScreen } = this.props;

      // Тут закралась ошибка, если пользователь удалит сообщение, а потом снова начнёт писать,
      // то он снова увидит что пользователь печатает. Поэтому лучше вынести в другую область данный статус, а не показывать как сообщение
      if (!isTyping && res.isOn) {
        showOnScreen('Пользователь печатает');
        this.setState({ isTyping: true });
      } else {
        this.setState({ isTyping: isTyping && res.isOn });
      }
    });

    socket.on('message', res => {
      const { showOnScreen } = this.props;

      showOnScreen(res.text);
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleSendMessage() {
    const { input } = this.state;
    const { sendMessage, typing } = this.props;

    sendMessage(socket, input);
    typing(socket, false);
    this.setState({ input: '' });
  }

  handleKeyUp() {
    const { input } = this.state;
    const { typing } = this.props;

    if (input.length > 0) {
      typing(socket, true);
    }
  }

  render() {
    const {
      messages,
    } = this.props;

    const { input } = this.state;

    const messageElements = messages.map(text => (
      <Message
        key={text}
        text={text}
      />
    ));

    return (
      <>
        {messageElements}
        <input
          onChange={this.handleChange}
          onKeyUp={event => (event.key === 'Enter' ? this.handleSendMessage() : this.handleKeyUp())}
          value={input}
        />
      </>
    );
  }
}

Chat.propTypes = {
  messages: PropTypes.array.isRequired,
  sendMessage: PropTypes.func,
  typing: PropTypes.func,
};

Chat.defaultProps = {
  messages: [],
};

const mapStateToProps = ({ messageReducer }) => ({
  messages: messageReducer.messages,
});

const mapDispatchToProps = dispatch => bindActionCreators({ showOnScreen, sendMessage, typing }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
