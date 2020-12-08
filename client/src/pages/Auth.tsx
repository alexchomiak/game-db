import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { AuthForm } from "../components/AuthForm";
import { login, register } from "../redux/splices/auth";
export const Auth: FC = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Tabs defaultActiveKey="login">
        <Tab eventKey="login" title="Login">
          <AuthForm
            type="login"
            onSubmit={async (e) => {
              dispatch(login(e));
            }}
          ></AuthForm>
        </Tab>
        <Tab eventKey="register" title="Register">
          <AuthForm
            type="register"
            onSubmit={async (e) => {
              dispatch(register(e));
            }}
          ></AuthForm>
        </Tab>
      </Tabs>
    </>
  );
};
export default Auth;
