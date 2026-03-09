import { NewsletterSignupPanel } from "@/components/NewsletterSignupPanel";
import { marketingContent } from "@/content/site";

export function NoteNewsletterCTA() {
  return <NewsletterSignupPanel className="mt-12" panel={marketingContent.newsletter.notePanel} />;
}
