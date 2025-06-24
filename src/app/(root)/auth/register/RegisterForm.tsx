"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/types/schema";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus2 } from "lucide-react";

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, duration: 0.7 },
  },
};

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setError } = form;

  async function onRegisterFormSubmit(values: z.infer<typeof registerSchema>) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Registration failed");
        return;
      }

      if (data.errors) {
        Object.entries(data.errors).forEach(([field, msg]) => {
          setError(field as keyof z.infer<typeof registerSchema>, {
            type: "server",
            message: msg as string,
          });
        });
      }

      const signInResponse = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });
      if (signInResponse?.error) {
        setSubmitError(signInResponse.error);
        return;
      }
      startTransition(() => router.push("/dashboard"));
    } catch {
      setSubmitError("An unexpected error occurred.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-md bg-surface border border-muted shadow-xl rounded-2xl p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-2">
          <UserPlus2 className="w-10 h-10 text-primary" />
          <h2 className="text-2xl font-bold text-primary">
            Create your account
          </h2>
          <p className="text-sm text-text-light text-center">
            Get out of bed and join Early Bird!
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterFormSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input autoFocus autoComplete="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-2 top-2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-2 top-2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 text-center">
                {submitError}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
        <div className="text-xs text-text-light text-center mt-2">
          Already have an account?{" "}
          <a href="/sign-in" className="text-primary underline font-medium">
            Sign In
          </a>
        </div>
      </motion.div>
    </div>
  );
}
