"use client";
import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/react";

const SignInButton = () => {
  return (
    <Button
      onClick={() => signIn("credentials", { callbackUrl: "/board", username: "bisrat.kebere@a2sv.org", password: "password" })}
      type="button"
      variant="ghost"
      className="w-full"
    >
      Sign in 
    </Button>
  );
};

export default SignInButton;