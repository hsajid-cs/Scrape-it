
import { ScrapedData } from '@/pages/Index';

interface ScrapingResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
}

export class ScrapingService {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static generateMockData(url: string): ScrapedData['data'] {
    const domain = new URL(url).hostname;
    const mockHeadings = [
      `Welcome to ${domain}`,
      'About Our Services',
      'Latest News and Updates',
      'Contact Information',
      'Our Products',
      'Customer Testimonials'
    ];

    const mockLinks = [
      { text: 'Home', url: `${url}/` },
      { text: 'About Us', url: `${url}/about` },
      { text: 'Services', url: `${url}/services` },
      { text: 'Contact', url: `${url}/contact` },
      { text: 'Blog', url: `${url}/blog` },
      { text: 'Privacy Policy', url: `${url}/privacy` }
    ];

    const mockImages = [
      { src: `${url}/images/hero-banner.jpg`, alt: 'Hero Banner' },
      { src: `${url}/images/about-us.jpg`, alt: 'About Us' },
      { src: `${url}/images/team.jpg`, alt: 'Our Team' },
      { src: `${url}/images/office.jpg`, alt: 'Office Location' }
    ];

    const mockText = `This is the main content from ${domain}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

    return {
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} - Official Website`,
      description: `Official website of ${domain} featuring our latest products and services.`,
      headings: mockHeadings.slice(0, Math.floor(Math.random() * 4) + 3),
      links: mockLinks.slice(0, Math.floor(Math.random() * 4) + 3),
      images: mockImages.slice(0, Math.floor(Math.random() * 3) + 2),
      text: mockText
    };
  }

  static async scrapeWebsite(url: string): Promise<ScrapingResult> {
    console.log('ScrapingService: Starting scrape for', url);
    
    // Simulate network delay
    await this.delay(2000 + Math.random() * 2000);

    try {
      // Validate URL
      const urlObj = new URL(url);
      
      // Simulate occasional failures for demo purposes
      const shouldFail = Math.random() < 0.15; // 15% failure rate
      
      if (shouldFail) {
        const errors = [
          'Connection timeout',
          'Access denied (403)',
          'Page not found (404)',
          'Server error (500)',
          'SSL certificate error'
        ];
        
        const result: ScrapedData = {
          id: this.generateId(),
          url,
          title: '',
          timestamp: new Date().toISOString(),
          data: {
            headings: [],
            links: [],
            images: [],
            text: ''
          },
          status: 'error',
          error: errors[Math.floor(Math.random() * errors.length)]
        };

        return {
          success: false,
          data: result,
          error: result.error
        };
      }

      // Generate mock scraped data
      const scrapedData = this.generateMockData(url);
      
      const result: ScrapedData = {
        id: this.generateId(),
        url,
        title: scrapedData.title || '',
        timestamp: new Date().toISOString(),
        data: scrapedData,
        status: 'success'
      };

      console.log('ScrapingService: Successfully scraped', url, result);
      
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('ScrapingService: Error scraping', url, error);
      
      const result: ScrapedData = {
        id: this.generateId(),
        url,
        title: '',
        timestamp: new Date().toISOString(),
        data: {
          headings: [],
          links: [],
          images: [],
          text: ''
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      return {
        success: false,
        data: result,
        error: result.error
      };
    }
  }

  static async testConnection(): Promise<boolean> {
    await this.delay(1000);
    return true;
  }
}
