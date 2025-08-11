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
import vehicleRoutes from './routes/vehicle';

import logger from './middleware/logger';
import { Server } from 'http';
import { subscribers } from './eventbus/subscribers/subscribers';
import Subscriber from './eventbus/subscribers/Subscriber';

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

    const envFile = this._environment === 'prod' ? '.env.prod' : '.env.dev';
    dotenv.config({ path: envFile });

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
    this._app.use(logger);

    // Routes
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, authRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, userRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, changelogRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, importRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, exportRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, upcomingMaintenanceRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, scheduledServiceTypeRoues);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, scheduledLogRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, repairLogRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, scheduledServiceInstanceRoutes);
    this._app.use(AutoHubServer.API_ROUTE_PREFIX, vehicleRoutes);

    this._app.get('/', (req, res) => {
      res.send('Autohub');
    });

    // Setup EventHub subscribers
    subscribers.forEach((subscriber: Subscriber) => {
      subscriber.subscribe();
    });

    // Start server
    this._server = this._app.listen(this._port, () => {
      console.log(`🚀 Server is running on http://localhost:${this._port}`);
    });
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
