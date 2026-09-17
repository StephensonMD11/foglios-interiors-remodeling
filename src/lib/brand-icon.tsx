import { ImageResponse } from "next/og";
import { BRAND, FOGLIO_F_PATH } from "./brand-mark";

export function foglioMarkResponse({
  size,
  rounded,
}: {
  size: number;
  rounded: boolean;
}) {
  const radius = rounded ? Math.round(size * 0.22) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BRAND.seaDeep,
          borderRadius: radius,
          overflow: "hidden",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 32 32">
          <path fill={BRAND.cream} d={FOGLIO_F_PATH} />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
