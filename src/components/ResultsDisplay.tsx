
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, ExternalLink, Image, Link, FileText, Hash } from 'lucide-react';
import { ScrapedData } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface ResultsDisplayProps {
  result: ScrapedData | null;
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  if (!result) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-500">Start by entering a URL and clicking "Start Scraping"</p>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">Scraping Failed</h3>
        <p className="text-red-600">{result.error || 'An error occurred while scraping'}</p>
      </div>
    );
  }

  const exportData = (format: 'json' | 'csv') => {
    try {
      let dataStr = '';
      let filename = `scraped-data-${new Date().toISOString().split('T')[0]}`;

      if (format === 'json') {
        dataStr = JSON.stringify(result, null, 2);
        filename += '.json';
      } else {
        // Convert to CSV
        const csvData = [
          ['Type', 'Content', 'URL'],
          ...result.data.headings.map(h => ['Heading', h, '']),
          ...result.data.links.map(l => ['Link', l.text, l.url]),
          ...result.data.images.map(i => ['Image', i.alt, i.src]),
        ];
        dataStr = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        filename += '.csv';
      }

      const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Data exported as ${format.toUpperCase()} file`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { label: 'Headings', value: result.data.headings.length, icon: Hash },
    { label: 'Links', value: result.data.links.length, icon: Link },
    { label: 'Images', value: result.data.images.length, icon: Image },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{result.data.title || 'Untitled Page'}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            {result.url}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Scraped on {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {result.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <stat.icon className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
              <div className="text-sm text-blue-700">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => exportData('json')}
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button
          onClick={() => exportData('csv')}
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="headings">Headings</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.data.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm">{result.data.description}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Preview</h4>
                  <ScrollArea className="h-32 w-full border rounded p-3">
                    <p className="text-sm text-gray-600">{result.data.text.substring(0, 500)}...</p>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Headings ({result.data.headings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {result.data.headings.map((heading, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {heading}
                    </div>
                  ))}
                  {result.data.headings.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No headings found</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Links ({result.data.links.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {result.data.links.map((link, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm text-gray-900">{link.text || 'Untitled Link'}</div>
                      <div className="text-xs text-blue-600 break-all">{link.url}</div>
                    </div>
                  ))}
                  {result.data.links.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No links found</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Images ({result.data.images.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {result.data.images.map((image, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm text-gray-900">{image.alt || 'Untitled Image'}</div>
                      <div className="text-xs text-blue-600 break-all">{image.src}</div>
                    </div>
                  ))}
                  {result.data.images.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No images found</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
