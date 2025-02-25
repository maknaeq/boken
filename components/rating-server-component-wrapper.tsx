import { getRatingPlaceById } from "@/app/actions/reviewActions";
import StarRating from "@/components/start-rating";

async function RatingServerComponentWrapper({
  placeId,
  userId,
}: {
  placeId: string;
  userId: string;
}) {
  const rating = await getRatingPlaceById(placeId);
  if (!rating?.success) return null;
  return <StarRating rating={rating.req} placeId={placeId} userId={userId} />;
}

export default RatingServerComponentWrapper;
