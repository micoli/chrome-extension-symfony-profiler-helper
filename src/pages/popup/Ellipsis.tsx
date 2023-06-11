import React from "react";
import { Text, Tooltip } from "@mantine/core";

const ellipsisText = (
  text: string,
  max: number,
  minimumPrefix: number,
  ellipsis = "..."
): string => {
  if (text.length < minimumPrefix) {
    return text;
  }
  if (text.length > max) {
    return (
      text.substring(0, minimumPrefix) +
      ellipsis +
      text.substring(text.length - max + minimumPrefix - ellipsis.length)
    );
  }
  return text;
};

const Ellipsis = ({
  text,
  max = 25,
  minimumPrefix = 10,
}: {
  text: string;
  max?: number;
  minimumPrefix?: number;
}) => {
  return (
    <Tooltip label={text}>
      <Text>{ellipsisText(text, max, minimumPrefix)}</Text>
    </Tooltip>
  );
};

export default Ellipsis;
export { ellipsisText };
