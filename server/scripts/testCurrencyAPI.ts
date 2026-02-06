//@ts-nocheck
import CurrencyAPI from '@everapi/currencyapi-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.CURRENCY_API_KEY;

if (!apiKey) {
  console.error(
    'Error: CURRENCY_API_KEY is not defined in the environment variables.',
  );
  process.exit(1);
}

const currencyAPI = new CurrencyAPI(apiKey);

async function testCurrencyAPI() {
  try {
    console.log('Fetching latest exchange rates...');
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });

    const response = await Promise.race([currencyAPI.latest(), timeoutPromise]);

    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching currency data:', error.message);
    } else {
      console.error('Error fetching currency data:', error);
    }
  }
}

testCurrencyAPI();
