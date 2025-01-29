import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text || "No Title"}
    </div>,
    size,
  );
}
