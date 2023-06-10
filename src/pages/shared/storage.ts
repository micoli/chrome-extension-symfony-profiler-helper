import { localExtStorage } from "@webext-core/storage";

const storageKeys: { [key: string]: [string, string] } = {
  profilerTab: ["profilerTab", "db"],
  xDebugToken: ["xDebugToken", "x-debug-token"],
  xDebugTokenLink: ["xDebugTokenLink", "x-debug-token-link"],
};

const storageGetItem = async ([key, defaultValue]) => {
  return new Promise((resolve, reject) => {
    localExtStorage
      .getItem(key)
      .then((value) => resolve(value ?? defaultValue))
      .catch(reject);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storageSetItem = async ([key, defaultValue], value) => {
  return new Promise((resolve, reject) => {
    localExtStorage
      .setItem(key, value)
      .then(() => resolve(value))
      .catch(reject);
  });
};

export { storageKeys, storageGetItem, storageSetItem };
