import { IconLayoutKanban } from "@tabler/icons-react";
import Link from "next/link";

export default function NavbarTitle() {
  return (
    <div className="flex items-center my-2 gap-5">
      <Link href="/" className="text-xl tracking-tight flex items-center gap-x-2">
        <IconLayoutKanban className="text-primary w-8 h-8 md:w-10 md:h-10" />
        Timely
      </Link>
    </div>
  );
}
