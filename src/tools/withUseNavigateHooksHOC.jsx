import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param {*} Component 
 * @returns 
 * 用法this.props.navigate("/pathname")
 */
export const withUseNavigateHooksHOC = (Component) => {
  return (props) => {
    const navigate = useNavigate();

    return <Component navigate={navigate} {...props}></Component>;
  };
};
