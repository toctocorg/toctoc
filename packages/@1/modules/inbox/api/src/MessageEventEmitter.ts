//

import { EventEmitter } from "events";

//

export class MessageEventEmitter extends EventEmitter {}
export const message_event_emitter = new MessageEventEmitter();
