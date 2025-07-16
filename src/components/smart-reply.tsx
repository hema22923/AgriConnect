'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateSuggestedResponse } from '@/ai/flows/generate-suggested-response';
import type { Product } from '@/lib/types';

interface SmartReplyProps {
  product: Product;
  buyerQuestion: string;
}

export default function SmartReply({ product, buyerQuestion }: SmartReplyProps) {
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateResponse = async () => {
    setIsLoading(true);
    try {
      const productListing = `Product: ${product.name}\nDescription: ${product.description}\nPrice: $${product.price}`;
      const result = await generateSuggestedResponse({ productListing, buyerQuestion });
      setSuggestedResponse(result.suggestedResponse);
    } catch (error) {
      console.error('Failed to generate response:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a suggested response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedResponse);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Buyer Question</span>
          <Button variant="ghost" size="icon" onClick={handleGenerateResponse} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            <span className="sr-only">Regenerate response</span>
          </Button>
        </CardTitle>
        <CardDescription>
          From: {product.seller}
        </CardDescription>
        <p className="pt-2 italic text-muted-foreground">&quot;{buyerQuestion}&quot;</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <h4 className='font-medium'>AI-Suggested Reply</h4>
            <div className='relative'>
                <Textarea
                    placeholder="Generating response..."
                    value={suggestedResponse}
                    onChange={(e) => setSuggestedResponse(e.target.value)}
                    rows={5}
                    className="pr-10"
                />
                {!isLoading && suggestedResponse && (
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                    </Button>
                )}
            </div>
          <Button disabled={!suggestedResponse} className='w-full bg-accent hover:bg-accent/90'>Send Reply</Button>
        </div>
      </CardContent>
    </Card>
  );
}
