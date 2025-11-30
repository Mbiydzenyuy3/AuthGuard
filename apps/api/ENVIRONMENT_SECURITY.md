# 🔒 Environment Variables Security Guide

## Overview

This guide covers secure environment variable management for the AuthGuard API, ensuring sensitive data protection across development, staging, and production environments.

## 🔑 Security Hierarchy

### 1. **Development Environment** (Local)

```bash
# .env.local (gitignored)
NODE_ENV=development
PORT=3000

# Database (Local/Development)
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=leilaauth
DB_PASSWORD=development-password
DB_NAME=devguard_db

# AWS Cognito (Development/Test)
AWS_REGION=us-east-1
AWS_COGNITO_CLIENT_ID=your-dev-client-id
AWS_COGNITO_USER_POOL_ID=us-east-1_m8D68se8M
AWS_COGNITO_AUTH_FLOW=USER_PASSWORD_AUTH
```

### 2. **Staging Environment** (Pre-Production)

```bash
# Environment variables set at platform level
NODE_ENV=staging
PORT=3000

# Database (Staging/Pre-Prod)
DB_HOST=staging-db.example.com
DB_PORT=5432
DB_USERNAME=staging_user
DB_PASSWORD=<from staging secrets manager>
DB_NAME=staging_guard_db

# AWS Cognito (Staging)
AWS_REGION=us-east-1
AWS_COGNITO_CLIENT_ID=<from staging secrets manager>
AWS_COGNITO_USER_POOL_ID=<from staging secrets manager>
```

### 3. **Production Environment** (Live)

```bash
# Environment variables set at platform level (never in files)
NODE_ENV=production
PORT=3000

# Database (Production)
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USERNAME=<from prod secrets manager>
DB_PASSWORD=<from prod secrets manager>
DB_NAME=prod_guard_db

# AWS Cognito (Production)
AWS_REGION=<from prod secrets manager>
AWS_COGNITO_CLIENT_ID=<from prod secrets manager>
AWS_COGNITO_USER_POOL_ID=<from prod secrets manager>
```

## 🛡️ Security Best Practices

### 1. **Never Commit Sensitive Data**

```bash
# .gitignore
.env.local
.env.*.local
node_modules/
dist/
*.log
```

### 2. **Use Strong Passwords**

```bash
# Development (minimum)
DB_PASSWORD=authservice237  # 16+ chars, mixed case, numbers, symbols

# Production (minimum)
DB_PASSWORD=<32+ chars, random, from secrets manager>
```

### 3. **Secrets Management**

```bash
# Development
- Use .env.local (gitignored)
- Rotate passwords regularly
- Use different credentials for each project

# Production
- Use AWS Secrets Manager / HashiCorp Vault / Azure Key Vault
- Never store in code or files
- Automate rotation
- Use IAM roles where possible
```

### 4. **Code Security**

```typescript
// Good: Using ConfigService with validation
const password = process.env.DB_PASSWORD;
if (!password || typeof password !== 'string') {
  throw new Error('DB_PASSWORD must be configured');
}

// Better: Using environment validation library
import * as convict from 'convict';

const config = convict({
  database: {
    password: {
      default: '',
      env: 'DB_PASSWORD',
      validate: (val: string) => {
        if (val.length < 12) {
          throw new Error('Password must be at least 12 characters');
        }
      },
    },
  },
});
```

## 🔄 Environment-Specific Configuration

### Current Implementation Analysis

```typescript
// apps/api/src/database/database.module.ts
// ✅ Good: Supports both naming conventions
const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD;

// ✅ Good: Fallback validation
if (!password || typeof password !== 'string') {
  throw new Error('Database password must be configured');
}
```

### Production Deployment Strategy

```yaml
# docker-compose.prod.yml
services:
  authguard-api:
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - AWS_REGION=${AWS_REGION}
      - AWS_COGNITO_USER_POOL_ID=${AWS_COGNITO_USER_POOL_ID}
      - AWS_COGNITO_CLIENT_ID=${AWS_COGNITO_CLIENT_ID}
    secrets:
      - db_password
      - aws_credentials

secrets:
  db_password:
    external: true
  aws_credentials:
    external: true
```

## 🚀 Deployment Recommendations

### 1. **AWS ECS/Fargate**

```json
{
  "secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
    },
    {
      "name": "AWS_COGNITO_USER_POOL_ID",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:cognito-config"
    }
  ],
  "environment": [
    {
      "name": "NODE_ENV",
      "value": "production"
    }
  ]
}
```

### 2. **Railway/Heroku**

```bash
# Use platform environment variables
railway variables set DB_PASSWORD=production-password
railway variables set AWS_REGION=us-east-1
```

### 3. **Vercel/Netlify**

```bash
# Use platform environment variables
vercel env add DB_PASSWORD production
vercel env add AWS_REGION production
```

## ✅ Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded passwords in code
- [ ] Database passwords are 16+ characters
- [ ] Production secrets use secrets manager
- [ ] Environment validation implemented
- [ ] Different credentials per environment
- [ ] Regular password rotation schedule
- [ ] IAM roles used where possible
- [ ] Secrets never logged or exposed
- [ ] Environment-specific configuration

## 🔍 Monitoring and Alerting

```typescript
// Security monitoring
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DB_PASSWORD) {
    // Alert security team
    console.error('CRITICAL: Missing production database password');
    process.exit(1);
  }

  // Log configuration validation
  console.log('✅ Production environment validated');
}
```

This approach ensures your AuthGuard API maintains the highest security standards while supporting flexible development workflows.
