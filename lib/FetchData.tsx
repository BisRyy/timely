import prisma from '@/db/prisma';

// Fetch labels
export async function getLabelsForBoard(boardId: string) {
    const labels = await prisma.label.findMany({
        where: {
            boardId: boardId,
        },
        select: {
            id: true,
            title: true,
            color: true,
            isDefault: true,
        }
    });

    return labels;
}

// Fetch users
export async function getMembersForBoard(boardId: string) {
    const users = await prisma.boardMember.findMany({
        where: {
            boardId: boardId,
        },
        include: {
            user: true,
        },
    });

    return users;
}