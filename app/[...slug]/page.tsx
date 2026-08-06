import { SiteApp } from "../site-app";

export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <SiteApp route={slug} />;
}
