import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ChatHeader() {
  return (
    <div className="h-16 border-b flex items-center gap-3 px-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">User 1</div>
        <div className="text-xs text-muted-foreground">Online</div>
      </div>
    </div>
  );
}
