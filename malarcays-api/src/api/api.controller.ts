import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiService } from './api.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';


interface SignUpDto {
	username: string;
	lastName: string;
	password: string;
	initialBalance?: number;
}

@Controller('api')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Post('signup')
	async signUp(@Body() body: SignUpDto, @Res() res: Response): Promise<any> {
		const { username, lastName, password, initialBalance = 0 } = body;


		if (!username || !lastName || !password) {
			return res.status(400).json({
				type: 1,
				message: "All fields are required: username, lastName, password",
				account_data: null
			});
		}

		try {

			const hashedPassword = await bcrypt.hash(password, 10);

			const accountData = await this.apiService.createUser(username, lastName, hashedPassword, initialBalance);

			return res.status(201).json({
				type: 0,
				message: "Account created successfully",
				account_number: accountData.account_number,
				account_data: accountData
			});
		} catch (error) {
			return res.status(400).json({
				type: 1,
				message: "Sign-up failed: " + error.message,
				account_data: null
			});
		}
	}

	@Post('login')
	async login(@Body() body: { username: string; password: string }, @Res() res: Response): Promise<any> {
		const { username, password } = body;


		if (!username || !password) {
			return res.status(400).json({
				type: 1, // failure
				message: "Both username and password are required",
				account_data: null
			});
		}

		try {
			const accountData = await this.apiService.getUserByUsername(username);


			const isMatch = await bcrypt.compare(password, accountData.password);
			if (!isMatch) {
				throw new Error("Invalid password");
			}

			return res.status(200).json({
				type: 0,
				message: "Login successful",
				account_data: accountData
			});
		} catch (error) {
			return res.status(400).json({
				type: 1,
				message: "Login failed: " + error.message,
				account_data: null
			});
		}
	}
}
