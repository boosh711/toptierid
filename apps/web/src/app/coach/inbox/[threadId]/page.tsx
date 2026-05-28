import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { getThreadMessages } from "@/lib/messaging";
import { ThreadView } from "@/components/thread-view";

export default async function CoachThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const session = await getSession();
  const messages = await getThreadMessages(threadId);

  return (
    <>
      <CoachNav active="/coach/inbox" />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <ThreadView
          threadId={threadId}
          messages={messages}
          currentUserId={session!.id}
          backHref="/coach/inbox"
        />
      </main>
    </>
  );
}
