const db = require('../middleware/db.pool');
const dbApp = db.appPool();
const queryService = require('../query/donation.query');
const fs = require('fs');
const request = require('request');;
const AWS = require('aws-sdk');
const awsModule = require('../module/Aws.module');
const moment = require("moment");
const utilCreateId = require('../middleware/createId');


addLgChemDonation = async (campaignId,rzPoint) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []

        sqlQuery = queryService.addLgChemDonation(campaignId,rzPoint);
        console.log(moment('YYYY-MM-DD HH:mm:ss'));
        [rows] = await connection.query(sqlQuery);
        console.log(sqlQuery)
        await connection.commit();
        connection.release();

        return true;

    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}

module.exports = {
    addLgChemDonation ,

}