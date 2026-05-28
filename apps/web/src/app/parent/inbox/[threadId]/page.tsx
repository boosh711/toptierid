import { getSession } from "@/lib/auth";
import { getThreadMessages } from "@/lib/messaging";
import { ThreadView } from "@/components/thread-view";

export default async function ParentThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const session = await getSession();
  const messages = await getThreadMessages(threadId);

  return (
    <ThreadView
      threadId={threadId}
      messages={messages}
      currentUserId={session!.id}
      backHref="/parent/inbox"
    />
  );
}
