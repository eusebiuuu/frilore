import { Server } from 'socket.io';
import { messageNamespaceLogic } from './messageNamespace.js';
import { notificationNamespaceLogic } from './notificationNamespaceLogic.js';

export function socketLogic(server) {
  const io = new Server(server);

  io.on('error', (err) => {
    console.log('Error: ', err);
  })

  messageNamespaceLogic(io);

  notificationNamespaceLogic(io);
}