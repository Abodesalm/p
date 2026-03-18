import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Project } from "@/models/Project";

export const { GET, POST } = makeCollectionHandlers(Project);
