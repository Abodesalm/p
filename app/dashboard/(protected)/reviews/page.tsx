import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  await connectDB();
  const reviews = await Review.find().lean();
  return <ReviewsClient initial={JSON.parse(JSON.stringify(reviews))} />;
}
