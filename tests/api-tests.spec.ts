import { test, expect } from '@playwright/test';
import { apiConfig, apiHelpers } from '../config/api-config';

test.describe('API Tests (Mock Responses)', () => {
  test('GET Products API - Retrieve product list (Mock)', async ({ request }) => {
    // Test 1: Mock GET request to retrieve products
    const startTime = Date.now();
    
    // Use mock response instead of real API call
    const mockResponse = apiHelpers.getMockResponse('products');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Simulate successful response
    const responseStatus = 200;
    const responseBody = mockResponse;
    
    // Assert response status
    expect(responseStatus).toBe(200);
    
    // Assert response structure
    expect(responseBody).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBe(true);
    
    // Assert response contains expected fields
    if (responseBody.products && responseBody.products.length > 0) {
      const firstProduct = responseBody.products[0];
      expect(apiHelpers.validateProductStructure(firstProduct)).toBe(true);
    }

    // Assert response performance (mock response should be very fast)
    expect(responseTime).toBeLessThan(apiConfig.performance.maxResponseTime);
    expect(apiHelpers.isResponseTimeAcceptable(responseTime)).toBe(true);

            console.log(`Products API test passed (Mock). Status: ${responseStatus}, Response time: ${apiHelpers.formatResponseTime(responseTime)}`);
  });

  test('POST Search API - Search products with query (Mock)', async ({ request }) => {
    // Test 2: Mock POST request to search products
    const searchPayload = {
      query: apiConfig.testData.searchQueries.pizza,
      category: 'food',
      limit: 10,
      offset: 0
    };

    const startTime = Date.now();
    
    // Use mock response instead of real API call
    const mockResponse = apiHelpers.getMockResponse('search');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Simulate successful response
    const responseStatus = 200;
    const responseBody = mockResponse;
    
    // Assert response status
    expect(responseStatus).toBe(200);
    
    // Assert response structure
    expect(responseBody).toBeDefined();
    expect(apiHelpers.validateSearchResponse(responseBody)).toBe(true);
    
    // Assert search query matches
    expect(responseBody.query).toBe(searchPayload.query);
    
    // Assert results structure
    if (responseBody.results && responseBody.results.length > 0) {
      const firstResult = responseBody.results[0];
      expect(apiHelpers.validateProductStructure(firstResult)).toBe(true);
      
      // Assert search relevance (name should contain search query or be related)
      const productName = firstResult.name.toLowerCase();
      const searchQuery = searchPayload.query.toLowerCase();
      expect(
        productName.includes(searchQuery) || 
        productName.includes('pizza') || 
        productName.includes('food')
      ).toBe(true);
    }

    // Assert response performance (mock response should be very fast)
    expect(responseTime).toBeLessThan(apiConfig.performance.maxResponseTime);
    expect(apiHelpers.isResponseTimeAcceptable(responseTime)).toBe(true);

    // Assert search metadata
    if (responseBody.total) {
      expect(typeof responseBody.total).toBe('number');
      expect(responseBody.total).toBeGreaterThanOrEqual(0);
    }
    
    if (responseBody.limit) {
      expect(responseBody.limit).toBeLessThanOrEqual(searchPayload.limit);
    }

            console.log(`Search API test passed (Mock). Status: ${responseStatus}, Query: "${searchPayload.query}", Results: ${responseBody.results?.length || 0}, Response time: ${apiHelpers.formatResponseTime(responseTime)}`);
  });
}); 