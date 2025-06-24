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
import React, { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/types/schema";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitErrorFromServer, setSubmitErrorFromServer] = useState<
    string | null
  >(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors: clientErrors },
    setError,
  } = form;

  async function onRegisterFormSubmit(values: z.infer<typeof registerSchema>) {
    setSubmitErrorFromServer(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitErrorFromServer(data.error || "Registration failed");
        return;
      }

      if (data.errors) {
        const errors = data.errors;

        if (errors.email) {
          setError("email", {
            type: "server",
            message: errors.email,
          });
        } else if (errors.username) {
          setError("username", {
            type: "server",
            message: errors.username,
          });
        } else if (errors.password) {
          setError("password", {
            type: "server",
            message: errors.password,
          });
        } else if (errors.confirmPassword) {
          setError("confirmPassword", {
            type: "server",
            message: errors.confirmPassword,
          });
        } else {
          alert("Something went wrong!");
        }
      }

      // Automatically sign the user in using NextAuth
      const signInResponse = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        setSubmitErrorFromServer(signInResponse.error);
        return;
      }

      // Use a transition to navigate smoothly to the home page (or another page)
      startTransition(() => {
        router.push("/");
      });
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitErrorFromServer("An unexpected error occurred.");
    }
  }

  return (
    <div className="flex-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onRegisterFormSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                {/* {errors.username && (
                <p className="text-red-500">{`${errors.username.message}`}</p>
              )} */}
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
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                {/* {errors.email && (
                <p className="text-red-500">{`${errors.email.message}`}</p>
              )} */}
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
                {/* {errors.password && (
                <p className="text-red-500">{`${errors.password.message}`}</p>
              )} */}
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
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                {/* {errors.confirmPassword && (
                <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
              )} */}
              </FormItem>
            )}
          />
          {submitErrorFromServer && (
            // <CardCreator
            //   classname="text-destructive"
            //   title="Error"
            //   description={submitErrorFromServer}
            //   content=""
            //   footer=""
            // />
            <p className="text-red-500">{submitErrorFromServer}</p>
          )}
          <Button className="" type="submit">
            {isPending ? "Registering" : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
