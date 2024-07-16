import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { EnvironmentService } from '../services/env/env.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private webSocket: Socket;

  constructor(private envService: EnvironmentService) {
    const wsUrl = this.envService.get('WS_URL');
    this.webSocket = io(`${wsUrl}`);
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

  public onStartGame(callback: (data: any) => void) {
    this.webSocket.once('startGame', callback);
  }

  public startGame(data: any) {
    this.webSocket.emit('startGame', data);
  }
}
