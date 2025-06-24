"use client";
import { signInSchema, signInSchemaType } from "@/types/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";

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

export const SignInForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSignInFormSubmit(values: signInSchemaType) {
    setSubmitError(null);
    try {
      const result = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setSubmitError(result.error);
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
          <LogIn className="w-10 h-10 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Sign In</h2>
          <p className="text-sm text-text-light text-center">
            Welcome back! Sign in to continue.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSignInFormSubmit)}
            className="flex flex-col gap-4"
          >
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
                        autoComplete="current-password"
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
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 text-center">
                {submitError}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-xs text-text-light text-center mt-2">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary underline font-medium">
            Register
          </a>
        </div>
      </motion.div>
    </div>
  );
};
