"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getProductRecommendations, type ProductRecommendationsInput, type ProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { Loader2, Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';

const RecommendationFormSchema = z.object({
  pastOrders: z.string().min(3, { message: "Please list some past orders." }),
  vehicleInformation: z.string().min(5, { message: "Please provide vehicle information (e.g., Toyota Yaris 2019)." }),
});

type RecommendationFormData = z.infer<typeof RecommendationFormSchema>;

export default function RecommendationForm() {
  const [recommendations, setRecommendations] = useState<ProductRecommendationsOutput['recommendations'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormData>({
    resolver: zodResolver(RecommendationFormSchema),
    defaultValues: {
      pastOrders: '',
      vehicleInformation: '',
    },
  });

  const onSubmit: SubmitHandler<RecommendationFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getProductRecommendations(data);
      setRecommendations(result.recommendations);
    } catch (e) {
      console.error("Error fetching recommendations:", e);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Sparkles className="w-7 h-7 mr-2 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Tell us about your past orders and vehicle to get personalized product suggestions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="pastOrders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Orders</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Engine oil, Air filter, Wiper blades"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormDescription>
                    List some items you've purchased before, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Information</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Renault Clio 2020, 1.2L Petrol" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your car's make, model, year, and any other relevant details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className="mr-2 h-4 w-4" />
              )}
              Get Recommendations
            </Button>
            {error && (
              <div className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>

      {recommendations && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4 text-primary">Here are your recommendations:</h3>
          {recommendations.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 pl-2 text-foreground">
              {recommendations.map((rec, index) => (
                <li key={index} className="p-2 bg-muted/50 rounded-md">{rec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No specific recommendations found based on your input. Try providing more details.</p>
          )}
        </div>
      )}
    </Card>
  );
}
