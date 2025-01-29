import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: size.width,
        height: size.height,
      }}
    >
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            123
          </span>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
            }}
          >
            <span
              style={{
                position: "relative",
                top: "-6px",
              }}
            >
              +
            </span>
            <span
              style={{
                position: "relative",
                top: "-6px",
              }}
            >
              +
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
          fontWeight: "bold",
          padding: "0 2rem",
        }}
      >
        {title}
      </div>
    </div>,
    size,
  );
}
