# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential commands:**
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle (ESLint disabled via DISABLE_ESLINT_PLUGIN=true)
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking without emitting files

## Architecture Overview

This is a **Next.js 15** application with **App Router** featuring:

### Core Technologies
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling with shadcn/ui components
- **next-intl** for internationalization (Korean/English)
- **MySQL** database with connection pooling
- **Server-Sent Events (SSE)** for real-time notifications

### Key Architectural Patterns

**1. Internationalization Structure:**
- Localized routes: `/[locale]/(dashboard|create)/...`
- Default locale: English (`en`), supported: `['en', 'ja', 'zh']`
- Admin routes (`/admin/*`) bypass internationalization
- Middleware in `src/middleware.ts` handles locale routing

**2. Authentication & Authorization:**
- JWT-based auth system with `useAuth` hook
- Admin authentication separate from user auth
- Database connection via MySQL pool in `src/lib/admin/db.ts`

**3. Real-time Features:**
- SSE implementation with `useSSEManager` hook and `SSEProvider` context
- Handles notifications for image, video, and upscale operations
- Auto-reconnection logic with exponential backoff
- Browser notification integration

**4. API Architecture:**
- External API integration via `config.apiUrl` (localhost:8090 dev, api.katin.org prod)
- RESTful routes in `src/app/api/` for auth, uploads, and works
- Video service abstraction in `src/lib/api/videoService.ts`

### Important Directory Structure

```
src/
├── app/                     # Next.js App Router
│   ├── [locale]/           # Internationalized routes
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   └── (create)/       # Video/image creation tools
│   ├── admin/              # Admin panel (no i18n)
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication components
│   ├── video/              # Video-related components
│   ├── image/              # Image processing components
│   ├── home/               # Home page components
│   ├── profile/            # User profile components
│   ├── common/             # Shared common components
│   └── library/            # Library/dashboard components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and services
│   ├── auth/               # Authentication utilities
│   ├── api/                # API service abstractions
│   └── utils/              # General utilities
├── services/               # Business logic types
├── contexts/               # React context providers
├── types/                  # TypeScript type definitions
└── messages/               # Internationalization messages
```

### Component Patterns
- Uses **shadcn/ui** component library with Radix UI primitives
- **Server-Side Events** handled via context providers
- **Route groups** for layout organization: `(dashboard)`, `(create)`
- **TypeScript interfaces** defined in `src/lib/types.ts` and service-specific files

### Database & External Services
- **MySQL** connection pooling with environment-based configuration
- **AWS S3** integration for file uploads
- **External API** for AI video/image generation services
- **JWT** token management for session handling

### Development Notes
- ESLint is disabled during build process via `DISABLE_ESLINT_PLUGIN=true`
- Uses **Geist** fonts (Sans + Mono variants)
- **Prettier** configured for code formatting
- TypeScript strict mode enabled
- Image optimization configured for multiple domains (Unsplash, CDN endpoints)
- Internationalization with `next-intl` plugin integration

### Configuration Files
- `next.config.mjs` - Next.js configuration with i18n plugin and image domains
- `src/middleware.ts` - Route handling for admin bypass and locale routing
- `src/i18n/routing.ts` - Internationalization routing configuration
- `src/config.ts` - Environment-based API URL configuration
- `components.json` - shadcn/ui component configuration