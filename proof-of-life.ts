import * as dotenv from 'dotenv';
dotenv.config();// load the .env files

const apiKey = process.env.TRELLO_API_KEY; // reads the key from .env securely, not hardcoding it in the codebase
const token = process.env.TRELLO_TOKEN; // reads the token from .env securely, not hardcoding it in the codebase

async function getTrelloUsername(): Promise<void> {
  const response = await fetch(  //calling the Trello API to get the username associated with the provided API key and token
    `https://api.trello.com/1/members/me?key=${apiKey}&token=${token}`
  );

  const data = await response.json() as { username: string };
  console.log(`✅ Trello Username: ${data.username}`);// logs the username to the console, confirming that the API key and token are valid and working correctly
}

getTrelloUsername();