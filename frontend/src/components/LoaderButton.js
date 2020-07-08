import React from "react";
import { Button } from "react-bootstrap";
import { SyncIcon } from '@primer/octicons-react';
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <SyncIcon className="spinning" />}
      {props.children}
    </Button>
  );
}