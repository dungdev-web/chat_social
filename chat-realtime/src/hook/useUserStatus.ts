import { Timestamp } from "firebase/firestore";

export function timeAgo(ts?: Timestamp | number): string {
  if (!ts) return "";

  const now = Date.now();

  const last =
    ts instanceof Timestamp ? ts.toMillis() : ts;

  const diffMs = now - last;
  if (diffMs < 0) return "vừa xong";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // < 60 phút
  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  // < 24 giờ
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}
