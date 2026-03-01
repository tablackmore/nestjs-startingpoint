# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

NestJS e-learning API starter project built with TypeScript. Provides a RESTful CRUD API for managing courses, with Swagger/OpenAPI documentation, Winston logging, validation, and security headers. Currently uses in-memory storage (no database connected).

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS 11
- **Language**: TypeScript 5.9
- **Testing**: Jest 30 + Supertest 7
- **Linting**: ESLint 9 (flat config, typescript-eslint) + Prettier 3
- **Logging**: Winston (via nest-winston) with daily rotate file
- **Validation**: class-validator 0.15 + class-transformer via NestJS ValidationPipe
- **API Docs**: Swagger/OpenAPI via @nestjs/swagger 11
- **Container**: Docker (node:18.12.0 base image)

## Commands

```bash
# Install dependencies
npm install

# Start the application
npm run start          # Standard start
npm run start:dev      # Watch mode (development)
npm run start:debug    # Debug mode with watch
npm run start:prod     # Production (runs compiled dist/main)

# Build
npm run build          # Compiles TypeScript to dist/

# Testing
npm test               # Run all unit/spec tests (Jest)
npm run test:watch     # Watch mode
npm run test:cov       # With coverage report
npm run test:e2e       # E2E tests (uses test/jest-e2e.json config)

# Code quality
npm run lint           # ESLint with --fix on src/, test/, apps/, libs/
npm run format         # Prettier on src/ and test/
```

## Project Structure

```
src/
├── main.ts                          # Application bootstrap (Swagger, validation, security, logging)
├── config/
│   └── configuration.ts             # Centralized config (app, database, auth) via @nestjs/config
├── common/
│   └── logger/
│       └── logger.module.ts         # Winston logger setup (console + daily rotate file)
├── middleware/
│   └── security-headers.middleware.ts  # Security headers (CSP, HSTS, X-Frame-Options, etc.)
└── modules/
    ├── app.module.ts                # Root module (imports ConfigModule, ElearningModule)
    └── elearning/
        ├── elearning.module.ts      # Feature module
        ├── elearning.controller.ts  # REST controller with Swagger decorators
        ├── elearning.service.ts     # Business logic (in-memory CRUD)
        ├── elearning.controller.spec.ts  # E2E-style tests using Supertest
        ├── elearning.service.spec.ts     # Unit tests for service
        ├── dtos/
        │   └── course.dto.ts        # DTO with class-validator + Swagger decorators
        └── interfaces/
            └── course.interface.ts  # TypeScript interface for Course entity
```

## Architecture Patterns

### Module Organization
Each feature is a self-contained NestJS module with its own controller, service, DTOs, and interfaces. The root `AppModule` imports feature modules and `ConfigModule`.

### Controller Pattern
- Controllers use `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiBody` decorators for full Swagger documentation
- Route parameters use NestJS `@Param()` and `@Body()` decorators
- Controllers throw `NotFoundException` for missing resources

### Service Pattern
- Services are `@Injectable()` and contain business logic
- The current implementation uses an in-memory array for storage
- Services generate UUIDs (via `uuid` package) for new entities

### DTO Pattern
- DTOs use `class-validator` decorators (`@IsString`, `@IsNotEmpty`, `@IsOptional`, `@IsISO8601`) for validation
- DTOs use `@ApiProperty` decorators for Swagger documentation
- Global `ValidationPipe` is configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`

## Testing Conventions

### Test File Naming
- Unit tests: `*.spec.ts` (co-located with source files)
- Jest config rootDir is `src/`, test regex: `.*\.spec\.ts$`

### Test Structure
- Tests use the **GIVEN / WHEN / THEN** pattern in comments
- Controller tests use Supertest against a real NestJS application instance (`Test.createTestingModule` + `app.init()`)
- Service tests instantiate the service directly without the NestJS testing module
- Each test case uses `beforeEach` to create a fresh app/service instance

### Writing Tests
When adding new features, follow these patterns:
- **Service tests**: Direct instantiation, test each CRUD operation independently
- **Controller tests**: Use Supertest with full app bootstrap, test HTTP status codes and response bodies, test validation rejection for invalid input

## Code Style

### Prettier
- Single quotes: `true`
- Trailing commas: `all`

### ESLint
- Uses flat config format (`eslint.config.mjs`)
- Based on `typescript-eslint` recommended config + `eslint-plugin-prettier/recommended`
- Disabled rules: `explicit-function-return-type`, `explicit-module-boundary-types`, `no-explicit-any`

### TypeScript
- Target: ES2021, Module: CommonJS
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict mode is NOT enabled (`strictNullChecks: false`, `noImplicitAny: false`)

## Configuration

The app uses `@nestjs/config` with a centralized configuration file at `src/config/configuration.ts`. Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | `3000` | Server port |
| `APP_NAME` | `Cosafe API` | Application name (shown in Swagger) |
| `DB_TYPE` | `postgres` | Database type (not yet connected) |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `DB_DATABASE` | `testdb` | Database name |
| `JWT_SECRET` | `your_secret_here` | JWT secret key |
| `JWT_EXPIRATION_TIME` | `60s` | JWT expiration |
| `LOG_LEVEL` | `info` | Winston log level |
| `LOG_DIR` | `./logs` | Log file directory |

## Security

- Custom middleware adds security headers: CSP, X-Content-Type-Options, X-Frame-Options, HSTS, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- `x-powered-by` header is disabled
- Global ValidationPipe strips unknown properties and rejects non-whitelisted fields

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on PRs to `main`:
1. Install dependencies (`npm install`)
2. Run linter (`npm run lint`)
3. Run tests (`npm test`)
4. Build Docker image (tagged as `{package-name}:pr-{number}`)

## Swagger/OpenAPI

Available at `/api` when the application is running. Configured in `main.ts` using `DocumentBuilder`.

## Docker

The Dockerfile builds a production image:
- Base: `node:18.12.0`
- Installs deps, builds TypeScript, exposes port 3000
- Runs `node dist/main`

## Adding a New Feature Module

1. Create a new directory under `src/modules/{feature-name}/`
2. Create the module, controller, service, DTOs, and interfaces
3. Add Swagger decorators to all controller methods and DTO properties
4. Add class-validator decorators to all DTO properties
5. Import the new module in `AppModule`
6. Write service unit tests (`*.spec.ts`) and controller integration tests using Supertest
7. Run `npm run lint` and `npm test` before committing
