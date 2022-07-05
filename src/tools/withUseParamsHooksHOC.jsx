import React from "react";
import { useParams } from "react-router-dom";

export const withUseParamsHooksHOC = (Component) => {
  return (props) => {
    const params = useParams();

    return <Component params={params} {...props}></Component>;
  };
};
