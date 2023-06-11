import { RequestLog } from "@pages/shared/index";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  getLogs(): RequestLog[];

  clear(): void;

  newRequest(RequestLog): void;

  popupClick(): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
