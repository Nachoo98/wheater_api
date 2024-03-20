import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const allowedCors = (process.env.ALLOWED_CORS as string).split(',');
export const setupSecurity = (app: INestApplication): void => {
  // Set security-related HTTP headers
  app.use(helmet());

  // Enable Cross-origin resource sharing for a list of domains
  app.enableCors({
    origin: allowedCors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Limit repeated requests for brute-force attacks
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1m
      max: Number(process.env.REQUEST_LIMIT), // limit each IP to 1000 requests per windowMs
      message:
        'Too many requests created from this IP, please try again after 1 minute',
    }),
  );
};
