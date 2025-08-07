import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import auth from './auth';
import eventsRouter from './events';
import submissionRouter from './submission';

const routes = (app: Application) => {
  app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use('/api/events', auth, eventsRouter);
  app.use('/api/submission', auth, submissionRouter);

  // Static hosting of built React files
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('/api/uploads/event_template.csv', auth, (_req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../uploads/event_template.csv');
    res.download(filePath);
  });

  // Catch-all route for serving the React app
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  // Error handling for all above routes
  app.use((e: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(e);
    res
      .status(e.status || 500)
      .json({ error: { message: e.message, stack: e.stack } });
  });
};

export default routes;

