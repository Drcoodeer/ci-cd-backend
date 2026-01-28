import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Express Server';
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        appName: APP_NAME,
        apiVersion: API_VERSION,
        uptime: process.uptime(),
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Welcome to ${APP_NAME}`,
        version: API_VERSION,
        endpoints: {
            health: '/health',
            version: '/version',
            api: `/${API_VERSION}`,
        },
    });
});

// API version endpoint
app.get(`/${API_VERSION}`, (req: Request, res: Response) => {
    res.status(200).json({
        message: `${APP_NAME} API ${API_VERSION}`,
        status: 'active',
    });
});

// Version endpoint - reads from version.txt
app.get('/version', (req: Request, res: Response) => {
    try {
        const versionFilePath = path.join(__dirname, '../version.txt');
        const version = fs.readFileSync(versionFilePath, 'utf-8').trim();

        res.status(200).json({
            version: version,
            appName: APP_NAME,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            error: 'Unable to read version file',
            message: 'version.txt not found or unreadable',
        });
    }
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist',
        path: req.path,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ${APP_NAME} is running on port ${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 API Version: ${API_VERSION}`);
});

export default app;
