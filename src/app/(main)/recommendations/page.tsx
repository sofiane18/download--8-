
import RecommendationForm from '@/components/recommendations/RecommendationForm';

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8 text-center">Discover Your Next Upgrade</h1>
      <RecommendationForm />
    </div>
  );
}
