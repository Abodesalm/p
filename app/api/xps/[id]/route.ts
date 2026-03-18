import { makeDocumentHandlers } from "@/lib/routeFactory";
import { XP } from "@/models/XP";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(XP);
