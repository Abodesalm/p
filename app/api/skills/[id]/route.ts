import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Skill } from "@/models/Skill";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Skill);
