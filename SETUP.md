# SketchMix Setup Guide

This guide will help you set up the SketchMix application locally or for deployment.

## Prerequisites

- Node.js v16+ and npm
- PostgreSQL database (or any supported database with Drizzle ORM)
- OpenAI API key
- Beatoven.ai API key

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nanagajui/sketchmix.git
   cd sketchmix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env.sample` file to `.env` and fill in your actual credentials:
   ```bash
   cp .env.sample .env
   # Edit .env with your editor of choice
   ```

   Configure your database connection in the `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/sketchmix
   # For other database types, use the appropriate connection string format
   ```

4. **Set up the database**
   First, ensure your database server is running and you have created a database. Then push the schema to the database:
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Database Configuration

The application uses Drizzle ORM which supports multiple database types. You can configure your preferred database by:

1. Setting the appropriate `DATABASE_URL` in your `.env` file
2. Installing the corresponding database driver package
3. Updating the database configuration in `server/db/index.ts`

Supported databases include:
- PostgreSQL (recommended)
- MySQL
- SQLite
- SQL Server

## API Keys

### OpenAI API Key

1. Go to [OpenAI](https://platform.openai.com/account/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Add it to your `.env` file as `OPENAI_API_KEY`

### Beatoven.ai API Key

1. Go to [Beatoven.ai](https://www.beatoven.ai/)
2. Create an account or log in
3. Subscribe to their API service
4. Obtain your API key
5. Add it to your `.env` file as `BEATOVEN_API_KEY`

## Deployment

### Database Migration for Production

Before deploying to production, ensure your database schema is up to date:

```bash
NODE_ENV=production npm run db:push
```

### Environment Configuration

When deploying, make sure to set the following environment variables:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `BEATOVEN_API_KEY`

### Build for Production

```bash
npm run build
```

This will create optimized production builds of both the client and server.

### Run in Production

```bash
npm start
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems, check:
- Database credentials are correct in `.env`
- Database server is running and accessible
- Firewall settings allow connections to the database
- The correct database driver is installed

### API Rate Limiting

Both OpenAI and Beatoven.ai have rate limits on their APIs:
- For OpenAI, check your usage dashboard to ensure you haven't exceeded limits
- For Beatoven.ai, refer to their documentation on rate limits

### Image Generation Errors

If image generation fails:
- Verify your OpenAI API key has access to DALL-E models
- Check that your drawings aren't too complex or large
- The application automatically resizes large images, but very complex drawings might still cause issues