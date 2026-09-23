import { createFileRoute } from "@tanstack/react-router";
import { FairwaterApp } from "@/components/fairwater/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FairwaterApp />;
}
