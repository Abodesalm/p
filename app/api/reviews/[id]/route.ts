import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Review } from "@/models/Review";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Review);
