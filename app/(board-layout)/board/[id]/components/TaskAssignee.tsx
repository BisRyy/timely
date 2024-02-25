import prisma from "@/db/prisma";
import { Avatar } from "@nextui-org/react";

interface TaskAssigneeProps {
  userID: string;
}

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export default async function TaskAssignee({ userID }: TaskAssigneeProps) {
  
  const assignee: User | null = await prisma.user.findUnique({
    where: { id: userID || '' },
    select: { id: true, name: true , image: true },
});

  if (!assignee || !assignee.image) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Avatar
        src={assignee.image}
        alt={assignee.name || "Assignee"}
        size="sm"
      />
    </div>
  );
}
