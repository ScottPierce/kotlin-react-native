/// <reference types="node" />
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
declare type WebsocketProxyOnConnectionHandler = (socket: WebSocket, request: IncomingMessage) => void;
export declare type WebSocketProxy = {
    onConnection(handler: WebsocketProxyOnConnectionHandler): void;
};
/**
 * Proxy connection from single WebSocketServer by given path.
 */
export default function createWebSocketProxy(webSocketServer: WebSocket.Server, path: string): WebSocketProxy;
export {};
//# sourceMappingURL=websocketProxy.d.ts.map