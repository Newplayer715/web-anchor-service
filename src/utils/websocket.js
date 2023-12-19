// import dayjs from 'dayjs';
const baseURL = "";
const EventTypes = ["open", "close", "message", "error", "reconnect"];
const DEFAULT_CHECK_TIME = 5; // 心跳检测的默认时间 单位：秒
const DEFAULT_ACKINTERVAL = 5; // ACK超时时间 单位：秒
const DEFAULT_MAXRECONNECTTIMES = 3; // 最大重连次数
const DEFAULT_ACKNBITS = 10; // ACK 编码所用的二进制数
const DEFAULT_HEARTBEATTOLERANCE = 5; // 触发重连的心跳次数
const DEFAULT_CHECK_DATA = {
  post_type: "meta_event",
  type: "heart_check",
  data: {
    type: "ping",
    interval: DEFAULT_CHECK_TIME,
  },
}; // 心跳检测的默认参数 - 跟后端协商的
const DEFAULT_RECONNECT_MESSAGE = {
  post_type: "meta_event",
  type: "reconnect",
};
const CLOSE_ABNORMAL = 1006; // WebSocket非正常关闭code码
const CLOSE_WITHOUT = 3006; // 丢失自定义的心跳包导致的WebSocket非正常关闭code码
class EventMap {
  deps = new Map();
  depend(eventType, callback) {
    this.deps.set(eventType, callback);
  }
  notify(eventType, event) {
    if (this.deps.has(eventType)) {
      this.deps.get(eventType)(event);
    }
  }
}
class CircularQueue {
  constructor(size) {
    this.queue = new Array(size);
    this.start = 0;
    this.end = 0;
    this.size = size;
  }

  enqueue(element) {
    this.queue[this.end] = element;
    this.end = (this.end + 1) % this.size;
  }

  dequeue() {
    const element = this.queue[this.start];
    this.start = (this.start + 1) % this.size;
    return element;
  }

  set(index, element) {
    this.queue[index % this.size] = element;
  }

  get(index) {
    return this.queue[index % this.size];
  }
}

class Socket extends WebSocket {
  heartCheckData = null; // 心跳包数据格式
  heartCheckTimeout = DEFAULT_CHECK_TIME; // 心跳检测的默认时间
  heartCheckInterval = null; // 心跳检测的定时器
  maxReconnectTimes = DEFAULT_MAXRECONNECTTIMES; // 最大重连次数
  heartbeatTolerance = DEFAULT_HEARTBEATTOLERANCE; // 触发重连的心跳次数
  pingCount = 0; // 连续没有收到pong包的次数
  ackInterval = DEFAULT_ACKINTERVAL; // ACK超时时间
  ackNbits = DEFAULT_ACKNBITS; // ACK 编码所用的二进制数

  // 发送消息队列
  sendQueue = []; // 发送消息队列
  sendMaxSeqId = 0; // 消息发送窗口的最大seqId值
  sendWindowStart = 0; // 消息发送窗口的起始位置
  sendWindowEnd = 0; // 消息发送窗口的结束位置
  sendWindowSize = 0; // 消息发送窗口的大小

  // 接收消息队列
  receiveQueue = [];
  receiveMaxSeqId = 0; // 消息发送窗口的最大seqId值
  receiveWindowStart = 0; // 消息发送窗口的起始位置
  receiveWindowEnd = 0; // 消息发送窗口的结束位置
  receiveWindowSize = 0; // 消息发送窗口的大小

  // 定时器处理消息发送队列
  sendQueueInterval = null;
  // 记录最新的消息
  lastestMessage = null;
  constructor(options, dep, wsOptions) {
    let _baseURL = baseURL;
    const {
      url,
      protocols,
      // query = {},
      greet = null,
      customBase = null,
      reconnectCount = 0,
    } = options;

    // const _queryParams = Object.keys(query).reduce((str, key) => {
    //   if (typeof query[key] !== 'object' && typeof query[key] !== 'function') {
    //     return (str +=
    //       str.length > 0 ? `&${key}=${query[key]}` : `${key}=${query[key]}`);
    //   } else {
    //     return str;
    //   }
    // }, '');
    if (customBase) {
      _baseURL = customBase;
    }
    // super(`${_baseURL}${url}?${_queryParams}`, protocols);
    super(`${_baseURL}${url}`, protocols);
    this._currentOptions = options;
    this._dep = dep;
    this._reconnectCount = reconnectCount;
    greet &&
      Object.assign(this, {
        heartCheckData: greet,
      });
    this.initWSOptions(wsOptions);
    this.initSocket();
  }

