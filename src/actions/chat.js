export const SEND_MESSAGE = '@@message/SEND_MESSAGE';
export const TYPING_TEXT = '@@message/TYPING_TEXT';

export const showOnScreen = text => ({
  type: SEND_MESSAGE,
  text,
});

export const sendMessage = (socket, text) => {
  socket.emit('message', { text });

  return ({
    type: SEND_MESSAGE,
    text,
  });
};

export const typing = (socket, isOn) => {
  socket.emit('typing', { isOn });

  return ({
    type: TYPING_TEXT,
  });
};
