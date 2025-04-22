# SketchMix

![SketchMix Logo](generated-icon.png)

> Where imagination becomes art & music

## Overview

SketchMix is an interactive web application that transforms user drawings into AI-generated art images with matching music based on emotional analysis. This creative platform empowers users to express themselves artistically and receive AI-enhanced interpretations of their work, complete with a musical soundtrack that matches the emotional tone of their creation.

## Features

- **Interactive Drawing Canvas**: Create drawings using an intuitive brush tool with customizable size and color options
- **AI Image Generation**: Transform simple sketches into detailed, professional artistic-style images using OpenAI's DALL-E models
- **Emotional Analysis**: Analyze the emotional context and mood of generated images
- **Music Generation**: Create custom music tracks that match the emotional tone of your artwork using Beatoven.ai
- **Creation Gallery**: Browse, view, and download your saved creations
- **Responsive Design**: Enjoy a consistent user experience across desktop and mobile devices

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS with custom design system
- Shadcn/UI component library
- TanStack Query for data fetching
- Wouter for lightweight routing

### Backend
- Express.js server
- Database-agnostic architecture with Drizzle ORM
- OpenAI API for image generation and analysis
- Beatoven.ai API for music generation
- Sharp for image processing and optimization

![SketchMix Example](SketchMix_Screen.avif)

## Getting Started

### Prerequisites

- Node.js (v16+)
- Database (PostgreSQL recommended, but supports multiple database types)
- OpenAI API key
- Beatoven.ai API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/sketchmix
# For other database types, use the appropriate connection string format
OPENAI_API_KEY=your_openai_api_key
BEATOVEN_API_KEY=your_beatoven_api_key
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/sketchmix.git
cd sketchmix
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## Usage

### Creating Artwork

1. **Draw**: Use the canvas and toolbar on the left side of the application to create your drawing
2. **Generate**: Click the "Generate" button to transform your drawing into an AI-generated image
3. **Explore**: Review the emotional analysis and listen to the custom-generated music that matches your artwork
4. **Save**: Click "Save Creation" to store your artwork in the gallery

### Gallery

1. Navigate to the Gallery page using the link in the header
2. Browse through your saved creations
3. Click on any creation to view details including:
   - Your original drawing
   - The AI-generated image
   - Emotional analysis breakdown
   - Custom music track with playback controls
4. Download images or music as desired

## Architecture

The application follows a modern client-server architecture:

- **Client**: React-based SPA with component-based UI and state management
- **Server**: Express.js REST API with database-agnostic persistence layer
- **AI Integration**: OpenAI for image generation and Beatoven.ai for music composition

### Data Flow

1. User creates a drawing on the canvas
2. Drawing is sent to the server as base64-encoded data
3. Server optimizes the image and sends it to OpenAI for transformation
4. The generated image is analyzed for emotional content
5. Emotional analysis is used to generate matching music via Beatoven.ai
6. All assets are returned to the client for display and can be saved to the database

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-image` | POST | Transform user drawing into AI-generated image |
| `/api/analyze-image` | POST | Analyze image for emotional content |
| `/api/generate-music` | POST | Generate music based on emotional description |
| `/api/creations` | GET | Retrieve all saved creations |
| `/api/creations` | POST | Save a new creation |
| `/api/creations/:id` | GET | Retrieve a specific creation |

## Configuration

### Image Generation

The image generation uses OpenAI's DALL-E 3 model with custom prompting to ensure high-quality, cartoon-style renderings of user drawings. The drawing is first analyzed by GPT-4o to understand its content, then transformed using carefully crafted prompts.

### Music Generation

Music is generated using Beatoven.ai's API, which creates custom tracks based on emotional descriptions. The system translates the emotional analysis into music attributes and genres to produce appropriate soundtracks.

### Database Configuration

The application uses Drizzle ORM which supports multiple database types. You can configure your preferred database by:

1. Setting the appropriate `DATABASE_URL` in your `.env` file
2. Installing the corresponding database driver package
3. Updating the database configuration in `server/db/index.ts`

Supported databases include:
- PostgreSQL (recommended)
- MySQL
- SQLite
- SQL Server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their powerful image generation and analysis capabilities
- Beatoven.ai for their innovative music generation API
- All open-source libraries and tools that made this project possible

---

Created with ❤️ by Nangajui
