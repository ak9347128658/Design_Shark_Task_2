@echo off
echo Starting deployment script...

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Build the project
echo Building project...
call npm run build

REM Seed the database with admin user
echo Seeding database...
call npm run seed

REM Start the server
echo Starting server...
call npm start

echo Deployment completed successfully!
