import type { Metadata } from "next";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { listMessages, unreadMessageCount, type MessageTab } from "@/lib/admin/data";
import { firstParam, parsePage } from "@/lib/pagination";

export const metadata: Metadata = { title: "Messages" };

const TABS: MessageTab[] = ["all", "unread", "read"];

function parseTab(value: string): MessageTab {
  return TABS.includes(value as MessageTab) ? (value as MessageTab) : "all";
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = parseTab(firstParam(params.tab));
  const q = firstParam(params.q).trim();
  const page = parsePage(params.page);

  const [result, unread] = await Promise.all([
    listMessages({ tab, q, page }),
    unreadMessageCount(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Messages</h1>
        <p className="mt-1 text-sm text-faint">
          {unread > 0
            ? `${unread} unread message${unread === 1 ? "" : "s"} from the landing contact form.`
            : "Contact-form submissions from the landing page."}
        </p>
      </header>
      <MessagesManager
        rows={result.items}
        tab={tab}
        q={q}
        page={result.page}
        totalPages={result.totalPages}
        unreadCount={unread}
      />
    </div>
  );
}
