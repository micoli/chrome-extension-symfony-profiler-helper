import { RequestLog } from "@pages/shared/index";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  getLogs(): RequestLog[];

  getListenersStatus(): boolean;

  clear(): void;

  newRequest(RequestLog): void;

  stopListeners(): void;

  startListeners(): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
