import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private webSocket: Socket;

  constructor() {
    this.webSocket = io(`ws://localhost:3000`);
  }

  public findMatch(data: any) {
    this.webSocket.emit('findMatch', data);
  }

  public sendSignal(data: any) {
    this.webSocket.emit('sendSignal', data);
  }

  public leaveRoom(data: any) {
    this.webSocket.emit('leaveRoom', data);
  }

  public onSignal(callback: (data: any) => void) {
    this.webSocket.on('signal', callback);
  }

  public onDisconnect(callback: (data: any) => void) {
    this.webSocket.once('disconnect', callback);
  }

  public onJoinedRoom(callback: (data: any) => void) {
    this.webSocket.once('joinedRoom', callback);
  }

  public onMatchFound(callback: (data: any) => void) {
    this.webSocket.once('matchFound', callback);
  }

  public onDestroyRoom(callback: (data: any) => void) {
    this.webSocket.once('destroyRoom', callback);
  }
}
