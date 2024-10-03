import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { SearchModule } from './search.module';
import { SearchService } from './search.service';
import { INestApplication } from '@nestjs/common';

describe('Search', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [SearchModule]
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it(`GET /search/account with account`, async () => {
		const res = await request(app.getHttpServer()).get('/search/account').query({ "account": 1 });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	});

	it(`GET /search/account with invalid account`, async () => {
		const res = await request(app.getHttpServer()).get('/search/account').query({ "account": -1 });
		if (res.statusCode != 400) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(400);
	});

	it(`GET /search/account with name`, async () => {
		const res = await request(app.getHttpServer()).get('/search/account').query({ "name": "LowImpact Groceries" });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	});

	it(`GET /search/account no params`, async () => {
		const res = await request(app.getHttpServer()).get('/search/account');
		if (res.statusCode != 500) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(500);
	});

	it(`GET /search/account with invalid name`, async () => {
		const res = await request(app.getHttpServer()).get('/search/account').query({ "name": "" });
		if (res.statusCode != 500) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(500);
	});

	it(`GET /search/company`, async () => {
		const res = await request(app.getHttpServer()).get('/search/company').query({ "name": "LowImpact Groceries" });
		if (res.statusCode != 200) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(200);
	});

	it(`GET /search/company with invalid name`, async () => {
		const res = await request(app.getHttpServer()).get('/search/company').query({ "name": "" });
		if (res.statusCode != 500) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(500);
	});

	it(`GET /search/company with no params`, async () => {
		const res = await request(app.getHttpServer()).get('/search/company');
		if (res.statusCode != 500) {
			console.log(res.body);
		}
		return expect(res.statusCode).toBe(500);
	});

	afterAll(async () => {
		await app.close();
	});
});