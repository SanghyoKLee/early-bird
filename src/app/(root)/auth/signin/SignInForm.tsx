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

export const SignInForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      // Use NextAuth's credentials provider to sign in
      const result = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setSubmitError(result.error);
        return;
      }

      // Smoothly navigate to the homepage after a successful sign in
      startTransition(() => {
        router.push("/");
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setSubmitError("An unexpected error occurred.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSignInFormSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="" {...field} />
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
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitError && (
            // <CardCreator
            //   classname=""
            //   title={submitError}
            //   description=""
            //   content=""
            //   footer=""
            // />
            <div className="text-red-500 text-sm">{submitError}</div>
          )}

          <Button type="submit">
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
