"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const passwordResetRequestForm = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password Don`t match",
    path: ["confirm_password"],
  });

type passwordResetRequestValue = z.infer<typeof passwordResetRequestForm>;
type PasswordResetConfirmProps = {
  uid: string;
  token: string;
};
export default function PasswordResetConfirm({
  uid,
  token,
}: PasswordResetConfirmProps) {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const form = useForm<passwordResetRequestValue>({
    resolver: zodResolver(passwordResetRequestForm),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: passwordResetRequestValue) => {
    try {
      setSent(true);
      const reset_link = `${DJANGO_BASE_URL}/api/users/password-reset-confirm/`;
      const res = await axios.post(reset_link, {
        new_password: data.new_password,
        token: token,
        uid: uid,
      });
      if (res) {
        setSent(false);
        form.reset();
        router.push('/password-reset-complete')
      }
    } catch (error: any) {
      setSent(false);
      setError(error.response?.data.message);
      console.log(error);
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
              <Image
                src="/mylogo.png"
                height={80}
                width={80}
                alt="Picture of the author"
                className="rounded-full"
              />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Reset Your Password
            </h1>
            <p className="text-sm">
              Enter and confirm your new password to secure your account.
            </p>
          </div>
          {error && (
            <div className="p-3 my-3 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <FieldGroup>
              <Controller
                name="new_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="new_password"
                      className="block text-sm"
                    >
                      New Password
                    </FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      type="password"
                      id="new_password"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirm_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="new_password"
                      className="block text-sm"
                    >
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      type="password"
                      id="confirm_password"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button className="w-full" type="submit">
              {sent ? "Reseting" : "Reset Password"}
            </Button>
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
