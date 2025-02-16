import express from 'express';
import axios from 'axios';
import handleError from '../handleError.js';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';


const metricRouter = express.Router();


// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: 'eu-north-1' });

const docClient = DynamoDBDocumentClient.from(client);

//log user entry to db
metricRouter.post("/log/activeUser", async(req, res) => {
    const currentDate = new Date();
    const datePart = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const hourPart = String(currentDate.getUTCHours()).padStart(2, '0'); // HH in UTC
    const formattedDateTime = `${datePart}-${hourPart}`; // Combine date and hour

    if (!req.body.uid) {
        return res.status(400).json({ error: 'Token is required' });
    }

    if (!req.body.exp) {
        return res.status(400).json({ error: 'exp is required' });
    }

    if (!req.body.algo) {
        return res.status(400).json({ error: 'algo is required' });
    }

    const params = {
        TableName: 'vikalp_user_login',
        Item: {
            datetime : formattedDateTime,
            uid : req.body.uid,
            exp: req.body.exp,
            algo: req.body.algo
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