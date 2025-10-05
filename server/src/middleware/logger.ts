import { Request, Response, NextFunction } from 'express';
import onFinished from 'on-finished';
import AppLogPublisher from '../eventbus/publishers/AppLogPublisher';
import { AppLogRequest } from '../types/changelog';

const getLoggerMiddleware = (logtoConsole: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startHrTime = process.hrtime();
    onFinished(res, (error: Error | null, res: Response) => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

      const statusCode = res.statusCode;
      const userId = req.user?.userId;
      const routePath = req.route?.path;
      const method = req.method;
      const level = (statusCode === 304 || (statusCode >= 200 && statusCode <= 299)) && !error ? 'INFO' : 'ERROR';
      const data = {
        method,
        uri: req.url,
        route: routePath,
        statusCode,
        error: error?.message,
      };

      const logPayload: AppLogRequest = {
        userId: userId ?? '',
        event: `${method} ${routePath}`,
        duration: elapsedTimeInMs,
        level,
        data,
      };

      if (logtoConsole) {
        console.log(JSON.stringify(logPayload));
      }

      AppLogPublisher.logEvent(logPayload);
    });

    next();
  };
};

export default getLoggerMiddleware;
