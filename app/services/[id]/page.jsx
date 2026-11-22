import { Suspense } from "react";
import ServiceDetails from "@/components/ServiceDetails";

async function Content({ params }) {
  const { id } = await params;
  return <ServiceDetails id={id} />;
}

export default function ServicePage({ params }) {
  return (
    <Suspense
      fallback={<p className="p-8 text-center text-gray-600">Loading service...</p>}
    >
      <Content params={params} />
    </Suspense>
  );
}