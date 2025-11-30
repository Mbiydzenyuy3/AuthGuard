# AuthGuard (DevGuard)

A comprehensive authentication and authorization service built with modern technologies, providing secure user management, session handling, and developer SDK integration.

![DevGuard](https://img.shields.io/badge/authentication-service-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)

## 🚀 Overview

DevGuard is a production-ready authentication service that provides enterprise-grade security features. Built with scalability and developer experience in mind, it offers a complete solution for user authentication, session management, and API key generation - serving as an alternative to services like Clerk.

### ✨ Key Features

- **🔐 Secure Authentication**: AWS Cognito integration with JWT tokens
- **👥 User Management**: Complete user lifecycle management
- **🔑 API Key Management**: Developer-friendly SDK integration
- **📊 Session Tracking**: Advanced session management and monitoring
- **🛡️ Security First**: Multi-layered security with automatic cleanup
- **📱 SDK Ready**: JavaScript SDK for easy integration
- **🌐 Cloud Ready**: AWS CDK infrastructure for deployment
- **📖 API Documentation**: Auto-generated Swagger documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   NestJS API    │    │   PostgreSQL    │
│   Dashboard     │◄──►│   (Port 3000)   │◄──►│   Database      │
│   (Port 4000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────┤   AWS Cognito   │──────────────┘
                        │   User Pool     │
                        └─────────────────┘
```

### 🛠️ Tech Stack

- **Backend API**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Authentication**: AWS Cognito, JWT, Refresh Tokens
- **Frontend**: Next.js, React, TypeScript
- **Infrastructure**: AWS CDK, Node.js 18+
- **Development**: Monorepo(Turborepo), ESLint, Prettier, Husky
- **Database**: PostgreSQL with TypeORM
- **Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS Account (for Cognito integration)
- pnpm (recommended package manager)

### Clone the Repository

```bash
# Clone the repository
git clone git@github.com:Mbiydzenyuy3/AuthGuard.git
cd authguard

# Install dependencies
pnpm install or npm (your preference)
```

### Environment Setup

Create environment files for each service:

#### API Service (`apps/api/.env`)

```env example
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/authguard
NODE_ENV=development

# AWS Cognito
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-client-secret

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=2592000

# API Configuration
PORT=3000
API_BASE_URL=http://localhost:3000
```

#### Dashboard Service (`apps/dashboard/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=your-public-api-key
NODE_ENV=development
```

### Database Setup

```bash
# Create PostgreSQL database
createdb authguard

# Run migrations (if any)
cd apps/api
pnpm run build
pnpm run start:dev
```

### Development Scripts

Start all services in development mode:

```bash
# Start all applications in parallel
pnpm run dev

# Start specific service
pnpm turbo run dev --filter=api      # API only
pnpm turbo run dev --filter=dashboard # Dashboard only
pnpm turbo run dev --filter=docs     # Documentation only

# Build applications
pnpm run build

# Run linting
pnpm run lint

# Format code
pnpm run format
```

## 📖 Services Overview

### 🖥️ API Service (`apps/api`)

**Port: 3000**

The core authentication API built with NestJS, providing:

- User authentication endpoints
- Session management
- API key generation and management
- Swagger documentation at `/api/docs`

#### Key Endpoints:

```
POST   /auth/signup          # User registration
POST   /auth/login           # User login
POST   /auth/logout          # User logout
POST   /auth/refresh         # Refresh access token
POST   /auth/forgot-password # Password reset request
POST   /auth/reset-password  # Password reset confirmation

GET    /users/profile        # Get user profile
PUT    /users/profile        # Update user profile
DELETE /users/account        # Delete user account

GET    /api-keys             # List user API keys
POST   /api-keys             # Generate new API key
DELETE /api-keys/:id         # Revoke API key

GET    /sessions             # List user sessions
DELETE /sessions/:id         # Revoke specific session
DELETE /sessions             # Revoke all sessions
```

### 🖼️ Dashboard (`apps/dashboard`)

**Port: 4000**

Modern Next.js admin dashboard for managing:

- User accounts and profiles
- Session monitoring and management
- API key generation and oversight
- Authentication analytics

### 📚 Documentation (`apps/docs`)

**Port: 3001**

Comprehensive developer documentation including:

- API reference
- Integration guides
- SDK documentation
- Best practices

## 🛡️ Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cognito
    participant Database

    Client->>API: POST /auth/login
    API->>Cognito: Validate credentials
    Cognito-->>API: Authentication tokens
    API->>Database: Store session
    API-->>Client: Access + Refresh tokens

    Client->>API: API request + Access token
    API->>API: Validate JWT
    API-->>Client: Protected resource

    Note over Client,API: Refresh flow when token expires
    Client->>API: POST /auth/refresh
    API->>Database: Validate refresh token
    API-->>Client: New access token
```

## 🔧 Configuration

### AWS Cognito Setup

1. Create a User Pool in AWS Cognito
2. Configure app client with OAuth settings
3. Set up custom attributes if needed
4. Update environment variables with your pool details

### API Key Management

API keys are automatically generated for developers to integrate with your service:

```javascript
// SDK Integration Example
import { AuthKeyClient } from '@devguard/sdk-js';

const client = new AuthKeyClient({
  apiUrl: 'http://localhost:3000',
  apiKey: 'your-api-key',
});

// Make authenticated requests
await client.users.getProfile();
```

## 🚀 Deployment

### Using AWS CDK Infrastructure

```bash
# Build and deploy infrastructure
cd infra
pnpm run build
pnpm run deploy

# Or deploy specific services
cd apps/api
pnpm run build
docker build -t authguard-api .
docker push your-registry/authguard-api
```

### Environment Variables for Production

Ensure all production environment variables are configured:

- Database connection strings
- AWS credentials and region
- JWT secrets (use secure key management)
- API URLs and CORS settings

## 📊 Monitoring & Analytics

The API provides built-in monitoring for:

- Authentication success/failure rates
- Session lifecycle tracking
- API key usage analytics
- Security event logging

Access metrics at `/api/metrics` (when configured).

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm test --filter=api
pnpm test --filter=dashboard

# Run tests with coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

```bash
# Install husky hooks (automatic on install)
# Code will be automatically formatted and linted on commit
git add .
git commit -m "Your commit message"
```

## 📝 API Documentation

Once the API is running, visit:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI Spec: `http://localhost:3000/api/docs-json`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Token Rotation**: Automatic token refresh with security
- **Session Management**: Track and manage active sessions
- **API Key Security**: Secure API key generation and validation
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive request validation
- **Security Headers**: CORS and security header configuration

## 📞 Support

- **Documentation**: Visit our docs at `/docs`
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join our GitHub Discussions
- **Email**: support@authguard.dev

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using modern web technologies**

_AuthGuard - Secure, Scalable, Developer-Friendly Authentication_
