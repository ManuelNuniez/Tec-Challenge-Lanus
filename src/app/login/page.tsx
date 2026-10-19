import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar | GranaBank",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-16 pb-8">
      <header className="flex flex-col items-center text-center">
        <div aria-hidden className="size-12 rounded-xl bg-primary" />
        <h1 className="mt-4 text-3xl font-semibold text-primary">GranaBank</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Con cada compra, sumás orgullo granate
        </p>
      </header>

      <LoginForm />
    </main>
  );
}
