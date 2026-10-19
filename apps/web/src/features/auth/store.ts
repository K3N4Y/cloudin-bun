import { create } from "zustand";
import type { FieldName } from "./types";

export type Feedback = { field: FieldName | null; message: string };

type AuthFormStore = {
  email: string;
  username: string;
  password: string;
  reveal: boolean;
  feedback: Feedback | null;
  setField: (field: FieldName, value: string) => void;
  setReveal: (reveal: boolean) => void;
  setFeedback: (feedback: Feedback | null) => void;
  handOffToLogin: () => void;
  reset: () => void;
};

export const useAuthFormStore = create<AuthFormStore>((set) => ({
  email: "",
  username: "",
  password: "",
  reveal: false,
  feedback: null,
  // Clearing feedback on every edit is what orders the error sources instead of merging them: while
  // it is set the user has not typed since the failure, so it is the only source that can speak.
  setField: (field, value) => set({ [field]: value, feedback: null }),
  setReveal: (reveal) => set({ reveal }),
  setFeedback: (feedback) => set({ feedback }),
  // The hand-off after a created-but-not-signed-in account lands on the login form with everything
  // login can reuse filled in, so recovering costs one click instead of retyping a password.
  handOffToLogin: () => set({ username: "", reveal: false, feedback: null }),
  // The store outlives every route, so a credential must not survive the session it was typed for.
  reset: () => set({ email: "", username: "", password: "", reveal: false, feedback: null }),
}));
