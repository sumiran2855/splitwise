# Production-Ready Backend Architecture in Next.js

This document explains the complete backend architecture implemented using Next.js App Router API routes with TypeScript, MongoDB, and clean architecture principles.

## Architecture Overview

The backend follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── config/           # Database configuration
├── domain/           # Business entities and value objects
│   ├── entities/    # Core business entities (User, Expense, etc.)
│   └── value-objects/ # Value objects (Money, etc.)
├── repositories/     # Data access layer
│   ├── interfaces/  # Repository contracts
│   └── implementations/ # MongoDB implementations
├── services/         # Business logic layer
│   ├── interfaces/  # Service contracts
│   └── implementations/ # Service implementations
├── controllers/      # API route handlers
├── lib/            # Database models
├── utils/          # Utilities and helpers
│   ├── strategies/ # Strategy pattern implementations
│   ├── factories/  # Factory pattern implementations
│   └── errors/     # Custom error classes
├── types/          # TypeScript type definitions
└── constants/      # Application constants
```

## Design Patterns Implementation

### 1. Repository Pattern
**Why**: Abstracts data access logic and provides a clean interface between business logic and database.

**Location**: `src/repositories/`

**Usage**:
```typescript
// Interface defines contract
interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  // ... other methods
}

// MongoDB implementation
class UserRepository implements IUserRepository {
  constructor(private userModel: Model<UserDocument>) {}
  // Implementation details
}
```

### 2. Service Layer Pattern
**Why**: Separates business logic from API routes, making code testable and reusable.

**Location**: `src/services/`

**Usage**:
```typescript
class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}
  
  async createUser(userData: CreateUserDto): Promise<User> {
    // Business logic: validation, password hashing, etc.
    const passwordHash = await this.hashPassword(userData.password);
    return this.userRepository.create({ ...userData, passwordHash });
  }
}
```

### 3. Strategy Pattern
**Why**: Handles different expense splitting algorithms (Equal, Exact, Percentage) in an extensible way.

**Location**: `src/utils/strategies/SplitStrategy.ts`

**Usage**:
```typescript
abstract class SplitStrategy {
  abstract calculateSplits(totalAmount: number, participants: Participant[]): Participant[];
}

class EqualSplitStrategy extends SplitStrategy {
  calculateSplits(totalAmount: number, participants: Participant[]): Participant[] {
    const splitAmount = totalAmount / participants.length;
    return participants.map(p => ({ ...p, owesAmount: splitAmount }));
  }
}
```

### 4. Factory Pattern
**Why**: Creates appropriate split strategy based on split type, centralizing object creation logic.

**Location**: `src/utils/factories/SplitStrategyFactory.ts`

**Usage**:
```typescript
class SplitStrategyFactory {
  static createStrategy(splitType: SplitType): SplitStrategy {
    const strategyFactory = this.strategies.get(splitType);
    if (!strategyFactory) throw new Error(`Unsupported split type: ${splitType}`);
    return strategyFactory();
  }
}
```

### 5. Singleton Pattern
**Why**: Ensures single database connection instance, managing connection pooling for serverless environments.

**Location**: `src/config/database.ts`

**Usage**:
```typescript
class DatabaseConnection implements IDatabaseConnection {
  private static instance: DatabaseConnection;
  
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

## Data Flow Architecture

### Request Flow:
```
API Route → Controller → Service → Repository → Database
```

### Example: User Registration
1. **API Route** (`app/api/auth/register/route.ts`)
   - Receives HTTP request
   - Sets up dependency injection
   - Calls controller method

2. **Controller** (`src/controllers/UserController.ts`)
   - Validates request body
   - Calls service method
   - Handles response formatting

3. **Service** (`src/services/implementations/UserService.ts`)
   - Implements business logic
   - Hashes password
   - Calls repository

4. **Repository** (`src/repositories/implementations/UserRepository.ts`)
   - Handles database operations
   - Maps documents to entities

5. **Database** (MongoDB via Mongoose)
   - Persists data
   - Handles connection management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (paginated)
- `PUT /api/users/role` - Update user role

### Expenses (Planned)
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get expenses (with filters)
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Key Features

### 1. Type Safety
- Strong TypeScript typing throughout
- Interface-based contracts
- No `any` types used

### 2. Error Handling
- Custom error classes (`AppError`, `ValidationError`, etc.)
- Centralized error handling in controllers
- Proper HTTP status codes

### 3. Validation
- Request body validation
- Business rule validation
- Database constraint validation

### 4. Security
- Password hashing with bcrypt
- JWT authentication
- Input sanitization

### 5. Performance
- Database connection pooling
- Efficient queries with proper indexing
- Pagination support

## Environment Setup

Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/SplitEase
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Strategy

The architecture supports comprehensive testing:

1. **Unit Tests**: Test individual services and repositories
2. **Integration Tests**: Test API endpoints with test database
3. **Repository Tests**: Mock database for testing business logic
4. **Service Tests**: Mock repositories for testing business rules

## Scalability Considerations

1. **Database**: Connection pooling, indexing, sharding ready
2. **Services**: Stateless design supports horizontal scaling
3. **API**: Next.js serverless functions auto-scale
4. **Caching**: Ready for Redis integration
5. **Monitoring**: Structured logging for observability

## Future Enhancements

1. **Expense Management**: Complete expense CRUD operations
2. **Group Management**: Group creation and member management
3. **Balance Calculation**: Automatic balance updates
4. **Notifications**: Email/push notifications
5. **File Upload**: Receipt/image upload functionality
6. **Analytics**: Expense analytics and reporting
7. **Real-time**: WebSocket integration for live updates

This architecture provides a solid foundation for a production-ready SplitEase-like application with clean, maintainable, and scalable code.
