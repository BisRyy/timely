import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import SignInGithub from "./SignInGithub";
import { IconLayoutKanban } from "@tabler/icons-react";
import SignInGoogle from "./SignInGoogle";
import { Input } from "@nextui-org/react";
import SignInButton from "./SignIn";

export default async function CustomSignInPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  } else {
    return (
      <div className="flex justify-center items-center h-full">
        <Card
          className="min-w-96 shadow-xl bg-white border-2 border-primary"
          shadow="none"
        >
          <CardHeader className="px-10 py-5 flex items-center">
            <IconLayoutKanban className="text-primary w-8 h-8 md:w-14 md:h-14" />
            <h3 className="text-3xl md:text-5xl tracking-tighter text-center w-full font-bold">
              Timely
            </h3>
          </CardHeader>
          <CardBody className="space-y-3 p-10 pt-0">
            {/* <h2 className="text-center text-2xl">Sign in</h2>
            <p className="text-center text-lg">with your account</p>
            <Input placeholder="Email" value="bisrat.kebere@a2sv.org"/>
            <Input placeholder="Password" type="password" value="password"/>
            <SignInButton />
            <p className="uppercase text-xs text-center text-primary">
              - or -{" "}
            </p> */}
            <SignInGithub />
            <SignInGoogle />
          </CardBody>
        </Card>
      </div>
    );
  }
}
