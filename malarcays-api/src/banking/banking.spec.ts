import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { BankingModule } from './banking.module';
import { INestApplication } from '@nestjs/common';

describe('Search', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [BankingModule]
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it(`GET /balance`, async () => {
		const res = await request(app.getHttpServer()).get('/balance').query({ "account": 1 });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	});

	it(`GET /balance with invalid account`, async () => {
		const res = await request(app.getHttpServer()).get('/balance').query({ "account": -1 });
		if (res.statusCode != 400) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(400);
	});

	it(`GET /transaction-events`, async () => {
		const res = await request(app.getHttpServer()).get('/transaction-events').query({ "account": 1 });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	})

	afterAll(async () => {
		await app.close();
	});
});