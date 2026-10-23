/* Reviews shown in the Trustpilot-style slideshow.

   IMPORTANT: only paste real reviews from https://www.trustpilot.com/review/carxprt.com here.
   As of 19 Oct 2026 that profile has 0 reviews, so this list ships empty and production shows a
   production renders no review section. PLACEHOLDER_REVIEWS render in development only, so the strip's
   design and motion can be reviewed; they hold no customer words. Never ship them. */

export type Review = {
  name: string;
  date: string; // as shown on Trustpilot, e.g. "Mar 12, 2026"
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  text: string;
};

export const REVIEWS: Review[] = [];

export const TRUSTPILOT_URL = "https://www.trustpilot.com/review/carxprt.com";

export const PLACEHOLDER_REVIEWS: Review[] = [
  { name: "Reviewer name", date: "Review date", rating: 5, title: "", text: "Real Trustpilot reviews appear here once CarXprt has them, quoted word for word." },
  { name: "Reviewer name", date: "Review date", rating: 5, title: "", text: "A longer review wraps across several lines like this one, so the strip can be judged at the lengths buyers tend to write. Anything past seven lines is cut short." },
  { name: "Reviewer name", date: "Review date", rating: 4, title: "", text: "A four-star review shows its last star greyed out." },
  { name: "Reviewer name", date: "Review date", rating: 5, title: "", text: "A short one." },
  { name: "Reviewer name", date: "Review date", rating: 5, title: "", text: "The last card, for checking how the strip stops at its end." },
];
