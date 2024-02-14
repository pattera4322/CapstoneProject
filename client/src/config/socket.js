import { Manager, io } from 'socket.io-client';

//export const socket = io('http://localhost:5001');

const manager = new Manager(process.env.REACT_APP_SOCKET_BASE_URL, {
    path: '/sj1-socket/',
    forceNew: true,
    transports: ['websocket']
  })

export const socketJobProgress = manager.socket('/sockets/job-progress')