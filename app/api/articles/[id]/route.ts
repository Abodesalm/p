import { makeDocumentHandlers } from "@/lib/routeFactory";
import { Article } from "@/models/Article";

export const { GET, PATCH, DELETE } = makeDocumentHandlers(Article);
