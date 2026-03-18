import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Skill } from "@/models/Skill";

export const { GET, POST } = makeCollectionHandlers(Skill);
