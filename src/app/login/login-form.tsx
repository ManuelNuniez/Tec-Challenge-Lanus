"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFieldErrors, loginSchema } from "@/lib/login-schema";
import type { LoginErrorCode, LoginFieldErrors } from "@/lib/login-schema";

const FORM_ERRORS: Record<Exclude<LoginErrorCode, "INVALID_INPUT">, string> = {
  INVALID_CREDENTIALS:
    "El email o la contraseña no son correctos. Revisalos y volvé a intentar.",
  SERVER_ERROR: "No pudimos conectarnos. Probá de nuevo en un momento.",
};

const inputClassName =
  "h-11 rounded-lg border-transparent bg-card px-3 shadow-xs aria-invalid:border-primary aria-invalid:ring-primary/20";

export function LoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showFieldErrors(errors: LoginFieldErrors) {
    setFieldErrors(errors);
    (errors.email ? emailRef : passwordRef).current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse({ email, password, remember });
    if (!parsed.success) {
      showFieldErrors(getFieldErrors(parsed.error));
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.ok) {
        router.replace("/");
        router.refresh();
        return;
      }

      const body = await response.json().catch(() => ({}));
      if (body.code === "INVALID_INPUT" && body.fieldErrors) {
        showFieldErrors(body.fieldErrors);
      } else if (body.code === "INVALID_CREDENTIALS") {
        setFormError(FORM_ERRORS.INVALID_CREDENTIALS);
        setPassword("");
        passwordRef.current?.focus();
      } else {
        setFormError(FORM_ERRORS.SERVER_ERROR);
      }
    } catch {
      setFormError(FORM_ERRORS.SERVER_ERROR);
    }
    setIsSubmitting(false);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="mt-14 flex flex-1 flex-col"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          ref={emailRef}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Ingresá tu email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldErrors((errors) => ({ ...errors, email: undefined }));
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={inputClassName}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-primary">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            ref={passwordRef}
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((errors) => ({ ...errors, password: undefined }));
            }}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            className={`${inputClassName} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="password-error" className="text-sm text-primary">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <Label className="mt-4 w-fit font-normal text-muted-foreground">
        <Checkbox
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked)}
          className="bg-card"
        />
        Recordarme
      </Label>

      <div className="mt-auto flex flex-col gap-4 pt-10">
        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-primary/8 px-4 py-3 text-sm text-primary"
          >
            {formError}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl text-base"
        >
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </Button>
      </div>
    </form>
  );
}
