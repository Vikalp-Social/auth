import express from 'express';
import axios from 'axios';
import handleError from '../handleError.js';
import {domain} from '../index.js';

import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto'; // Native module, works with `import`


const metricRouter = express.Router();


// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: 'eu-north-1' });

const docClient = DynamoDBDocumentClient.from(client);


// Function to generate SHA-256 hash
const generateSHA256Hash = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};


//log user entry to db
metricRouter.post("/log/activeUser", async(req, res) => {
    const currentDate = new Date();
    const datePart = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const hourPart = String(currentDate.getUTCHours()).padStart(2, '0'); // HH in UTC
    const formattedDateTime = `${datePart}-${hourPart}`; // Combine date and hour

    if (!req.body.token) {
        return res.status(400).json({ error: 'Token is required' });
        }

    const userHash = generateSHA256Hash(req.body.token);

    const params = {
        TableName: 'vikalp_user_login',
        Item: {
            datetime : formattedDateTime,
            user_token_sha256 : userHash
         },
      };
    
    try {
        const result = await docClient.send(new PutCommand(params));

        res.status(200).json({
            resultMetadata: result.$metadata  // Return the result metadata for debugging
        });

        console.log(result)

    } catch (error) {
        console.log(error)
        handleError(res, error)
    }
})

export default metricRouter;