"use client";

/**
 * Site-wide floating WhatsApp button — opens a chat with our dispatch line.
 * Number is centralised here so the FAB and the booking-submit handler agree.
 */
export const WHATSAPP_E164 = "905412117805"; // +90 541 211 78 05
export const WHATSAPP_DISPLAY = "+90 541 211 78 05";

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function WhatsAppFAB() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp · ${WHATSAPP_DISPLAY}`}
      style={{
        // Respect iOS home-indicator safe area + a touch of padding
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1.25rem)",
      }}
      className="group fixed z-50 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] pl-3 pr-4 py-3 text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_22px_50px_-12px_rgba(37,211,102,0.7)] active:scale-[0.98]"
    >
      {/* pulse ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-[wapulse_2.2s_ease-out_infinite]"
      />
      <WhatsAppIcon />
      <span className="relative hidden text-sm font-medium tracking-[-0.01em] sm:inline">
        Chat on WhatsApp
      </span>

      <style>{`
        @keyframes wapulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .group > [aria-hidden] { animation: none !important; }
        }
      `}</style>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="relative h-5 w-5 shrink-0 fill-white"
      aria-hidden
    >
      <path d="M16.04 4C9.39 4 4 9.38 4 16.02c0 2.6.83 5.02 2.25 6.99L4 28l5.16-2.21a12 12 0 0 0 6.88 2.15h.01c6.65 0 12.04-5.38 12.04-12.02 0-3.21-1.25-6.23-3.52-8.5A12 12 0 0 0 16.04 4Zm0 21.92h-.01a10 10 0 0 1-5.08-1.39l-.36-.22-3.06 1.31.92-2.98-.24-.38a9.93 9.93 0 0 1-1.52-5.28c0-5.51 4.49-9.99 10.02-9.99 2.68 0 5.19 1.04 7.08 2.93a9.95 9.95 0 0 1 2.93 7.07c0 5.51-4.49 9.99-10 9.99Zm5.5-7.49c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.42.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
