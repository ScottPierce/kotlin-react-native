/// <reference types="node" />
import _WebSocket from 'ws';
import { Assign } from 'utility-types';
import { WebSocketProxy } from './websocketProxy';
import Runtime from '../runtime/Runtime';
import { IncomingMessage } from 'http';
declare type WebSocket = Assign<_WebSocket, {
    onerror?: _WebSocket['onerror'];
    onclose?: _WebSocket['onclose'];
    onmessage?: _WebSocket['onmessage'];
}>;
/**
 * Websocket proxy between debugger and React Native client
 */
export default class WebsocketDebuggerProxy {
    private runtime;
    debuggerSocket: WebSocket | undefined;
    clientSocket: WebSocket | undefined;
    constructor(runtime: Runtime, webSocketProxy: WebSocketProxy);
    send(socket: WebSocket, message: string): void;
    /**
     * Called everytime new WebSocket connection is established. Each specifies
     * `role` param, which we use to determine type of connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
    /**
     * Debugger socket handler
     *
     * Note: When debugger is already connected, new connection gets
     * closed automatically
     */
    handleDebuggerSocket(socket: WebSocket): void;
    /**
     * Client socket handler
     *
     * Note: New client automatically closes previous client connection
     */
    handleClientSocket(socket: WebSocket): void;
    isDebuggerConnected(): boolean;
}
export {};
//# sourceMappingURL=WebSocketDebuggerProxy.d.ts.map