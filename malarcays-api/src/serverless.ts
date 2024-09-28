import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Request } from 'express';
import { Callback, Context, Handler } from 'aws-lambda';
import { join } from 'path';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
	await app.init();
	app.enableCors();

	const expressApp = app.getHttpAdapter().getInstance();
	return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
	event: any,
	context: Context,
	callback: Callback,
) => {
	event.path = event.path === '' ? '/' : event.path;
	server = server ?? (await bootstrap());
	return server(event, context, callback);
};