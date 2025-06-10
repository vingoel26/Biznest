# BizNest Backend

This is the Spring Boot backend for the BizNest application.

## Prerequisites

- Java 17 or higher
- Maven (included via Maven Wrapper)

## Running on Windows

### Option 1: Using the Batch Script (Recommended)
1. Open Command Prompt or PowerShell
2. Navigate to the backend directory
3. Run the batch script:
   ```cmd
   run-backend.bat
   ```

### Option 2: Using Maven Wrapper Commands
1. Open Command Prompt or PowerShell
2. Navigate to the backend directory
3. Clean and compile:
   ```cmd
   mvnw.cmd clean compile
   ```
4. Run the application:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

### Option 3: Using PowerShell
1. Open PowerShell as Administrator
2. Navigate to the backend directory
3. Set execution policy (if needed):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Run the application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

## API Endpoints

Once the server is running, it will be available at `http://localhost:8080`

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Protected Endpoints
- `GET /api/hello` - Test endpoint
- `GET /api/user/me` - Get current user info

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Access protected endpoint:
```bash
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Troubleshooting

### Common Issues on Windows:

1. **Java not found**: Make sure Java 17+ is installed and added to your PATH
2. **Permission denied**: Run Command Prompt or PowerShell as Administrator
3. **Port already in use**: Make sure port 8080 is not being used by another application
4. **Maven wrapper issues**: Try running `mvnw.cmd clean` first

### Checking Java Installation:
```cmd
java -version
javac -version
```

### Checking if port 8080 is in use:
```cmd
netstat -ano | findstr :8080
```

## Configuration

The application configuration is in `src/main/resources/application.properties`:
- Server port: 8080
- JWT secret and expiration
- CORS settings for frontend integration
- Logging levels

## Default Test User

The application comes with a pre-configured test user:
- Username: `testuser`
- Password: `password123`

## Admin User

To access admin features, use:
- Username: `admin`
- Password: `adminpassword`