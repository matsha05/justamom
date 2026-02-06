import Image from "next/image";

export function NoteSignOff() {
  return (
    <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
      <p className="text-h4 italic font-semibold text-[var(--color-ink-soft)] mb-3">
        In it with you,
      </p>
      <Image
        src="/images/signature.png"
        alt="Lizi"
        width={120}
        height={111}
        className="w-[120px] h-[111px] opacity-90"
      />
    </footer>
  );
}
