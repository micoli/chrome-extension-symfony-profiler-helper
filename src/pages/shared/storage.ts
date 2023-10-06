import { localExtStorage } from "@webext-core/storage";

const storageKeys: { [key: string]: [string, string | boolean] } = {
  profilerTab: ["profilerTab", "db"],
  autoloadMetricTab: ["autoloadMetricTab", "db"],
  xDebugToken: ["xDebugToken", "x-debug-token"],
  xDebugTokenLink: ["xDebugTokenLink", "x-debug-token-link"],
  decodeBodyAndResponse: ["decodeBodyAndResponse", true],
};

const storageGetItem = async ([key, defaultValue]) => {
  return new Promise((resolve, reject) => {
    localExtStorage
      .getItem(key)
      .then((value) => resolve(value ?? defaultValue))
      .catch(reject);
  });
};

const storageSetItem = async ([key, _defaultValue], value) => {
  return new Promise((resolve, reject) => {
    localExtStorage
      .setItem(key, value)
      .then(() => resolve(value))
      .catch(reject);
  });
};

export { storageKeys, storageGetItem, storageSetItem };
