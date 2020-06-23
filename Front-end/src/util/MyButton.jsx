import React from "react";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

export default ({ children, onClick, tip }) => (
  <Tooltip title={tip} placement="top">
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);
