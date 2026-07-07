const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function Star({ variant }: { variant: "full" | "half" | "empty" }) {
  if (variant === "half") {
    return (
      <span className="relative inline-block h-4 w-4 shrink-0">
        <svg
          className="h-4 w-4 text-slate-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
        <svg
          className="absolute inset-0 h-4 w-4 text-amber-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ clipPath: "inset(0 50% 0 0)" }}
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      </span>
    );
  }

  return (
    <svg
      className={`h-4 w-4 shrink-0 ${variant === "full" ? "text-amber-500" : "text-slate-300"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
};

export function StarRating({
  rating,
  maxRating = 5,
  showValue = true,
}: StarRatingProps) {
  const normalizedRating = (rating / maxRating) * 5;
  const fullStars = Math.floor(normalizedRating);
  const hasHalf = normalizedRating % 1 >= 0.5;

  const stars = Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;

    if (position <= fullStars) {
      return <Star key={position} variant="full" />;
    }

    if (position === fullStars + 1 && hasHalf) {
      return <Star key={position} variant="half" />;
    }

    return <Star key={position} variant="empty" />;
  });

  return (
    <div
      className="flex shrink-0 items-center gap-1.5"
      aria-label={`Rating: ${rating} out of ${maxRating}`}
    >
      <span className="flex items-center gap-0.5">{stars}</span>
      {showValue && (
        <span className="text-sm font-medium text-slate-700">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
}
