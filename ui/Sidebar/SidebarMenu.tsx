import { BoardSummarySidebar } from "@/types/types";
import { IconCalendar, IconDashboard, IconLayoutKanban, IconTextCaption, IconUser } from "@tabler/icons-react";
import { Sidebar, Menu, SubMenu, MenuItem } from "./SidebarComponent";

export default function SidebarMenu({ boards }: { boards: BoardSummarySidebar[] }) {
    return (
        <Sidebar>
            <Menu>
                <MenuItem path="/board" title="Dashboard" icon={<IconDashboard size={24} />} />
                <SubMenu title="Boards" defaultOpen icon={<IconLayoutKanban size={24} />}>
                    { boards.length > 0 ? boards.map((boardMember) => (
                        <MenuItem key={boardMember.board.id} path={`/board/${boardMember.board.id}`} title={boardMember.board.title} />
                        )) : <span className="text-gray-500 text-sm px-8 py-2 w-full text-center">
                            No Boards.
                        </span>
                    }
                </SubMenu>
                <MenuItem path="/calendar" title="Calendar" icon={<IconCalendar size={24} />} />
                <MenuItem path="/docs" title="Docs" icon={<IconTextCaption size={24} />} />
                <MenuItem path="/profile" title="Profile" icon={<IconUser size={24} />} />
            </Menu>
        </Sidebar>
    );
}
