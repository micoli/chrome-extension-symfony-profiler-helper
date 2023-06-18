import React from "react";
import { useEffect, useState } from "react";
import "@pages/options/Options.css";
import "react-json-pretty/themes/monikai.css";
import {
  AppShell,
  Box,
  Button,
  Code,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { sendMessage } from "../shared/messaging";
import { profilerTabs } from "@pages/shared/Profiler";
import {
  storageGetItem,
  storageKeys,
  storageSetItem,
} from "@pages/shared/storage";

const Options = () => {
  const [profilerTab, setProfilerTab] = useState<string>();
  const [xDebugToken, setXDebugToken] = useState<string>();
  const [xDebugTokenLink, setXDebugTokenLink] = useState<string>();

  const initValues = () => {
    storageGetItem(storageKeys.profilerTab).then(setProfilerTab);
    storageGetItem(storageKeys.xDebugToken).then(setXDebugToken);
    storageGetItem(storageKeys.xDebugTokenLink).then(setXDebugTokenLink);
  };

  useEffect(() => {
    initValues();
  }, []);

  const setDefaultValues = () => {
    for (const [, [storageKey, defaultValue]] of Object.entries(storageKeys)) {
      storageSetItem(storageKeys[storageKey], defaultValue);
    }
    initValues();
  };

  return (
    <AppShell padding={"xs"}>
      <Box maw={320} mx="auto">
        <Select
          label={"Default profiler tab"}
          placeholder="Pick one"
          value={profilerTab}
          onChange={(value) => {
            storageSetItem(storageKeys.profilerTab, value)
              .then(setProfilerTab)
              .then(() => sendMessage("optionsSetEvent", null));
          }}
          data={profilerTabs.map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <TextInput
          label={"xDebugToken header name"}
          value={xDebugToken}
          onChange={(event) =>
            storageSetItem(
              storageKeys.xDebugToken,
              event.currentTarget.value.toLowerCase()
            )
              .then(setXDebugToken)
              .then(() => sendMessage("optionsSetEvent", null))
          }
        />
        <TextInput
          label={"xDebugTokenLink header name"}
          value={xDebugTokenLink}
          onChange={(event) =>
            storageSetItem(
              storageKeys.xDebugTokenLink,
              event.currentTarget.value.toLowerCase()
            )
              .then(setXDebugTokenLink)
              .then(() => sendMessage("optionsSetEvent", null))
          }
        />

        <Button onClick={setDefaultValues}>Default values</Button>

        <Text size="sm" weight={500} mt="xl">
          Values:
        </Text>
        <Code block mt={5}>
          {JSON.stringify(
            {
              profilerTab,
              xDebugToken,
              xDebugTokenLink,
            },
            null,
            2
          )}
        </Code>
      </Box>
    </AppShell>
  );
};

export default Options;
