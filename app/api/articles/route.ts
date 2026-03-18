import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Article } from "@/models/Article";

export const { GET, POST } = makeCollectionHandlers(Article);
