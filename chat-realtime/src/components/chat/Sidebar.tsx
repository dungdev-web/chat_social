import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const users = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  name: "User " + (i + 1),
}));

export default function Sidebar() {
  return (
    <div className="w-[320px] border-r flex flex-col">
      <div className="p-4 font-bold text-lg">Chats</div>

      <div className="p-2">
        <Input placeholder="Search..." />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-muted-foreground">
                  Last message...
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
