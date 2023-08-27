import { io } from 'socket.io-client';

/*
export const socket = io(window.location.href, {
  autoConnect: false,
});
*/

// change to messageSocket

export const socket = io('http://localhost:8000', {
  autoConnect: false,
});

export const notificationsSocket = io('http://localhost:8000/notification', {
  autoConnect: false,
});