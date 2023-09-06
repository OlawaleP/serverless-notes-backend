const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./utils');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        let timestamp = parseInt(event.pathParameters.timestamp);
        let params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(event.headers),
                timestamp: timestamp
            }
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
        }
    } catch (error) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Expectation",
                message: err.message ? err.message : "Unknown error"
            })
        };
    }
}