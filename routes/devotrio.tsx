import OtrioDevGame from "../islands/OtrioClient.tsx";
import { PageProps } from "$fresh/server.ts";

export default function OtrioDev(req:Request) {
  return <OtrioDevGame roomId={"3a562"} url={req.url}/>;
}
