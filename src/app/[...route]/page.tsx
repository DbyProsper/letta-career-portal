import Portal from "../../components/Portal";
import { pathList } from "../../data/catalog";
export const dynamicParams = false;
export function generateStaticParams() {
  return pathList.map((p) => ({ route: p.split("/") }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  return <Portal path={"/" + route.join("/")} />;
}
