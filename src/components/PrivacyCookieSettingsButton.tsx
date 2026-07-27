"use client";

type PrivacyCookieSettingsButtonProps = {
  label?: string;
};

/**
 * Reopens Google Funding Choices / CMP revocation UI.
 * Safe when `window.googlefc` is missing (e.g. script not loaded).
 */
export function PrivacyCookieSettingsButton({
  label = "Privacy and cookie settings",
}: PrivacyCookieSettingsButtonProps) {
  function handleClick() {
    if (typeof window === "undefined") {
      return;
    }

    const googlefc = window.googlefc;
    if (!googlefc) {
      return;
    }

    if (!Array.isArray(googlefc.callbackQueue)) {
      googlefc.callbackQueue = [];
    }

    googlefc.callbackQueue.push(googlefc.showRevocationMessage);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:text-white"
    >
      {label}
    </button>
  );
}
