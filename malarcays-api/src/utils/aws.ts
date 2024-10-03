import * as AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-1" });

export const topicARN = "arn:aws:sns:eu-west-1:282315343020:transactions";

export const SNS = new AWS.SNS({ apiVersion: "2010-03-31" });

export interface WSConnection {
	connectionId: string,
	account: number
}