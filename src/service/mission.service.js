const db = require('../middleware/db.pool');
const dbApp = db.appPool();
const missionQuery = require('../query/mission.query');
const memberQuery = require('../query/member.query');
const fs = require('fs');
const request = require('request');;
const AWS = require('aws-sdk');
const awsModule = require('../module/Aws.module');
const moment = require("moment");
const utilCreateId = require('../middleware/createId');


selectMission = async (missionId,memberId,myMission) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [mission] = []
        let [member] = []
        let failReason = ''
        sqlQuery = missionQuery.selectMission(false,missionId,memberId,myMission,"","","","","",0,1);
        [mission] = await connection.query(sqlQuery);


        await connection.commit();
        connection.release();
        if(mission.length == 1){
            return mission[0]
        }else{
            return false
        }


    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}
selectMissionParticipationMemberCount = async (missionId, memberId, onlyActiveItemYn) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [mission] = []

        sqlQuery = missionQuery.selectMissionParticipationMemberCount(missionId, memberId, onlyActiveItemYn);
        [mission] = await connection.query(sqlQuery);

        let joinCount = mission[0].totalCount

        await connection.commit();
        connection.release();

        return joinCount


    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}
selectMissionRetrievalCount = async (missionId, memberId) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [mission] = []
        let totalCount = 0
        sqlQuery = missionQuery.selectMissionRetrievalCount(missionId, memberId);
        [mission] = await connection.query(sqlQuery);

        totalCount = mission[0].totalCount

        await connection.commit();
        connection.release();

        return totalCount


    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}
module.exports = {
    selectMission ,
    selectMissionParticipationMemberCount ,
    selectMissionRetrievalCount ,


}