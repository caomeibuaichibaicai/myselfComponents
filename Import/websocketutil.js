const WebSocketUtil = {
  constructor: function (userId, callBack) {
    this.websocket = null;
    this.userId = userId;
    this.callBack = callBack;
  },

  createConWebSocket: function () {
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://192.168.1.31/api/websocket/websocket/superAdmin');
    } else {
      alert('Not support websocket!');
      return
    }
    //发生错误时的回调函数
    this.websocket.onerror = this.callBack.onerror;
    //链接成功时的回调函数
    this.websocket.onopen = this.connectSuccess;
    //接受消息时的回调函数
    this.websocket.onmessage = this.callBack.onmessage
  },
  closeWebsocket: function () {
    this.websocket.close();
  },
  connectSuccess: function () {
    console.log(this.userId + ': connect success!');
  }
};

export default WebSocketUtil
