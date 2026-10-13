import Hero from "@/components/Hero";
import CompanyStory from "@/components/CompanyStory";
import CottonFarming from "@/components/CottonFarming";
import SpinningMill from "@/components/SpinningMill";
import WeavingLoom from "@/components/WeavingLoom";
import YarnToFabric from "@/components/YarnToFabric";
import FabricDyeing from "@/components/FabricDyeing";
import QualityLaboratory from "@/components/QualityLaboratory";
import GarmentManufacturing from "@/components/GarmentManufacturing";
import GlobalManufacturing from "@/components/GlobalManufacturing";
import LetsWorkTogether from "@/components/LetsWorkTogether";
import { fetchSectionMap } from "@/lib/api";

// Always render fresh so admin CMS edits (hero, sections) appear immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sections = await fetchSectionMap();

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-start bg-white">
      <Hero data={sections["hero"]} />
      <CompanyStory data={sections["company_story"]} />
      <CottonFarming data={sections["cotton_farming"]} />
      <SpinningMill data={sections["spinning_mill"]} />
      <WeavingLoom data={sections["weaving_loom"]} />
      <YarnToFabric data={sections["yarn_to_fabric"]} />
      <FabricDyeing data={sections["fabric_dyeing"]} />
      <QualityLaboratory data={sections["quality_laboratory"]} />
      <GarmentManufacturing data={sections["garment_manufacturing"]} />
      <GlobalManufacturing data={sections["global_manufacturing"]} />
      <LetsWorkTogether data={sections["lets_work_together"]} />
    </main>
  );
}
