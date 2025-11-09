# Faleproxy

A Node.js web application that fetches a URL, replaces every instance of "Yale" with "Fale" in the document, and displays the modified content.

## Features

- Simple and intuitive user interface
- Fetches web content from any URL
- Replaces all instances of "Yale" with "Fale" (case-insensitive)
- Displays the modified content in an iframe
- Shows original URL and page title in an info bar

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. Open a browser and go to `http://localhost:3001`
3. Enter a URL in the input field (e.g., https://www.yale.edu)
4. Click "Fetch & Replace" to see the modified content

## Development

To run with auto-restart on file changes:

```bash
npm run dev
```

## Testing

The application includes a comprehensive test suite:

- **Unit tests**: Test the Yale-to-Fale replacement logic
- **API tests**: Test the application endpoints
- **Integration tests**: Test the entire application workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage for CI/CD
npm run test:ci
```

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically:

1. **Runs tests** on pushes to main/master branches and on pull requests
2. **Tests on multiple Node.js versions** (18.x, 20.x) to ensure compatibility
3. **Generates test coverage reports** and uploads them as artifacts
4. **Deploys to Vercel production** automatically when tests pass on the main/master branch

**Important:** The deployment only happens when all tests pass. If any test fails, the deployment is skipped.

### Setting up Vercel Deployment

To enable automatic deployments to Vercel, you need to configure the following GitHub secrets:

1. **Get your Vercel credentials:**
   - Go to your Vercel project settings
   - Get your Vercel Token from https://vercel.com/account/tokens
   - Find your Organization ID and Project ID in your project settings

2. **Add GitHub secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN` - Your Vercel API token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID

Once configured, every push to main/master that passes tests will automatically deploy to your Vercel production URL.

## Technologies Used

- Node.js
- Express - Web server framework
- Axios - HTTP client for fetching web pages
- Cheerio - HTML parsing and manipulation
- Vanilla JavaScript for frontend functionality
- Jest, Supertest, and Nock for testing
