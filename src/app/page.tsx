import OfferBrowser from "@/components/OfferBrowser";
import { getOffers } from "@/lib/offers";

export const revalidate = 3600;
export const maxDuration = 60;

export default async function Home() {
  const data = await getOffers();
  return <OfferBrowser data={data} />;
}
