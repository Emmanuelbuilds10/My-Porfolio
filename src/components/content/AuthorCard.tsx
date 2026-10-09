import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface AuthorCardProps {
  name: string;
  role: string;
  avatarUrl?: string | null;
  /** Action row rendered under the identity — Share / Copy link. */
  children?: ReactNode;
  className?: string;
}

/** Divider + centred author identity shown at the foot of a post. */
export function AuthorCard({
  name,
  role,
  avatarUrl,
  children,
  className,
}: AuthorCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-5 border-t border-line pt-10", className)}>
      <div className="flex items-center gap-3">
        <Avatar src={avatarUrl} name={name} size="sm" />
        <div className="text-left">
          <p className="text-sm font-semibold text-fg">{name}</p>
          <p className="text-xs text-faint">{role}</p>
        </div>
      </div>
      {children ? <div className="flex items-center gap-3">{children}</div> : null}
    </div>
  );
}
