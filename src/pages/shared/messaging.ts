import { RequestLog } from "@pages/shared/index";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  optionsSetEvent(): void;

  getLogs(): RequestLog[];

  getListenersStatus(): boolean;

  clear(): void;

  newRequestEvent(RequestLog): void;

  startListeners(): void;

  stopListeners(): void;

  getDefaultProfilerTab(): string;

  setDefaultProfilerTab(string): string;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
