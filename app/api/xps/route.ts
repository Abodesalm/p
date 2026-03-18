import { makeCollectionHandlers } from "@/lib/routeFactory";
import { XP } from "@/models/XP";

export const { GET, POST } = makeCollectionHandlers(XP);
