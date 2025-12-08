# DevGuard Deployment Guide & Best Practices

## Project Overview

**DevGuard** is a full-stack authentication service with the following components:

- **Frontend**: Next.js dashboard application (`apps/dashboard`)
- **Backend**: NestJS API with Cognito authentication (`apps/api`)
- **Infrastructure**: AWS CDK infrastructure as code (`infra`)

## Application Architecture

### 🏗️ Infrastructure Stack

Your infrastructure is well-structured with AWS CDK:

1. **Network Stack** (`network-stack.ts`)
   - VPC with Public and Private subnets
   - Database security group (PostgreSQL access)
   - Multi-AZ deployment (2 AZs)

2. **Database Stack** (`database-stack.ts`)
   - RDS PostgreSQL instance (t3.micro, 20GB)
   - Private subnet deployment
   - Secrets Manager integration
   - Backup retention (1 day)

3. **Authentication Stack** (`auth-stack.ts`)
   - Cognito User Pool
   - Self-signup enabled
   - Email verification
   - Custom attributes (projectId)

4. **Compute Stack** (`compute-stack.ts`)
   - ECS Fargate service
   - Network Load Balancer
   - API Gateway integration
   - Auto-scaling (1-4 tasks)
   - CloudWatch monitoring

5. **Frontend Stack** (`frontend-stack.ts`)
   - S3 bucket for static hosting
   - CloudFront CDN
   - HTTPS enforcement

### 🔐 Authentication Flow

```
Frontend (Next.js) → API Gateway → NestJS API → Cognito → RDS
     ↓                   ↓             ↓          ↓        ↓
   User Action → JWT Token → Validate → User Pool → Session Data
```

**Authentication Flow Details:**

1. **User Registration/Signup**
   - Frontend: `SignUpForm` → `/api/auth/signup`
   - API: `AuthController.signup()` → `CognitoService.signUp()`
   - Cognito: Creates user, sends verification email

2. **Email Confirmation**
   - User clicks email link → `ConfirmSignupForm`
   - API: `AuthController.confirmSignup()` → `CognitoService.confirmSignUp()`

3. **Login**
   - Frontend: `SignInForm` → `/api/auth/login`
   - API: `AuthController.login()` → `CognitoService.login()`
   - Returns: AccessToken, RefreshToken, ExpiresIn, TokenType

4. **Token Management**
   - Frontend stores tokens in localStorage
   - API uses JWT guard for protected routes
   - Refresh tokens handled via session service

### 📦 Package Structure

- **Root**: Monorepo with Turbo
- **API**: NestJS with TypeORM, Swagger, JWT guards
- **Dashboard**: Next.js 15 with React 18, Tailwind CSS, shadcn/ui
- **Infrastructure**: AWS CDK with TypeScript

## Deployment Best Practices

### 🐳 Container Configuration

**Current Dockerfile (apps/api/Dockerfile.aws):**

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api
RUN npm install -g pnpm
RUN pnpm install --filter "./apps/api..."
WORKDIR /app/apps/api
RUN pnpm build
CMD ["node", "dist/main.js"]
```

**Recommended Improvements:**

1. **Multi-stage build** for smaller image size
2. **Production-optimized** dependencies
3. **Health check** endpoint
4. **Security hardening**

**Improved Dockerfile:**

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/apps/api
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./
USER nestjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

### 🔧 Environment Configuration

**Current Environment Variables:**

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_COGNITO_CLIENT_ID=your-client-id
AWS_COGNITO_USER_POOL_ID=your-pool-id

# Database (Production)
DATABASE_HOST=devguard-db.cmlskysouxl2.us-east-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_USERNAME=DevGuard
DATABASE_PASSWORD=Authservicepassword237
DATABASE_NAME=DevGuard
```

**Security Best Practices:**

1. **Never commit** `.env` files with real credentials
2. **Use AWS Secrets Manager** for all sensitive data
3. **Rotate credentials** regularly
4. **Use IAM roles** instead of access keys where possible

### 🚀 Deployment Steps

#### Step 1: Prerequisites

```bash
# Install AWS CLI
aws configure

# Install CDK
npm install -g aws-cdk

# Install dependencies
pnpm install
```

#### Step 2: Build Applications

```bash
# Build API
pnpm build:api

# Build Dashboard
pnpm build:dashboard
```

#### Step 3: Deploy Infrastructure

```bash
cd infra

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy all stacks
cdk deploy --all
```

#### Step 4: Build and Push Docker Image

```bash
# Build API image
docker build -f apps/api/Dockerfile.aws -t devguard-api:latest .

# Tag for ECR
docker tag devguard-api:latest 738095763532.dkr.ecr.us-east-1.amazonaws.com/devguard-api:latest

# Push to ECR (ensure you're authenticated)
docker push 738095763532.dkr.ecr.us-east-1.amazonaws.com/devguard-api:latest
```

