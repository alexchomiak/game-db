import React, { FC, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { AuthForm } from "../components/AuthForm";
export const Auth: FC = () => {
  return (
    <>
      <Tabs defaultActiveKey="login">
        <Tab eventKey="login" title="Login">
          <AuthForm
            type="login"
            onSubmit={async (e) => {
              // TODO: write post request
            }}
          ></AuthForm>
        </Tab>
        <Tab eventKey="register" title="Register">
          <AuthForm
            type="register"
            onSubmit={async (e) => {
              // TODO: write post request
            }}
          ></AuthForm>
        </Tab>
      </Tabs>
    </>
  );
};
export default Auth;
