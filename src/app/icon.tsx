import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff2a85 0%, #ff7300 50%, #00f0ff 100%)",
          borderRadius: "8px",
          padding: "2px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#080914",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: "18px",
            letterSpacing: "-1px",
          }}
        >
          P
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
