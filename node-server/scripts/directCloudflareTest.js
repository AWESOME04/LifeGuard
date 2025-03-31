// Direct test of Cloudflare Workers AI with the same approach as the main app
require('dotenv').config();
const axios = require('axios');

async function testCloudflareWorkersAI() {
  try {
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
      console.error('❌ Error: Cloudflare credentials not found in environment variables');
      return;
    }

    console.log('🔍 Testing Cloudflare Workers AI with direct POST request...');
    console.log(`Using Account ID: ${process.env.CLOUDFLARE_ACCOUNT_ID.substring(0, 3)}...`);
    console.log(`Using API Token: ${process.env.CLOUDFLARE_API_TOKEN.substring(0, 5)}...`);
    
    // Using Llama-3.1-8B-Instruct model
    const modelId = '@cf/meta/llama-3.1-8b-instruct';
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${modelId}`;
    
    const testPrompt = 'What are 3 important things to know about maintaining good cardiovascular health?';
    
    console.log('📤 Sending test prompt to Cloudflare Workers AI...');
    console.log(`Using URL: ${url}`);
    
    const response = await axios.post(
      url,
      {
        messages: [
          { role: 'system', content: 'You are LifeGuard, a helpful and knowledgeable health assistant. You provide accurate, detailed, and conversational responses about health topics. Always maintain a supportive, engaging tone and provide comprehensive information.' },
          { role: 'user', content: testPrompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (response.data && response.data.result && response.data.result.response) {
      console.log('✅ Success! Response from Cloudflare Workers AI:');
      console.log('\n' + response.data.result.response + '\n');
    } else {
      console.error('❌ Error: Unexpected response format');
      console.log(response.data);
    }
  } catch (error) {
    console.error('❌ Error testing Cloudflare Workers AI:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      // Provide more specific guidance for authentication errors
      if (error.response.status === 401) {
        console.log('\n🔑 Authentication Error Help:');
        console.log('1. Make sure your CLOUDFLARE_ACCOUNT_ID is correct. It should be a hexadecimal ID, not "your_cloudflare_account_id_here"');
        console.log('2. Verify your CLOUDFLARE_API_TOKEN is valid and has the "Workers AI (Beta)" permission');
        console.log('3. Check if your token has expired or been revoked in the Cloudflare dashboard');
        
        console.log('\nTo create a new token with the right permissions:');
        console.log('- Go to https://dash.cloudflare.com/profile/api-tokens');
        console.log('- Click "Create Token"');
        console.log('- Select "Create Custom Token"');
        console.log('- Give it a name like "LifeGuard AI Token"');
        console.log('- Under "Permissions" section, add:');
        console.log('  * Account > Workers AI > Edit');
        console.log('  * Account > Account Settings > Read');
        console.log('- Under "Account Resources" select your account');
        console.log('- Click "Continue to summary" and then "Create Token"');
      } else if (error.response.status === 403) {
        console.log('\n🔒 Access Denied Error:');
        console.log('Your token may have IP restrictions or insufficient permissions.');
        console.log('1. Check if your token has IP restrictions in the Cloudflare dashboard');
        console.log('2. Make sure your token has the "Workers AI (Beta)" permission');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testCloudflareWorkersAI();
