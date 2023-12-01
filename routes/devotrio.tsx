import OtrioDevGame from "../islands/OtrioClient.tsx";

export default function OtrioDev(req: Request) {
  return <OtrioDevGame url={req.url} />;
}
