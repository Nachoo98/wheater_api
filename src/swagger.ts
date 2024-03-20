import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

const swaggerEnvs = process.env.SWAGGER_ENVS.split(',');

interface IOperations {
  _root: {
    entries: [string, string];
  };
}

function operationsSorter(a: IOperations, b: IOperations) {
  const httpMethodOrder = {
    get: 1,
    post: 2,
    patch: 3,
    put: 4,
    delete: 5,
  };
  const methodA = a._root.entries
    .find((entry) => entry[0] === 'method')[1]
    .toLowerCase();
  const pathA = a._root.entries.find((entry) => entry[0] === 'path')[1];
  const methodB = b._root.entries
    .find((entry) => entry[0] === 'method')[1]
    .toLowerCase();
  const pathB = b._root.entries.find((entry) => entry[0] === 'path')[1];

  const orderA = httpMethodOrder[methodA];
  const orderB = httpMethodOrder[methodB];

  if (orderA < orderB) {
    return -1;
  } else if (orderA > orderB) {
    return 1;
  } else {
    return pathA.localeCompare(pathB);
  }
}

export const setupSwagger = (app: INestApplication): void => {
  if (swaggerEnvs.includes(process.env.NODE_ENV)) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  const options = new DocumentBuilder()
    .setTitle('Utils API')
    .setDescription('Api created by Ignacio Gonzalez')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      operationsSorter,
    },
  });
};
