import React, { useState } from "react";
import { FormInput } from "./FormInput";
import css from "./Form.module.scss";
import { login } from "../../utils/api";
import Router from "next/router";
import cn from "classnames";

interface LoginFormProps {}

export const LoginForm = ({}: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    setLoading(true);
    const result = await login({ username, password });
    if (result.success) Router.push("/feed");
    setSuccess(result.success);
    setLoading(false);
  };

  return (
    <div className={css.container}>
      <span className={css.title}>{"LOGIN"}</span>

      <FormInput
        tabIndex={1}
        className={css.input}
        placeholder="USERNAME"
        value={username}
        setValue={setUsername}
      />
      <FormInput
        tabIndex={1}
        className={css.input}
        placeholder="PASSWORD"
        value={password}
        setValue={setPassword}
        type="password"
      />
      <div className={css.buttons_container}>
        <button onClick={submit} className={css.button} tabIndex={2}>
          SUBMIT
        </button>
        <button
          onClick={() => Router.push("/signup")}
          className={cn(css.button, css.small_button)}
          tabIndex={3}
        >
          no account?
        </button>
      </div>
    </div>
  );
};
