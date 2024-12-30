import { ChatMessage } from '../types/chat';
import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

type MessageHandler = (message: ChatMessage) => void;
type ConnectionHandler = () => void;

export class WebSocketService {
  private stompClient: Client | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private subscription: StompSubscription | null = null;

  constructor(private baseUrl: string = 'http://localhost:8080/ws/chat') {}

  connect(sessionId: number, token: string) {
    console.log('Attempting to connect WebSocket...', { sessionId, baseUrl: this.baseUrl });
    
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.baseUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP: ', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket Connected with frame:', frame);
      this.connectionHandlers.forEach(handler => handler());

      if (this.stompClient) {
        console.log(`Subscribing to /topic/chat/${sessionId}`);
        this.subscription = this.stompClient.subscribe(
          `/topic/chat/${sessionId}`,
          (message) => {
            console.log('Received message:', message);
            try {
              const response = JSON.parse(message.body);
              this.messageHandlers.forEach(handler => handler(response));
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }
        );
      }
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers.delete(handler);
  }

  addConnectionHandler(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
  }

  removeConnectionHandler(handler: ConnectionHandler) {
    this.connectionHandlers.delete(handler);
  }
}

export const wsService = new WebSocketService(); 