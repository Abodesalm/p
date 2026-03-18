import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Project } from "@/models/Project";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Project);
