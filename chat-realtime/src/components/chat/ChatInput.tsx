import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  setText: (v: string) => void;
  onSend: () => void;
};

export default function ChatInput({ text, setText, onSend }: Props) {
  return (
    <div className="p-4 flex gap-2 border-t">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <Button onClick={onSend}>Send</Button>
    </div>
  );
}
