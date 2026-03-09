import {test, expect} from '@playwright/test';

//parallel- grouping tests in a file and running them in parallel.
//It's a way to group tests that will run at the same time (in parallel) rather than one after another (sequentially).

test.describe.parallel('API tests', () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';

    //get request
    test("simple API test- Assert response status code", async ({request}) => {
        const response = await request.get(`${baseURL}/posts/1`);
        expect(response.status()).toBe(200);
    });

    test("simple API test- Assert invalid endpoint", async ({request}) => {
        const response = await request.get(`${baseURL}/posts/999`);
        expect(response.status()).toBe(404);
    });

    test("simple API test- Assert response headers", async ({request}) => {
        const response = await request.get(`${baseURL}/posts/1`);
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test("simple API test - Assert response time", async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get(`${baseURL}/posts/1`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
       console.log(`Response time: ${responseTime}ms`);
       expect(responseTime).toBeLessThan(2000); 
       expect(response.status()).toBe(200);
    });
     
    test("simple API test- Assert response body", async ({request}) => {
        const response = await request.get(`${baseURL}/posts/1`);
        const responseBody = await response.json();
        // Assert specific properties in the response body
        expect(responseBody).toHaveProperty('id', 1);
        expect(responseBody).toHaveProperty('title');
        expect(responseBody).toHaveProperty('body');

        //Assert data types of properties
        expect(typeof responseBody.id).toBe('number');
        expect(typeof responseBody.title).toBe('string');
        expect(typeof responseBody.body).toBe('string');

        //check value constraints
        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.title.length).toBeGreaterThan(0);
        expect(responseBody.body.length).toBeGreaterThan(0);
    });

    //post request
    test("Simple API test- Create a New post", async ({request}) => {
        const newPost = {
            title: "John Doe",
            body: "This is a sample post",
            userId: 1
        };
        const response = await request.post(`${baseURL}/posts`, {
            data: newPost
        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe(newPost.title);
        expect(responseBody.body).toBe(newPost.body);
        expect(responseBody.userId).toBe(newPost.userId);
    });
    //put request
    test("Simple API test- Update a post", async ({request}) => {
        const updatedPost = {
            title: "Updated Title",
            body: "This is an updated post",
            userId: 1
        };
        const response = await request.put(`${baseURL}/posts/1`, {
            data: updatedPost
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id', 1);   
        expect(responseBody.title).toBe(updatedPost.title);
        expect(responseBody.body).toBe(updatedPost.body);
        expect(responseBody.userId).toBe(updatedPost.userId);
    }); 
    //delete request
    test("Simple API test- Delete a post", async ({request}) => {
        const response = await request.delete(`${baseURL}/posts/1`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual({});
    });

   //query parameters and filtering
   test("API test- Query parameters", async ({request}) => {
    const response = await request.get(`${baseURL}/posts`, {
        params: {
            userId: 1,
            _limit: 3
        }
    });
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts.length).toBeLessThanOrEqual(3);
    posts.forEach((post: any) => {
        expect(post.userId).toBe(1);
    });
    });
   
});

//post -login endpoint

test.describe('Login API Tests with DummyJSON', () => {
    const baseURL = 'https://dummyjson.com';
    
    test('Login test', async ({ request }) => {
        const response = await request.post(`${baseURL}/auth/login`, {
            data: {
                username: 'emilys',
                password: 'emilyspass'
            }
        });
        
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        
        //  token
        expect(body).toHaveProperty('accessToken');
        expect(body).toHaveProperty('refreshToken');
        expect(body).toHaveProperty('id', 1);
        
        //  Used backticks `` for template literals
        console.log(' Login successful!');
        console.log(`Access token: ${body.accessToken.substring(0, 30)}...`);
        console.log(`User: ${body.firstName} ${body.lastName}`);
        console.log(`Email: ${body.email}`);
    });
    
    test('Get products - no auth needed', async ({ request }) => {
        const response = await request.get(`${baseURL}/products`);
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.products.length).toBeGreaterThan(0);
        
        //  Used backticks for template literals
        console.log(` Got ${body.products.length} products`);
    });
});