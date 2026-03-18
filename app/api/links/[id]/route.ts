import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Links } from "@/models/Links";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Links);
