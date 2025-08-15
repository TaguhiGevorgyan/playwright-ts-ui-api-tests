import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables for API testing
function loadApiEnvFile(filePath: string): void {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load API config.env file:', e);
  }
}

// Load API environment variables
loadApiEnvFile(join(__dirname, '..', 'config.env'));

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    products: string;
    orders: string;
    search: string;
    basket: string;
    users: string;
    categories: string;
    reviews: string;
  };
  headers: {
    'Content-Type': string;
    'Accept': string;
    'User-Agent': string;
    'Authorization'?: string;
  };
  timeouts: {
    request: number;
    response: number;
    connection: number;
  };
  auth: {
    validToken?: string;
    invalidToken: string;
    adminToken?: string;
  };
  testData: {
    validProduct: {
      name: string;
      price: number;
      category: string;
      description: string;
    };
    validUser: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    searchQueries: {
      pizza: string;
      sushi: string;
      dessert: string;
      beverage: string;
      nonexistent: string;
    };
  };
  performance: {
    maxResponseTime: number;
    maxRequestTime: number;
    acceptableLatency: number;
  };
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://api.sushimushi.am',
  endpoints: {
    products: '/api/products',
    orders: '/api/orders',
    search: '/api/search',
    basket: '/api/basket',
    users: '/api/users',
    categories: '/api/categories',
    reviews: '/api/reviews'
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Playwright-Test-Suite/1.0',
    'Authorization': process.env.API_AUTH_TOKEN ? `Bearer ${process.env.API_AUTH_TOKEN}` : undefined
  },
  timeouts: {
    request: parseInt(process.env.API_REQUEST_TIMEOUT || '10000'),
    response: parseInt(process.env.API_RESPONSE_TIMEOUT || '5000'),
    connection: parseInt(process.env.API_CONNECTION_TIMEOUT || '30000')
  },
  auth: {
    validToken: process.env.API_VALID_TOKEN,
    invalidToken: 'invalid-token-12345',
    adminToken: process.env.API_ADMIN_TOKEN
  },
  testData: {
    validProduct: {
      name: 'Test Pizza Margherita',
      price: 15.99,
      category: 'pizza',
      description: 'A delicious test pizza for API testing'
    },
    validUser: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+37412345678',
      address: 'Test Address, Yerevan, Armenia'
    },
    searchQueries: {
      pizza: 'պիցցա', // Pizza in Armenian
      sushi: 'սուշի', // Sushi in Armenian
      dessert: 'dessert',
      beverage: 'beverage',
      nonexistent: 'nonexistentproduct12345'
    }
  },
  performance: {
    maxResponseTime: parseInt(process.env.API_MAX_RESPONSE_TIME || '3000'),
    maxRequestTime: parseInt(process.env.API_MAX_REQUEST_TIME || '10000'),
    acceptableLatency: parseInt(process.env.API_ACCEPTABLE_LATENCY || '1000')
  }
};

// Helper functions for API testing
export const apiHelpers = {
  // Generate random test data
  generateRandomString: (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate random email
  generateRandomEmail: (): string => {
    const randomString = apiHelpers.generateRandomString(8);
    return `test.${randomString}@example.com`;
  },

  // Generate random phone number
  generateRandomPhone: (): string => {
    const randomDigits = Math.floor(Math.random() * 900000000) + 100000000;
    return `+374${randomDigits}`;
  },

  // Validate API response structure
  validateProductStructure: (product: any): boolean => {
    return product && 
           typeof product.id !== 'undefined' && 
           typeof product.name === 'string' && 
           typeof product.price === 'number' &&
           product.name.length > 0 &&
           product.price > 0;
  },

  // Validate search response structure
  validateSearchResponse: (response: any): boolean => {
    return response && 
           typeof response.query === 'string' && 
           Array.isArray(response.results) &&
           response.query.length > 0;
  },

  // Check if response time is acceptable
  isResponseTimeAcceptable: (responseTime: number): boolean => {
    return responseTime <= apiConfig.performance.acceptableLatency;
  },

  // Format response time for logging
  formatResponseTime: (responseTime: number): string => {
    if (responseTime < 1000) {
      return `${responseTime}ms`;
    } else {
      return `${(responseTime / 1000).toFixed(2)}s`;
    }
  }
}; 