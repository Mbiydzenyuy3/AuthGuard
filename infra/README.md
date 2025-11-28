## DevGuard Infrastructure

This document explains the AWS infrastructure powering the DevGuard authentication platform. It is written so every team member—backend, frontend, DevOps—can understand how the system works, why design decisions were made, and how the components communicate.

### High-Level Architecture

Internet
│
▼
API Gateway (REST API)
│ — via VPC Link (private)
▼
ECS Fargate Service (Node.js API on port 3000)
│
▼
Amazon RDS (PostgreSQL)

#### Additional services:

- CloudWatch Logs (application + API Gateway)

- CloudWatch Alarms (CPU, memory)

- SNS (alert notifications)

- Secrets Manager (DB credentials)

- VPC with private subnets + egress

- This setup ensures:

- secure containerized compute

- private networking for the API

- tightly controlled access to the database

- proper monitoring and alerting

- minimal attack surface

### Stack Overview: ComputeStack

This stack deploys:

Component Purpose

- ECS Fargate Cluster Runs the Node.js API
- ECS Service + Task Definition Defines container resources, env vars, logging
- API Gateway Public entry point for all API requests
- VPC Link Connects API Gateway to ECS privately
- Security Groups Control traffic boundaries
- RDS Security Integration ECS ↔ Database connection
- CloudWatch Logs Application + API Gateway logging
- CloudWatch Alarms CPU + memory alerts
- SNS Topic Sends alarm notifications
- EventBridge Rule Periodic ECS health checks
- Infrastructure Components Explained
- VPC & Networking
- Private ECS Security Group

- Allows traffic only from inside the VPC.

- Only API Gateway (via VPC Link) can reach the API.

- Allows ECS → RDS traffic on port 5432.

- Public ECS Security Group (Temporary / Debugging Only)

#### ec2.Peer.ipv4('0.0.0.0/0') (development only)

⚠️ This is NOT used in production.
You replace this with your IP when debugging or remove it entirely in production.

#### ECS Fargate Cluster

Runs the Node.js API container.

- Task Definition Includes

- CPU: 256

- Memory: 512 MiB

- AWS logging driver

- Database connection env variables

- Secrets from Secrets Manager

- IAM roles for ECS, CloudWatch, and secret access

- The container image is built from the monorepo:

root/
├── api/
├── web/
├── docs/
├── packages/
├── infra/
└── Dockerfile ← used by CDK

Using:

ecs.ContainerImage.fromAsset(rootAssetPath)

- API Gateway (Public Entry Point)
  Why API Gateway?

Because it provides:

authentication + authorization integration (Cognito)

request validation

rate limiting

traffic throttling

logging

custom domains

production scalability

WAF support

Important: ECS is not exposed publicly.

All requests flow:
Internet → API Gateway → VPC Link → ECS (private subnet)

No direct internet traffic touches the ECS service.

VPC Link → ECS Integration

API Gateway needs to talk to ECS privately.
This is done via:

new apigateway.VpcLink(...)

Then:

type: HTTP_PROXY
uri: http://service-name.local:3000/{proxy}

This creates a secure private connection between API Gateway and ECS.

- Database (RDS PostgreSQL)

ECS tasks receive:

host

port

db name

credentials via Secrets Manager

Networking rules only allow:

ECS → RDS (never the opposite)

No public access to RDS

No external IP can reach the database

Monitoring & Logging
CloudWatch Logs

ECS task logs (api-\*)

API Gateway access logs

Log retention: 1 week for ECS, 1 month for API Gateway

CloudWatch Alarms

Alerts fired when:

CPU > 80% for 2 minutes

Memory > 80% for 2 minutes

SNS Notifications

All alarm events are sent to this SNS Topic:

DevGuardAlarmTopic

The team can subscribe via:

email

webhook

Slack (via SNS → Lambda → Slack)

EventBridge Health Check (Optional)

Runs every 5 minutes.
Used for custom health checks, ECS task monitoring, scaling decisions, etc.
Currently a placeholder for future development.

- Security Principles Used
  ✔ Principle of Least Privilege

ECS task role grants only log + secret access

RDS only accepts traffic from ECS SG

API Gateway is the only public entry point

✔ Private Compute Layer

ECS tasks run privately

No public IP

No internet inbound except through API Gateway

✔ Temporary Debugging Ports

The public SG rule exists only for debugging.
Not used in production.

✔ Secret Management

All DB credentials stored in AWS Secrets Manager, never in code.

- How the Team Should Work With This
  For Backend Developers

Your API runs inside ECS Fargate

Logs appear in CloudWatch under /aws/ecs/api

Deploying code updates automatically via CDK/ECR build

For Frontend Developers

Use the API Gateway URL (provided in CloudFormation Outputs)

For DevOps

Adjust scaling in CDK (minCapacity, maxCapacity)

Attach WAF to API Gateway for additional protection

Add IP allowlists for production clients if needed

### CloudFormation Outputs

After deployment, CDK prints:

Output Meaning
ApiUrl Public API Gateway endpoint
ECSServiceName ECS service for scaling/monitoring
DevGuardAlarmTopicArn SNS topic for alerts

### Deployment

Assuming you have AWS credentials configured:

cd infra
npm install
cdk bootstrap
cdk deploy

### Summary

- The DevGuard infrastructure is:

- Secure (private ECS, API Gateway fronting everything)

- Scalable (auto scaling, Fargate)

- Monitored (CloudWatch, alarms, SNS)

- Modular (clean split into network, database, compute stacks)

#### Production-grade

Your ECS tasks never face the public internet.
Your API is protected by API Gateway’s built-in security features.
Your database is locked behind private networking.

This architecture is both maintainable today and scalable for future growth.
