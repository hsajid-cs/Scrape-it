
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Trash2, ExternalLink, Search, Calendar, Globe, CheckCircle, XCircle } from 'lucide-react';
import { ScrapedData } from '@/pages/Index';

interface ScrapingHistoryProps {
  results: ScrapedData[];
  onSelectResult: (result: ScrapedData) => void;
  selectedResult: ScrapedData | null;
}

export const ScrapingHistory = ({ results, onSelectResult, selectedResult }: ScrapingHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'error'>('all');

  const filteredResults = results.filter(result => {
    const matchesSearch = result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.data?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Globe className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Scraping History</h3>
        <p className="text-gray-500">Your scraping history will appear here once you start scraping websites</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by URL or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All ({results.length})
          </Button>
          <Button
            variant={filterStatus === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('success')}
          >
            Success ({results.filter(r => r.status === 'success').length})
          </Button>
          <Button
            variant={filterStatus === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('error')}
          >
            Failed ({results.filter(r => r.status === 'error').length})
          </Button>
        </div>
      </div>

      {/* Results List */}
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedResult?.id === result.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onSelectResult(result)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <h4 className="font-medium text-gray-900 truncate">
                      {result.data?.title || 'Untitled Page'}
                    </h4>
                    <Badge 
                      variant={result.status === 'success' ? 'default' : 'destructive'}
                      className="ml-auto flex-shrink-0"
                    >
                      {result.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span className="truncate">{result.url}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  
                  {result.status === 'success' && result.data && (
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>{result.data.headings.length} headings</span>
                      <span>{result.data.links.length} links</span>
                      <span>{result.data.images.length} images</span>
                    </div>
                  )}
                  
                  {result.status === 'error' && result.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete functionality
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No results match your search criteria</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
