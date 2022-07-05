import React from "react";
import { useNavigate } from "react-router-dom";

export const withUseNavigateHooksHOC = (Component) => {
  return (props) => {
    const navigate = useNavigate();

    return <Component navigate={navigate} {...props}></Component>;
  };
};
