import { requireAdminPage } from "@/lib/auth";
import { pipelineStatus } from "@/lib/pipeline";
import { AddProductFlow } from "./AddProductFlow";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  await requireAdminPage();
  return <AddProductFlow pipeline={pipelineStatus()} />;
}
