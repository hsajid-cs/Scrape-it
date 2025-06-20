
import { useState } from 'react';
import { ScrapingForm } from '@/components/ScrapingForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ScrapingHistory } from '@/components/ScrapingHistory';
import { Globe, Database, Download, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ScrapedData {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  data: {
    title?: string;
    description?: string;
    headings: string[];
    links: { text: string; url: string }[];
    images: { src: string; alt: string }[];
    text: string;
  };
  status: 'success' | 'error';
  error?: string;
}

const Index = () => {
  const [scrapedResults, setScrapedResults] = useState<ScrapedData[]>([]);
  const [currentResult, setCurrentResult] = useState<ScrapedData | null>(null);

  const handleScrapingComplete = (result: ScrapedData) => {
    setScrapedResults(prev => [result, ...prev]);
    setCurrentResult(result);
  };

  const handleSelectResult = (result: ScrapedData) => {
    setCurrentResult(result);
  };

  const stats = [
    {
      title: "Total Scrapes",
      value: scrapedResults.length,
      icon: Globe,
      description: "Websites scraped"
    },
    {
      title: "Success Rate",
      value: `${scrapedResults.length > 0 ? Math.round((scrapedResults.filter(r => r.status === 'success').length / scrapedResults.length) * 100) : 0}%`,
      icon: TrendingUp,
      description: "Successful extractions"
    },
    {
      title: "Data Points",
      value: scrapedResults.reduce((acc, result) => {
        if (result.status === 'success' && result.data) {
          return acc + result.data.headings.length + result.data.links.length + result.data.images.length;
        }
        return acc;
      }, 0),
      icon: Database,
      description: "Elements extracted"
    },
    {
      title: "Downloads",
      value: "0",
      icon: Download,
      description: "Files exported"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Web Scraping Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract, analyze, and export data from any website with our powerful web scraping tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scraping Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">New Scraping Job</CardTitle>
                <CardDescription>Enter a URL to extract data from any website</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrapingForm onScrapingComplete={handleScrapingComplete} />
              </CardContent>
            </Card>
          </div>

          {/* Results and History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="results">Current Results</TabsTrigger>
                <TabsTrigger value="history">Scraping History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Extracted Data</CardTitle>
                    <CardDescription>
                      {currentResult ? `Results from ${currentResult.url}` : 'No data available. Start by scraping a website.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResultsDisplay result={currentResult} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Scraping History</CardTitle>
                    <CardDescription>View and manage all your previous scraping jobs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrapingHistory 
                      results={scrapedResults} 
                      onSelectResult={handleSelectResult}
                      selectedResult={currentResult}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
