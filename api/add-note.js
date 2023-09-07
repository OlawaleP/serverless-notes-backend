const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const util = require('./utils');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.note_id = item.user_id + ':' + uuidv4()
        item.timestamp = moment().unix();
        item.expires = moment().add(90, 'days').unix();

        let data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        }
    } catch (error) {
        console.log("Error", error);
        return {
            statusCode: error.statusCode ? error.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: error.name ? error.name : "Expectation",
                message: error.message ? error.message : "Unknown error"
            })
        };
    }
}