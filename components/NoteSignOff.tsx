import Image from "next/image";

export function NoteSignOff() {
  return (
    <footer
      className="mt-16 pt-8 border-t border-[var(--color-border)] animate-fade-in"
      style={{ animationDelay: "225ms" }}
    >
      <p className="text-h4 italic font-semibold text-[var(--color-ink-soft)] mb-3">
        In it with you,
      </p>
      <Image
        src="/images/signature.png"
        alt="Lizi"
        width={120}
        height={111}
        className="opacity-90"
      />
    </footer>
  );
}
