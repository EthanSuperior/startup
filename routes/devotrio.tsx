import OtrioDevGame from "../islands/OtrioClient.tsx";
import { PageProps } from "$fresh/server.ts";

export default function OtrioDev(req: Request) {
  return <OtrioDevGame url={req.url} />;
}
