import { makeCollectionHandlers } from "@/lib/routeFactory";
import { Certificate } from "@/models/Certificate";

export const { GET, POST } = makeCollectionHandlers(Certificate);
