 const connection = require('../database/connection');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

exports.indexPhone = async (req, res) => {

    try {

        const filePath = path.join(__dirname, '../utils/phoneCodes.json');
        const rows = fs.readFileSync(filePath, 'utf8');
     
      //  const [rows, fields] = await connection.execute('SELECT * FROM phone_codes');
      
        res.status(200).json(JSON.parse(rows));
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.indexSub = async (req, res) => {
    const url = 'https://api.mercadopago.com/preapproval/search';
  
   const token = process.env.MP_TOKEN;
    const email = 'luiscore_27@hotmail.com';
    const queryString = email ? `?payer_email=${encodeURIComponent(email)}` : '';

    try {
        const response = await fetch(`${url}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return res.status(200).json(data.results[0]);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


