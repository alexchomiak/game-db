import React, { useState, FC } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  Label,
  Tab,
  Tabs,
} from "react-bootstrap";
export interface AuthCreds {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
interface AuthFormProps {
  type: string;
  onSubmit: (v: AuthCreds) => void;
}
export const AuthForm: FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  return (
    <>
      <Form>
        {type == "register" && (
          <>
            <FormGroup>
              <FormControl
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName((e.target as HTMLInputElement).value)
                }
              ></FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl
                value={lastName}
                placeholder="Enter Last Name"
                onChange={(e) =>
                  setLastName((e.target as HTMLInputElement).value)
                }
              ></FormControl>
            </FormGroup>
          </>
        )}

        <FormGroup>
          <FormControl
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          ></FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl
            value={password}
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          ></FormControl>
        </FormGroup>

        <Button
          onClick={(e) => {
            onSubmit({
              email,
              password,
              firstName,
              lastName,
            });
          }}
        >
          {type === "register" ? "Register" : "Login"}
        </Button>
      </Form>
    </>
  );
};
