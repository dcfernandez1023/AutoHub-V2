import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import changelogRoutes from './routes/changelog';
import exportRoutes from './routes/export';
import importRoutes from './routes/import';
import repairLogRoutes from './routes/repairLog';
import scheduledLogRoutes from './routes/scheduledLog';
import scheduledServiceInstanceRoutes from './routes/scheduledServiceInstance';
import scheduledServiceTypeRoues from './routes/scheduledServiceType';
import upcomingMaintenanceRoutes from './routes/upcomingMaintenance';
import analyticsRoutes from './routes/analytics';
import vehicleRoutes from './routes/vehicle';

import getLoggerMiddleware from './middleware/logger';
import { Server } from 'http';
import { subscribers } from './eventbus/subscribers/subscribers';
import Subscriber from './eventbus/subscribers/Subscriber';
import path from 'path';

class AutoHubServer {
  private _environment: string;
  private _port: string | number;
  private _app: Express;
  private _server: Server;

  private static _instance: AutoHubServer;

  static API_ROUTE_PREFIX = '/api';

  private constructor() {
    this._environment = process.argv[2] || 'dev';
    this._port = process.env.PORT || 5000;

    if (this._environment !== 'prod') {
      dotenv.config({ path: '.env.dev' });
    }

    this._app = express();

    // Swagger
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Middleware
    if (this._environment === 'dev') {
      this._app.use(
        cors({
          origin: 'http://localhost:3000',
          credentials: true,
        })
      );
    } else {
      this._app.use(cors());
    }
    this._app.options('*', cors());
    this._app.use(express.json());
    this._app.use(cookieParser());

    // Logger middleware
    this._app.use(getLoggerMiddleware(this._environment === 'dev'));

    const apiRoutePrefix =
      this._environment === 'prod' ? `/autohub${AutoHubServer.API_ROUTE_PREFIX}` : AutoHubServer.API_ROUTE_PREFIX;

    // Routes
    this._app.use(apiRoutePrefix, authRoutes);
    this._app.use(apiRoutePrefix, userRoutes);
    this._app.use(apiRoutePrefix, changelogRoutes);
    this._app.use(apiRoutePrefix, importRoutes);
    this._app.use(apiRoutePrefix, exportRoutes);
    this._app.use(apiRoutePrefix, upcomingMaintenanceRoutes);
    this._app.use(apiRoutePrefix, scheduledServiceTypeRoues);
    this._app.use(apiRoutePrefix, scheduledLogRoutes);
    this._app.use(apiRoutePrefix, repairLogRoutes);
    this._app.use(apiRoutePrefix, scheduledServiceInstanceRoutes);
    this._app.use(apiRoutePrefix, analyticsRoutes);
    this._app.use(apiRoutePrefix, vehicleRoutes);

    if (this._environment === 'dev') {
      this._app.get('/', (req, res) => {
        res.send('Autohub');
      });
    } else {
      const client_build_dir = path.resolve(__dirname, '../../client/build');
      // Serve static files (JS/CSS/images)
      this._app.use('/autohub', express.static(client_build_dir));

      // SPA fallback for any other GET (after /api and static)
      this._app.get('/autohub/*', (req, res) => {
        res.sendFile(path.join(client_build_dir, 'index.html'));
      });
    }

    // Setup EventHub subscribers
    subscribers.forEach((subscriber: Subscriber) => {
      subscriber.subscribe();
    });

    // Start server
    this._server = this._app.listen(this._port, () => {
      console.log(`🚀 Server is running - Environment: ${this._environment}`);
    });
  }

  getEnvironment(): string {
    return this._environment;
  }

  getApp(): Express {
    return this._app;
  }

  getServer(): Server {
    return this._server;
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new AutoHubServer();
    }

    return this._instance;
  }
}

export default AutoHubServer.instance;
