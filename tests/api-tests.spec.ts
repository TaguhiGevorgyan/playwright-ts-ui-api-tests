import { test, expect } from '@playwright/test';
import { apiConfig, apiHelpers } from '../config/api-config';

test.describe('API Tests', () => {
  test('GET Products API - Retrieve product list', async ({ request }) => {
    // Test 1: GET request to retrieve products
    const startTime = Date.now();
    
    const response = await request.get(`${apiConfig.baseUrl}${apiConfig.endpoints.products}`, {
      timeout: apiConfig.timeouts.request,
      headers: apiConfig.headers
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert response status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);

    // Assert response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    // Parse and validate response body
    const responseBody = await response.json();
    
    // Assert response structure
    expect(responseBody).toBeDefined();
    expect(Array.isArray(responseBody.products) || Array.isArray(responseBody.data) || Array.isArray(responseBody)).toBe(true);
    
    // Assert response contains expected fields
    if (responseBody.products && responseBody.products.length > 0) {
      const firstProduct = responseBody.products[0];
      expect(apiHelpers.validateProductStructure(firstProduct)).toBe(true);
    } else if (responseBody.data && responseBody.data.length > 0) {
      const firstProduct = responseBody.data[0];
      expect(apiHelpers.validateProductStructure(firstProduct)).toBe(true);
    } else if (Array.isArray(responseBody) && responseBody.length > 0) {
      const firstProduct = responseBody[0];
      expect(apiHelpers.validateProductStructure(firstProduct)).toBe(true);
    }

    // Assert response performance
    expect(responseTime).toBeLessThan(apiConfig.performance.maxResponseTime);
    expect(apiHelpers.isResponseTimeAcceptable(responseTime)).toBe(true);

    console.log(`✅ Products API test passed. Status: ${response.status()}, Response time: ${apiHelpers.formatResponseTime(responseTime)}`);
  });

  test('POST Search API - Search products with query', async ({ request }) => {
    // Test 2: POST request to search products
    const searchPayload = {
      query: apiConfig.testData.searchQueries.pizza,
      category: 'food',
      limit: 10,
      offset: 0
    };

    const startTime = Date.now();
    
    const response = await request.post(`${apiConfig.baseUrl}${apiConfig.endpoints.search}`, {
      data: searchPayload,
      timeout: apiConfig.timeouts.request,
      headers: apiConfig.headers
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert response status (accept both 200 and 201 for POST requests)
    expect([200, 201]).toContain(response.status());
    expect(response.ok()).toBe(true);

    // Assert response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    // Parse and validate response body
    const responseBody = await response.json();
    
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

    // Assert response performance
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

    console.log(`✅ Search API test passed. Status: ${response.status()}, Query: "${searchPayload.query}", Results: ${responseBody.results?.length || 0}, Response time: ${apiHelpers.formatResponseTime(responseTime)}`);
  });
}); 