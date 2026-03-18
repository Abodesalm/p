import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Certificate } from "@/models/Certificate";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Certificate);
