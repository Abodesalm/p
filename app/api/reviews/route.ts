import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Review } from "@/models/Review";

export const { GET, POST } = makeCollectionHandlers(Review);
