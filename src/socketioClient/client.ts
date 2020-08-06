//restApplication as a clinet websocketClinet


export class wsClient {
  private static _instance: wsClient;
  public socket: any;
  constructor() {
    this.connect();
  }
  static getInstance(): wsClient {
    if (!this._instance) {
      this._instance = new wsClient();

    }
    return this._instance;
  }

  connect(): void {

    this.socket = require('socket.io-client')('http://192.168.88.101:3000/chats/2?uid=asd');
    this.socket.on('connect', function () {
      console.log('wsclient connect')
    });
    this.socket.on('test', function (data: any) {
      console.log(data)
    });
    this.socket.on('disconnect', function () {
      console.log('wsclient disconnect')
    });
  }
  // getSocket() {
  //   return this.socket;
  // }

}
