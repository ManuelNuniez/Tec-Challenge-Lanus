import { z } from "zod";

// Shared by the login form and the login endpoint, so both validate the same way.
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Ingresá tu email" })
    .pipe(z.email({ error: "Revisá el formato del email" })),
  password: z.string().min(1, { error: "Ingresá tu contraseña" }),
  remember: z.boolean().default(false),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginFieldErrors = Partial<Record<"email" | "password", string>>;

// Stable codes the endpoint returns on failure; the form picks its own words.
export type LoginErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "SERVER_ERROR";

export function getFieldErrors(
  error: z.ZodError<z.output<typeof loginSchema>>,
): LoginFieldErrors {
  const { fieldErrors } = z.flattenError(error);
  return {
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  };
}
