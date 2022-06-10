import axios, { Axios } from "axios";
import { debug } from "console";

interface GetMeUser {
  username: string;
}

interface Update {
  update_id: number;
  message?: {
    message_id: number;
    from: {};
    chat: {};
    date: number;
    text: string;
  };
}
class Fint {
  // private api with token;
  private api: Axios;

  // states
  private me: GetMeUser | undefined;
  private polling: Boolean = false;

  private lastUpdateId: number | undefined;

  private handlers: {
    messages?: {
      [key: string]: Function;
    };
  } = {
    messages: {},
  };

  constructor(token: String, options?: {}) {
    // this.token = token;
    this.api = axios.create({
      baseURL: "https://api.telegram.org/bot" + token,
    });
  }

  private async call(method: String, data?: {}) {
    try {
      const response = await this.api.get("/" + method, {
        params: data,
      });
      return {
        ok: true,
        data: response.data.result,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  private async getUpdates() {
      let options: { offset?: number } = {};
      if (this.lastUpdateId) {
          options.offset = this.lastUpdateId + 1
      };
    const { ok, data: updates, error } = await this.call("getUpdates", options);
    if (!ok) {
      console.log(error);
      throw new Error("Unable to get updates!");
    }
    return updates;
  }

  private async loop() {
    this.polling = true;

    while (this.polling) {
      const updates = await this.getUpdates();
      this.handleUpdates(updates);
    }
  }

  private async handleUpdates(updates: Update[]) {
    for (const update of updates) {
        this.lastUpdateId = update.update_id;
      try {
        await this.handleUpdate(update);
      } catch (error) {
        throw error;
      }
    }
  }

  private async handleUpdate(update: Update) {
    debug("Update received: " + update.update_id);
    if (update.message && this.handlers.messages) {
      const handler = this.handlers.messages[update.message.text];
      if (handler) {
        handler(update.message, this);
      }
    }
  }

  public async getMe() {
    const result = await this.call("getMe");
    if (!result.ok) {
      console.log(result.error);
      throw new Error("Can't perform getMe method");
    }
    return result.data;
  }

  isInited() {
    return this.me !== undefined;
  }

  async init() {
    if (!this.isInited()) {
      debug("Initializing bot...");
      let me;
      try {
        me = await this.getMe();
      } finally {
        this.me = me;
      }
    }
    debug(`I am ${this.me!.username}`);
  }

  public async start() {
    if (!this.isInited()) await this.init();

    debug("Starting polling");
    await this.loop();
    debug("Polling started");
  }

  public async hears(msg: string, callback: Function) {
    let messageHandlers = this.handlers.messages || {};
    messageHandlers[msg] = callback;
    this.handlers.messages = messageHandlers;
  }

  public async sendMessage(chat_id: number | string, text: string) {
    this.call("sendMessage", {
      chat_id,
      text,
    });
  }
}

export default Fint;
