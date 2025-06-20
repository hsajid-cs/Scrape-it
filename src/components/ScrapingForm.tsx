
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrapedData } from '@/pages/Index';
import { ScrapingService } from '@/utils/ScrapingService';

interface ScrapingFormProps {
  onScrapingComplete: (result: ScrapedData) => void;
}

export const ScrapingForm = ({ onScrapingComplete }: ScrapingFormProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scrape",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      console.log('Starting scraping for URL:', url);
      const result = await ScrapingService.scrapeWebsite(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success && result.data) {
        toast({
          title: "Scraping Complete",
          description: "Website data extracted successfully",
        });
        onScrapingComplete(result.data);
        setUrl('');
      } else {
        toast({
          title: "Scraping Failed",
          description: result.error || "Failed to scrape website",
          variant: "destructive",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error scraping website:', error);
      toast({
        title: "Error",
        description: "Failed to scrape website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium text-gray-700">
          Website URL
        </Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
            disabled={isLoading}
          />
        </div>
        {url && !validateUrl(url) && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Please enter a valid URL
          </p>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Scraping in progress...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !url.trim() || !validateUrl(url)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scraping Website...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Start Scraping
          </>
        )}
      </Button>

      {!isLoading && url && validateUrl(url) && (
        <p className="text-sm text-green-600 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          URL is valid and ready to scrape
        </p>
      )}
    </form>
  );
};