  // resendMessage
  resendMessage() {
    if (this.sendWindowStart < this.sendWindowEnd) {
      for (let i = this.sendWindowStart; i <= this.sendWindowEnd; i++) {
        const message = this.sendQueue.get(i);
        if (message) {
          this.sendWithAck(message, { isAck: false, seq: i });
        }
      }
    } else {
      for (let i = this.sendWindowStart; i <= this.sendQueue?.size - 1; i++) {
        const message = this.sendQueue.get(i);
        if (message) {
          this.sendWithAck(message, { isAck: false, seq: i });
        }
      }
      for (let i = 0; i <= this.sendWindowEnd; i++) {
        const message = this.sendQueue.get(i);
        if (message) {
          this.sendWithAck(message, { isAck: false, seq: i });
        }
      }
    }
  }
  // 初始化配置项
  initWSOptions(wsOptions) {
    const {
      heartbeatInterval = DEFAULT_CHECK_TIME, // 心跳间隔
      ackNbits = DEFAULT_ACKNBITS, // ACK 编码所用的二进制数
      heartbeatTolerance = DEFAULT_HEARTBEATTOLERANCE, // 触发重连的心跳次数
      maxReconnectTimes = DEFAULT_MAXRECONNECTTIMES, // 最大重连次数
      ackInterval = DEFAULT_ACKINTERVAL, // ACK超时重发时间
    } = wsOptions || {};
    // 心跳检测的默认参数 - 跟后端协商的
    this.heartCheckData = {
      ...DEFAULT_CHECK_DATA,
      data: {
        ...DEFAULT_CHECK_DATA.data,
        interval: heartbeatInterval,
      },
    };
    // 心跳检测的默认时间
    this.heartCheckTimeout = heartbeatInterval;
    // 最大重连次数
    this.maxReconnectTimes = maxReconnectTimes;
    // 触发重连的心跳次数
    this.heartbeatTolerance = heartbeatTolerance;
    // ACK超时重发时间
    this.ackInterval = ackInterval;

    // ACK 编码所用的二进制数
    this.ackNbits = ackNbits;
    // ACK 发送消息队列
    this.sendQueue = new CircularQueue(2 ** ackNbits);
    this.sendWindowSize = 2 ** (ackNbits - 1);
    this.sendWindowStart = 0;
    this.sendWindowEnd = 2 ** (ackNbits - 1) - 1;
    // ACK 接收消息队列
    this.receiveQueue = new CircularQueue(2 ** ackNbits);
    this.receiveWindowSize = 2 ** (ackNbits - 1);
    this.receiveWindowStart = 0;
    this.receiveWindowEnd = 2 ** (ackNbits - 1) - 1;
    // 定时器处理消息发送队列
    this.sendQueueInterval = setInterval(
      this.resendMessage,
      this.ackInterval * 1000
    );
  }

