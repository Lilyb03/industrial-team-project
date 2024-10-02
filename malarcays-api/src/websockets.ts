import { ApiGatewayManagementApi, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { sqlParams, WSConnection, Transaction } from './utils/db';
import postgres = require('postgres');
import { Post } from '@nestjs/common';

const apig = new ApiGatewayManagementApi({
	endpoint: process.env.APIG_ENDPOINT
	// endpoint: "http://localhost:3001"
});

exports.sockHandler = async function (event, context, callback) {
	const { body, requestContext: { connectionId, routeKey }, queryStringParameters } = event;
	const sql = postgres(sqlParams);

	let code = 200;

	switch (routeKey) {
		case '$connect':
			code = await registerWsConnection(sql, connectionId, queryStringParameters);
			break;

		case '$disconnect':
			code = await unregisterWsConnection(sql, connectionId);
			break;

		case '$default':
		default:
			code = await onWsMessage(sql, connectionId, body);
			break;
	}

	await sql.end();
	let res = {
		"isBase64Encoded": false,
		"headers": {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true
		},
		"statusCode": code,
		"body": "Connected!"
	};
	return res;
}

async function registerWsConnection(sql, connectionId, query): Promise<number> {
	try {
		let account = parseInt(query.account.toString());
		await sql`INSERT INTO wsconnections (connection_id, account) VALUES (${connectionId}, ${account});`;
		console.log("succeeded");
		return 200;
	} catch (err) {
		console.error(err, err.stack);
		return 500;
	}
}

async function unregisterWsConnection(sql, connectionId): Promise<number> {
	try {
		await sql`DELETE FROM wsconnections WHERE connection_id=${connectionId};`;
		return 200;
	} catch (err) {
		console.error(err, err.stack);
		return 500;
	}
}

async function onWsMessage(sql, connectionId, body): Promise<number> {
	apig.postToConnection({
		ConnectionId: connectionId,
		Data: body
	});
	return 200;
}

exports.snsHandler = async function (event, context) {
	const sql = postgres(sqlParams);
	for (const record of event.Records) {
		await processSNSEvent(sql, record);
	}
	sql.end()

	return { statusCode: 200 };
}

async function processSNSEvent(sql, record) {
	try {
		const msg: Transaction = JSON.parse(record.Sns.Message) as Transaction;

		const conns: WSConnection[] = await sql<WSConnection[]>`SELECT * from WSConnections WHERE account=${msg.receiver_account}`;

		for (const conn of conns) {
			try {
				const cmd = new PostToConnectionCommand({
					Data: JSON.stringify(msg),
					ConnectionId: conn.connection_id
				});

				await apig.send(cmd);
			} catch {
				continue;
			}
		}

	} catch (err) {
		throw err;
	}
}