# Tamil Pasanga - Next.js Application

## Overview
This is a Next.js application for "Tamil Pasanga" - a community website with features for events, news, staff management, gallery, and user applications. The project has been successfully imported and configured to run in the Replit environment.

## Project Architecture
- **Frontend Framework**: Next.js 15.3.3 with TypeScript
- **UI Components**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom animations
- **Image Handling**: Next.js Image optimization with remote patterns
- **AI Integration**: Google AI Genkit integration
- **Development Features**: Turbopack for fast development builds

## Project Structure
```
src/
├── app/            # Next.js App Router pages
│   ├── admin/      # Admin dashboard for managing content
│   ├── api/        # API routes
│   ├── events/     # Events pages
│   ├── gallery/    # Gallery pages
│   ├── news/       # News pages
│   └── staff/      # Staff pages
├── components/     # Reusable UI components
│   ├── app/        # Application-specific components
│   └── ui/         # Generic UI components
├── lib/            # Utilities and data files
└── hooks/          # Custom React hooks
```

## Configuration
- **Port**: Development server runs on port 5000
- **Host**: Configured to bind to 0.0.0.0 for Replit compatibility
- **Deployment**: Configured for autoscale deployment with build process

## Recent Changes (September 25, 2025)
- Installed all npm dependencies with legacy peer deps to resolve React version conflicts
- Updated package.json dev script to bind to 0.0.0.0:5000
- Configured Next.js to allow cross-origin requests for Replit proxy
- Set up workflow for development server
- Configured production deployment settings

## Development Workflow
- Start development: `npm run dev` (runs on port 5000)
- Build for production: `npm run build`
- Start production server: `npm start`
- Type checking: `npm run typecheck`
- Linting: `npm run lint`

## External Dependencies
- Uses external Discord images (some may return 404 if links have expired)
- Google AI integration for enhanced features
- Firebase integration for backend services

## Known Issues
- Some external Discord images return 404 (expected, as they're external links)
- Cross-origin warnings in development (expected in Replit environment)
- Minor image sizing warnings (non-critical UI issues)

## Current Status
✅ Dependencies installed and configured
✅ Development server running successfully
✅ Production deployment configured
✅ Project ready for development and deployment