#### Step 5: Update Frontend Environment

Update `apps/dashboard/.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

### 🔒 Security Recommendations

#### API Security

1. **Rate Limiting**: Implement rate limiting for auth endpoints
2. **Input Validation**: Add class-validator pipes globally
3. **CORS Configuration**: Restrict origins to your domain
4. **Helmet**: Add security headers
5. **Request Logging**: Implement structured logging

**Example Security Middleware:**

```typescript
// In main.ts
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many auth attempts, please try again later.',
  }),
);
```

#### Infrastructure Security

1. **VPC Endpoints**: Use private endpoints for AWS services
2. **Security Groups**: Restrict database access to ECS only
3. **WAF**: Add Web Application Firewall
4. **SSL/TLS**: Ensure all traffic is encrypted

### 📊 Monitoring & Observability

#### CloudWatch Integration

Your CDK already includes:

- ECS service scaling alarms
- CPU/Memory utilization monitoring
- SNS notifications

**Additional Monitoring:**

```typescript
// Add to compute-stack.ts
const logGroup = new logs.LogGroup(this, 'ApiLogGroup', {
  retention: logs.RetentionDays.ONE_MONTH,
});

// Custom metrics
const apiLatency = new cloudwatch.Metric({
  namespace: 'DevGuard/API',
  metricName: 'Latency',
  dimensionsMap: { Service: 'API' },
  statistic: cloudwatch.Statistic.AVERAGE,
});
```

### 🔄 CI/CD Pipeline

**Recommended GitHub Actions Workflow:**

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build applications
        run: |
          pnpm build:api
          pnpm build:dashboard

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy CDK
        run: |
          cd infra
          cdk deploy --all --require-approval never

      - name: Build and push Docker image
        run: |
          docker build -f apps/api/Dockerfile.aws -t devguard-api:latest .
          docker tag devguard-api:latest $ECR_REGISTRY/devguard-api:latest
          docker push $ECR_REGISTRY/devguard-api:latest
```

### 🌐 Frontend Integration

**Current API Integration (`apps/dashboard/lib/api.ts`):**

- Uses `ky` HTTP client
- Automatic token refresh on 401
- LocalStorage for token persistence

**Recommended Improvements:**

1. **Token Refresh**: Implement automatic token refresh
2. **Request Interceptors**: Add auth headers automatically
3. **Error Handling**: Global error boundary
4. **Offline Support**: Service worker for offline functionality

**Enhanced API Client:**

```typescript
const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 && getRefreshToken()) {
          try {
            await refreshAuthToken();
            // Retry original request
            return api(request);
          } catch (error) {
            clearAuthTokens();
            window.location.href = '/signin';
          }
        }
      },
    ],
  },
});
```

### 📋 Deployment Checklist

#### Pre-Deployment

- [ ] Environment variables configured
- [ ] AWS credentials configured
- [ ] CDK bootstrapped
- [ ] Docker image built and pushed
- [ ] Database migrations ready

#### Deployment

- [ ] Deploy infrastructure stacks
- [ ] Update ECS service with new image
- [ ] Update frontend environment variables
- [ ] Deploy frontend to S3/CloudFront

#### Post-Deployment

- [ ] Verify API health endpoints
- [ ] Test authentication flow
- [ ] Check CloudWatch logs
- [ ] Verify monitoring alerts
- [ ] Test user registration/login

### 🛠️ Troubleshooting

#### Common Issues

1. **API Gateway 502 Errors**
   - Check ECS service health
   - Verify target group health check
   - Check security group rules

2. **Cognito Authentication Failures**
   - Verify User Pool configuration
   - Check client ID and region
   - Confirm email verification settings

3. **Database Connection Issues**
   - Check security group rules
   - Verify database credentials in Secrets Manager
   - Confirm VPC configuration

### 📈 Performance Optimization

#### API Optimizations

1. **Connection Pooling**: Configure TypeORM connection pool
2. **Caching**: Add Redis for session storage
3. **Compression**: Enable gzip compression
4. **CDN**: Use CloudFront for static assets

#### Database Optimizations

1. **Indexing**: Add indexes for frequently queried columns
2. **Connection Pool**: Configure RDS proxy
3. **Read Replicas**: Add read replicas for scaling

## Next Steps

1. **Implement security improvements** mentioned above
2. **Set up CI/CD pipeline** for automated deployments
3. **Add comprehensive monitoring** and alerting
4. **Implement backup and disaster recovery**
5. **Consider microservices architecture** for future scaling

Your codebase is well-structured and follows good practices. The main areas for improvement are security hardening, monitoring, and operational excellence.
