import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Links } from "@/models/Links";

export const { GET, POST } = makeCollectionHandlers(Links);
