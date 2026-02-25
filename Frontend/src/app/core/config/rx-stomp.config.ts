import { RxStompConfig } from '@stomp/rx-stomp';

export const rxStompConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:8080/ws', // or wss:// in production

  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  reconnectDelay: 500,

  connectionTimeout: 10000,

  debug: (msg: string) => {
    console.log(new Date(), '[STOMP]', msg);
  },

  beforeConnect: () => {
    console.log('[STOMP] Attempting connection...');
  },
};
