export function AdSenseSlot({ slot }: { slot?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || !slot) return null;

  return (
    <div className="my-8 flex justify-center" aria-hidden>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
