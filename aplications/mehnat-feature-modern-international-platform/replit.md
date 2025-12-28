# Overview

UzTrain Platform is a comprehensive educational platform designed specifically for Uzbekistan Railway employees. It serves as a digital learning hub for safety training, professional development, and regulatory compliance in the railway industry. The application provides multilingual support (Uzbek, Russian, English) and offers various educational materials including documents, videos, presentations, and interactive content.

The platform features a modern, responsive design built with React and TypeScript, offering both online and offline functionality through Progressive Web App (PWA) capabilities. It includes comprehensive material management, user analytics, and admin controls for content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application follows a modern React architecture with TypeScript for type safety:

- **Framework**: React 18+ with TypeScript and Vite for fast development and building
- **State Management**: React hooks and context for local state, with Tanstack Query for server state management
- **Routing**: React Router for client-side navigation with lazy loading for code splitting
- **UI Framework**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **Internationalization**: i18next for multi-language support (Uzbek, Russian, English)

## Design System

- **Component Library**: Custom components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors and responsive design
- **Theme System**: Dark/light mode support with system preference detection
- **Brand Integration**: Custom theme toggle with railway-specific color schemes

## Data Architecture

The application uses a hybrid data approach:

- **Primary Database**: Supabase (PostgreSQL) for production data storage
- **Fallback System**: Local database fallback when Supabase is unavailable
- **Smart Database Layer**: Custom abstraction that automatically switches between online and offline storage
- **File Storage**: Supabase Storage for file uploads with local caching

## Authentication and Authorization

- **Authentication Provider**: Supabase Auth
- **Role-based Access**: Admin and user roles with different permission levels
- **Session Management**: Secure token-based authentication with refresh token support

## Performance Optimizations

- **Code Splitting**: Lazy loading of routes and components
- **Caching Strategy**: Service worker caching for offline functionality
- **Bundle Optimization**: Separate vendor, UI, and utility chunks for efficient loading
- **Image Optimization**: Responsive images with proper sizing and formats

## PWA Features

- **Offline Support**: Service worker with network-first caching strategy
- **Installation**: Web app manifest for app-like installation experience
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Performance**: Lighthouse-optimized for best practices

# External Dependencies

## Backend Services

- **Supabase**: Primary backend-as-a-service providing PostgreSQL database, authentication, real-time subscriptions, and file storage
- **Supabase Storage**: File hosting service for documents, videos, and images with bucket-based organization

## Development and Build Tools

- **Vite**: Fast build tool and development server with hot module replacement
- **Vercel**: Deployment platform with serverless functions and edge network
- **ESLint**: Code linting with TypeScript and React-specific rules
- **TypeScript**: Static type checking for enhanced developer experience

## UI and Styling Libraries

- **Radix UI**: Headless component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide Icons**: Modern icon library with consistent design
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Data Management

- **Tanstack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form handling with validation and performance optimization
- **Zod**: Schema validation for type-safe data parsing

## Media and File Handling

- **React PDF**: PDF viewing and rendering capabilities
- **File System Access**: Browser-based file operations for uploads and downloads
- **Media Queries**: Responsive design utilities for different screen sizes

## Internationalization and Localization

- **i18next**: Internationalization framework with language detection
- **date-fns**: Date manipulation and formatting with locale support

## Analytics and Monitoring

- **Custom Analytics**: Built-in usage tracking and user behavior analytics
- **Error Boundary**: React error boundaries for graceful error handling
- **Performance Monitoring**: Web vitals tracking and performance optimization

## Testing Infrastructure

- **Vitest**: Fast unit testing framework with React Testing Library integration
- **Testing Library**: Component testing utilities for React applications
- **Coverage Reporting**: Code coverage analysis and reporting