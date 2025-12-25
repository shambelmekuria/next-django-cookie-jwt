"use client";
// import { LogoIcon } from '@/components/logo'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { DJANGO_BASE_URL } from "@/config/defualt";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const passwordResetRequestForm = z.object({
  email: z.email(),
});

type passwordResetRequestValue = z.infer<typeof passwordResetRequestForm>;

export default function PasswordReset() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter()
  const form = useForm<passwordResetRequestValue>({
    resolver: zodResolver(passwordResetRequestForm),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: passwordResetRequestValue) => {
    try {
      setSent(true);
      const reset_link = `${DJANGO_BASE_URL}/api/users/password-reset/`;
      const res = await axios.post(reset_link, data);
      if (res) {
        setSent(false);
        form.reset();
        router.push('/password-reset/done')

      }
    } catch (error: any) {
      setSent(false);
      setError(error.response?.data.message);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action=""
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Image src='/mylogo.png' height={80} width={80} alt="Picture of the author" className="rounded-full" />
              {/* <LogoIcon /> */}
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Recover Password
            </h1>
            <p className="text-sm">Enter your email to receive a reset link</p>
          </div>
          {error && (
            <div className="p-3 my-3 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email" className="block text-sm">
                        Email
                      </FieldLabel>
                      <Input
                        aria-invalid={fieldState.invalid}
                        {...field}
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <Button className="w-full" type="submit">
              {sent ? "Sending" : "Send Reset Link"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              We'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remembered your password?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
