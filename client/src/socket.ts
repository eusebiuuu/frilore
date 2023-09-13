import { io } from 'socket.io-client';

export const socket = io(`${window.location.origin.toString()}`, {
  autoConnect: false,
});

export const notificationsSocket = io(`${window.location.origin.toString()}/notification`, {
  autoConnect: false,
});