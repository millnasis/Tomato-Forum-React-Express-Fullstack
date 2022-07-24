import React from "react";
import { useSearchParams } from "react-router-dom";

export const withUseSearchParamsHooksHOC = (Component) => {
  return (props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
      <Component
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        {...props}
      ></Component>
    );
  };
};
