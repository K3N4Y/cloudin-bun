import { Asterisk } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useLogin, useRegister } from "../api";
import { validate } from "../schemas";
import { useAuthFormStore, type Feedback } from "../store";
import type { AuthMode, FieldName } from "../types";
import { Field } from "./Field";

const SUBTEXT = "Run autonomous coding agents in the cloud. Hand off a task and they plan, code, and open a pull request - review the work whenever you're ready.";

const FIELD_ORDER: FieldName[] = ["email", "username", "password"];

const COPY: Record<
  AuthMode,
  { title: string; submit: string; emailLabel: string; passwordLabel: string; prompt: string; linkText: string; to: "/login" | "/register" }
> = {
  register: {
    title: "Create your kenni account",
    submit: "Create account",
    emailLabel: "Work email",
    passwordLabel: "Create password",
    prompt: "Already have an account?",
    linkText: "Log in",
    to: "/login",
  },
  login: {
    title: "Welcome back to kenni",
    submit: "Log in",
    emailLabel: "Work email",
    passwordLabel: "Password",
    prompt: "New to kenni?",
    linkText: "Create an account",
    to: "/register",
  },
};

function errorFor(field: FieldName, feedback: Feedback | null, errors: Partial<Record<FieldName, string>>): string | null {
  if (feedback) return feedback.field === field ? feedback.message : null;
  return errors[field] ?? null;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = COPY[mode];
  const email = useAuthFormStore((state) => state.email);
  const username = useAuthFormStore((state) => state.username);
  const password = useAuthFormStore((state) => state.password);
  const reveal = useAuthFormStore((state) => state.reveal);
  const feedback = useAuthFormStore((state) => state.feedback);
  const setField = useAuthFormStore((state) => state.setField);
  const setReveal = useAuthFormStore((state) => state.setReveal);
  const setFeedback = useAuthFormStore((state) => state.setFeedback);

  // Hints only appear once a submit has been attempted, so a fresh form shows no errors on fields
  // the person has not filled in yet.
  const [submitted, setSubmitted] = useState(false);

  const login = useLogin();
  const register = useRegister();
  const mutation = mode === "register" ? register : login;

  const draft = { email, username, password };
  const errors = validate(mode, draft);
  const shown = submitted ? errors : {};
  const formMessage = feedback && feedback.field === null ? feedback.message : null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const firstInvalid = FIELD_ORDER.find((field) => errors[field] !== undefined);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setFeedback(null);
    if (mode === "register") register.mutate({ email, username: username.trim(), password });
    else login.mutate({ email, password });
  }

  return (
    <>
      <Asterisk size={30} weight="bold" className="text-brand" />
      <h1 className="mt-6 text-[30px] font-semibold tracking-[-0.02em] text-ink">{copy.title}</h1>
      <p className="mt-2 max-w-[340px] text-[13px] leading-[1.6] text-muted">{SUBTEXT}</p>

      <form className="mt-7 space-y-4" onSubmit={onSubmit} noValidate>
        <Field
          id="email"
          name="email"
          label={copy.emailLabel}
          type="email"
          placeholder="you@kenni.dev"
          value={email}
          onChange={(value) => setField("email", value)}
          error={errorFor("email", feedback, shown)}
          autoComplete="email"
        />

        {mode === "register" ? (
          <Field
            id="username"
            name="username"
            label="Username"
            type="text"
            placeholder="your-handle"
            value={username}
            onChange={(value) => setField("username", value)}
            error={errorFor("username", feedback, shown)}
            autoComplete="username"
          />
        ) : null}

        <Field
          id="password"
          name="password"
          label={copy.passwordLabel}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(value) => setField("password", value)}
          error={errorFor("password", feedback, shown)}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          reveal={{ revealed: reveal, onToggle: () => setReveal(!reveal) }}
        />

        {formMessage === null ? null : (
          <p role="alert" className="text-[12px] text-[#d14343]">
            {formMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-10 w-full rounded-md bg-btn text-[13px] font-medium text-white hover:bg-[#1f2937] disabled:opacity-60"
        >
          {copy.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-[12px] text-muted">
        {copy.prompt}{" "}
        <Link to={copy.to} className="text-brand hover:underline">
          {copy.linkText}
        </Link>
      </p>
    </>
  );
}