  // 处理后端回传的ACK
  dealingReplyACK(message) {
    const { seq } = message || {};
    this.sendQueue.set(seq, null);
    // 发送窗口的开始位置消息为null，说明seq === sendWindowStart, 移动窗口
    while (this.sendQueue.get(this.sendWindowStart) === null) {
      this.sendWindowStart = (this.sendWindowStart + 1) % this.sendQueue.size;
      this.sendWindowEnd = (this.sendWindowEnd + 1) % this.sendQueue.size;
    }
  }
  // 根据接收消息队列处理ACK
  receiveWithAck(message) {
    const { packet } = message || {};
    // 处理pong包
    if (packet?.post_type === "meta_event" && packet?.type === "heart_check") {
      // 如果收到的pong，说明连接正常，重置心跳检测
      this.pingCount = 0;
    } else {
      // console.log('处理普通消息', message);
      // 处理普通消息
      this._dep.notify("message", packet);
    }
  }
  // 处理接收后端的消息
  dealingReplyMessage(message) {
    const { seq } = message || {};
    let inwindow = false;
    //  判断seq是否在发送窗口内
    if (this.receiveWindowStart <= this.receiveWindowEnd) {
      inwindow = seq >= this.receiveWindowStart && seq <= this.receiveWindowEnd;
    } else {
      inwindow =
        (seq >= this.receiveWindowStart && seq <= this.receiveQueue.size - 1) ||
        (seq >= 0 && seq <= this.receiveWindowEnd);
    }
    // 在发送窗口内
    if (inwindow) {
      // 发送ACK，通知对方已经收到消息
      this.sendMessage(undefined, { isAck: true, seq });
      this.receiveQueue.set(seq, message);
      // 在窗口开始位置，处理消息并移动窗口
      if (seq === this.receiveWindowStart) {
        let current = this.receiveWindowStart;
        let currentMessage = this.receiveQueue.get(current);
        while (currentMessage !== undefined) {
          this.receiveWindowStart =
            (this.receiveWindowStart + 1) % this.receiveQueue.size;
          this.receiveWindowEnd =
            (this.receiveWindowEnd + 1) % this.receiveQueue.size;
          this.receiveWithAck(currentMessage);
          current = this.receiveWindowStart;
          currentMessage = this.receiveQueue.get(current);
        }
      }
    }
  }
  // 初始化WebSocket
  initSocket() {
    // 监听webSocket的事件
    this.onopen = function (e) {
      this._dep.notify("open", e);
      this.heartCheckStart();
    };
    this.onclose = function (e) {
      this._dep.notify("close", e);
      this.sendQueueInterval = null;
      // 如果WebSocket是非正常关闭 则进行重连
      if (e.code === CLOSE_ABNORMAL || e.code === CLOSE_WITHOUT) {
        console.log("WebSocket重连-----", e);
        if (this._reconnectCount < this.maxReconnectTimes) {
          this._reconnectCount++;
          const _socket = new Socket(
            this._currentOptions,
            this._dep,
            this._reconnectCount
          );
          this._dep.notify("reconnect", _socket);
          // 发送最新的消息
          if (this.lastestMessage) {
            const reconnectMessage = {
              ...DEFAULT_RECONNECT_MESSAGE,
              data: {
                ts: this.lastestMessage.ts,
              },
            };
            const time = _socket.readyState === _socket.OPEN ? 0 : 1000;
            setTimeout(() => {
              _socket.sendMessage(reconnectMessage, {
                transformJSON: false,
                isAck: false,
                seq: this.sendMaxSeqId,
              });
            }, time);
          }
        } else {
          console.log("WebSocket重连次数超过最大重连次数");
        }
      }
    };
    this.onerror = function (e) {
      this._dep.notify("error", e);
    };
    this.onmessage = function (e) {
      // 如果后端返回的是二进制数据
      if (e.data instanceof Blob) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.data);
        reader.onload = (ev) => {
          if (ev.target.readyState === FileReader.DONE) {
            this._dep.notify("message", ev.target?.result);
          }
        };
      } else {
        // 处理普通数据
        try {
          const _parseData = JSON.parse(e.data);
          const { ack, packet } = _parseData || {};

          if (ack !== 1) {
            // 处理接收的消息
            this.dealingReplyMessage(_parseData);
          } else {
            if (packet?.post_type === "message") {
              this.lastestMessage = packet;
            }
            // 处理接收的ACK
            this.dealingReplyACK(_parseData);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  }

  // 编码器 sendMaxSeqId
  changeSendMaxSeqId(seq) {
    this.sendMaxSeqId = (seq + 1) % this.sendQueue.size;
  }
  // 发送消息，处理消息队列
  sendWithAck(message, options) {
    const { seq } = message;
    const { transformJSON } = options;
    this.sendQueue.set(seq, message);
    this.changeSendMaxSeqId(seq);
    let canSend = false;
    // 是否在窗口内
    if (this.sendWindowStart <= this.sendWindowEnd) {
      canSend = seq >= this.sendWindowStart && seq <= this.sendWindowEnd;
    } else {
      canSend =
        (seq >= this.sendWindowStart && seq <= this.sendQueue.size - 1) ||
        (seq >= 0 && seq <= this.sendWindowEnd);
    }
    if (canSend) {
      let messageStr = "";
      if (transformJSON) {
        messageStr = JSON.stringify(message);
      }
      this.send(messageStr);
    }
  }

  // 订阅事件
  subscribe(eventType, callback) {
    if (typeof callback !== "function")
      throw new Error("The second param is must be a function");
    if (!EventTypes.includes(eventType))
      throw new Error("The first param is not supported");
    this._dep.depend(eventType, callback);
  }

  // 发送消息
  sendMessage(data, options) {
    const { transformJSON = true, isAck = false, seq } = options;
    const messagaData = {
      seq: seq,
      ack: isAck ? 1 : 0, // 0表示不是ACK包，具备packet属性
      nbit: this.ackNbits,
    };
    if (!isAck) {
      messagaData["packet"] = data;
      this.sendWithAck(messagaData, options);
      return;
    }
    let messageStr = "";
    if (transformJSON) {
      messageStr = JSON.stringify(messagaData);
    }
    this.send(messageStr);
  }

  // 关闭WebSocket
  closeSocket(code, reason) {
    this.close(code, reason);
  }

  // 开始心跳检测
  heartCheckStart() {
    this.heartCheckInterval = setInterval(() => {
      if (this.readyState === this.OPEN) {
        // console.log('发送心跳包', dayjs().format('YYYY-MM-DD HH:mm:ss'));
        let transformJSON = typeof this.heartCheckData === "object";
        this.sendMessage(this.heartCheckData, {
          transformJSON,
          isAck: false,
          seq: this.sendMaxSeqId,
        });
        this.pingCount++;
        // 刚发了一个包, 如果ping次数大于等于心跳容忍次数 + 1 则进行重连
        if (this.pingCount >= this.heartbeatTolerance + 1) {
          try {
            this.closeSocket(
              CLOSE_WITHOUT,
              "丢失心跳包导致的WebSocket非正常关闭"
            );
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        this.clearHeartCheck();
      }
    }, this.heartCheckTimeout * 1000);
  }

  // 清除心跳检测
  clearHeartCheck() {
    clearInterval(this.heartCheckInterval);
  }

  // 重置心跳检测
  resetHeartCheck() {
    clearInterval(this.heartCheckInterval);
    this.heartCheckStart();
  }
}
// 默认的配置项
const defaultOptions = {
  url: "",
  protocols: "",
  query: {},
};

export const useSocket = (options = defaultOptions, wsOptions) => {
  if (!window.WebSocket)
    return console.log("您的浏览器不支持WebSocket, 请更换浏览器!");
  const dep = new EventMap();
  const reconnectCount = 0;
  return new Socket(options, dep, { ...wsOptions, reconnectCount });
};
