import { Eye, EyeSlash } from "@phosphor-icons/react";

export type FieldProps = {
  id: string;
  name: string;
  label: string;
  type: "email" | "text" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  autoComplete: string;
  reveal?: { revealed: boolean; onToggle: () => void };
};

export function Field({ id, name, label, type, placeholder, value, onChange, error, autoComplete, reveal }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-[#3f3f3f]">
        {label}
      </label>

      <div className={reveal ? "relative" : undefined}>
        <input
          id={id}
          name={name}
          type={reveal?.revealed ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={error !== null}
          aria-describedby={error === null ? undefined : errorId}
          className={`h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] text-ink outline-none placeholder:text-[#b4b4b4] focus:border-[#d4d4d4] focus:ring-4 focus:ring-brand/10 ${
            reveal ? "pr-10" : ""
          }`}
        />

        {reveal ? (
          <button
            type="button"
            onClick={reveal.onToggle}
            aria-label={reveal.revealed ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
          >
            {reveal.revealed ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>

      {error === null ? null : (
        <p id={errorId} role="alert" className="mt-1.5 text-[12px] text-[#d14343]">
          {error}
        </p>
      )}
    </div>
  );
}
