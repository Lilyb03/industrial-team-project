import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AccountsModule } from './accounts.module';
import { INestApplication } from '@nestjs/common';

describe('Search', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AccountsModule]
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it(`POST /login`, async () => {
		const res = await request(app.getHttpServer()).post('/login').send({ "account": 1, "name": "test", "password": "test" });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	});

	it(`POST /login`, async () => {
		const res = await request(app.getHttpServer()).post('/login').send({ "account": -1, "name": "test", "password": "test" });
		if (res.statusCode != 404) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(404);
	});

	afterAll(async () => {
		await app.close();
	});
});