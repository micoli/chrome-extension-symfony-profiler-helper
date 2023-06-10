import { ActionIcon } from "@mantine/core";
import React from "react";

const ToolBarIcon = ({
  title,
  disabled,
  onClick,
  icon,
}: {
  title: string;
  disabled: boolean;
  onClick: () => void;
  icon: JSX.Element;
}) => (
  <ActionIcon
    title={title}
    disabled={disabled}
    radius={"xs"}
    variant="subtle"
    onClick={onClick}
  >
    {icon}
  </ActionIcon>
);

export default ToolBarIcon;
