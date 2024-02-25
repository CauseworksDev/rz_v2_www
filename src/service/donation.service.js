const db = require('../middleware/db.pool');
const dbApp = db.appPool();
const donationQuery = require('../query/donation.query');
const memberQuery = require('../query/member.query');
const messageQuery = require('../query/message.query');
const missionService = require('../service/mission.service');
const fs = require('fs');
const request = require('request');;
const AWS = require('aws-sdk');
const awsModule = require('../module/Aws.module');
const moment = require("moment");
const utilCreateId = require('../middleware/createId');
const missionQuery = require("../query/mission.query");

missionDonation = async (campaignId,memberId,missionId,rzPoint) => {

    let connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [campaign] = []
        let [mission] = []
        sqlQuery = missionQuery.selectMission(false,missionId,memberId,"","","","","","",0,1);
        [mission] = await connection.query(sqlQuery);

        sqlQuery = donationQuery.selectDonationCampaign(campaignId);
        [campaign] = await connection.query(sqlQuery);
        let apiStatus = false;
        let failReason = ''
        let remainRzPoint = 0
        if(campaign.length == 1){
            let targetAmount = campaign[0].maxTargetAmount;
            let totalAmount = await setTotalAmount(campaign[0])
            let nowRzPoint = rzPoint

            if(targetAmount*1 < totalAmount + (2 * nowRzPoint)) {
                remainRzPoint = (targetAmount*1 - totalAmount*1);
                if(remainRzPoint <= 0) {
                    failReason = "There are no donation spaces left for the campaign."
                }else{
                    apiStatus = true;
                    // 잔액만큼만 기부
                    remainRzPoint = remainRzPoint / 2;
                    nowRzPoint =remainRzPoint
                }
            }else{
                apiStatus = true;
            }

            if(apiStatus){
                sqlQuery = memberQuery.selectMember(memberId);
                [member] = await connection.query(sqlQuery);
                if(member.length == 1) {
                    let donorName = "";
                    let donorEmail = "";
                    donorName = member[0].nickName;
                    if(member[0].joinChannel == 1) {
                        donorEmail = member[0].accountName;
                    } else {
                        donorEmail = member[0].snsEmailAddress;
                    }


                    let reason = mission[0].title+' 미션 참여로 ' + nowRzPoint + "원이 기부되었습니다!";
                    if(reason.length > 300) {
                        reason = reason.substring(0, 300);
                    }

                    let donated = {
                        campaignId : campaignId,
                        memberId : memberId,
                        donationType : 1,
                        donationReason : reason,
                        articleType : 2,
                        articleId : missionId,
                        donorName : donorName,
                        donorEmail : donorEmail,
                        rzPoint : nowRzPoint,
                    }
                    sqlQuery = donationQuery.insertDonatedPoint(donated);
                    [rows] = await connection.query(sqlQuery);
                    //엘지기부포인트증가부분은 스케쥴러 처리로 변경함으로써 진행안해도됨
                    // if(campaign[0].lgChemDonationYN == 0){
                    //     sqlQuery = donationQuery.addLgChemDonation(campaignId,nowRzPoint);
                    //     console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
                    //     [rows] = await connection.query(sqlQuery);
                    // }

                }else{
                    apiStatus = false;
                }

            }
        }

        await connection.commit();
        await connection.release();


        let returnDetail = {
            result : 'success',
            failReason : failReason
        }
        if(apiStatus){
            return returnDetail;
        }else{
            returnDetail.result = 'false'
            return returnDetail;
        }

    } catch (err) {
        await connection.rollback();
        await connection.release();
        throw err
    }
}
messageDonation = async (campaignId,memberId,messageId,rzPoint) => {

    let connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [campaign] = []
        let [message] = []
        sqlQuery = messageQuery.selectMessage(false,messageId,memberId,"","","","","",0,1);
        [message] = await connection.query(sqlQuery);
        console.log(sqlQuery);
        console.log(message);
        sqlQuery = donationQuery.selectDonationCampaign(campaignId);
        [campaign] = await connection.query(sqlQuery);
        let apiStatus = false;
        let failReason = ''
        let remainRzPoint = 0
        if(campaign.length == 1){
            let targetAmount = campaign[0].maxTargetAmount;
            let totalAmount = await setTotalAmount(campaign[0])
            let nowRzPoint = rzPoint

            if(targetAmount*1 < totalAmount + (2 * nowRzPoint)) {
                remainRzPoint = (targetAmount*1 - totalAmount*1);
                if(remainRzPoint <= 0) {
                    failReason = "There are no donation spaces left for the campaign."
                }else{
                    apiStatus = true;
                    // 잔액만큼만 기부
                    remainRzPoint = remainRzPoint / 2;
                    nowRzPoint =remainRzPoint
                }
            }else{
                apiStatus = true;
            }

            if(apiStatus){
                sqlQuery = memberQuery.selectMember(memberId);
                [member] = await connection.query(sqlQuery);
                if(member.length == 1) {
                    let donorName = "";
                    let donorEmail = "";
                    donorName = member[0].nickName;
                    if(member[0].joinChannel == 1) {
                        donorEmail = member[0].accountName;
                    } else {
                        donorEmail = member[0].snsEmailAddress;
                    }


                    let reason = message[0].title+' 메시지 확인으로 ' + nowRzPoint + "원이 기부되었습니다!";
                    if(reason.length > 300) {
                        reason = reason.substring(0, 300);
                    }

                    let donated = {
                        campaignId : campaignId,
                        memberId : memberId,
                        donationType : 1,
                        donationReason : reason,
                        articleType : 1,
                        articleId : messageId,
                        donorName : donorName,
                        donorEmail : donorEmail,
                        rzPoint : nowRzPoint,
                    }
                    sqlQuery = donationQuery.insertDonatedPoint(donated);
                    [rows] = await connection.query(sqlQuery);
                    //     엘지기부포인트증가부분은 스케쥴러 처리로 변경함으로써 진행안해도됨
                    // if(campaign[0].lgChemDonationYN == 0){
                    //     sqlQuery = donationQuery.addLgChemDonation(campaignId,nowRzPoint);
                    //     console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
                    //     [rows] = await connection.query(sqlQuery);
                    // }

                }else{
                    apiStatus = false;
                }

            }
        }

        await connection.commit();
        connection.release();

        let returnDetail = {
            result : 'success',
            failReason : failReason
        }
        if(apiStatus){
            return returnDetail;
        }else{
            returnDetail.result = 'false'
            return returnDetail;
        }

    } catch (err) {
        await connection.rollback();
        await connection.release();
        throw err
    }
}
setTotalAmount = function (campaign) {
    let lgChemDonation = campaign.lgChemDonationAmount;						// LG 기부(관리자가 입력함)
    let lgChemDonationAddition = campaign.lgChemDonationAddition;
    let totalDonatedByCompany = parseInt(campaign.totalDonatedAmountBycompany);		// 기업 기부
    let totalDonatedByMember1 = parseInt(campaign.totalDonatedAmountBymember1);		// 개인 기부(활동 기부)
    let totalDonatedByMember3 = parseInt(campaign.totalDonatedAmountBymember3);		// 개인 기부(포인트 기부)

    let totalAmount = lgChemDonation+lgChemDonationAddition+totalDonatedByCompany+totalDonatedByMember1+totalDonatedByMember3

    return totalAmount
}

donation = async (campaignId,memberId,rzPoint) => {

    let connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [campaign] = []
        let [subCampaign] = []
        let [member] = []
        let failReason = ''
        sqlQuery = donationQuery.selectDonationCampaign(campaignId);
        [campaign] = await connection.query(sqlQuery);
        let apiStatus = false;
        if(campaign.length == 1){
            let nowDate = moment().unix()
            let startDate = campaign[0].startDateValue
            let endDate = campaign[0].endDateValue

            console.log(nowDate , startDate , endDate)
            if(startDate <= nowDate && nowDate < endDate){
                let targetAmount = campaign[0].maxTargetAmount;
                let totalAmount = await setTotalAmount(campaign[0])
                let nowRzPoint = rzPoint
                let remainRzPoint = 0
                console.log(totalAmount)
                if(targetAmount*1 < totalAmount + (2 * rzPoint/*사용자 기부 + LG 기부*/) || targetAmount < totalAmount) {
                    /**
                     * 현재 포인트 기부는 목표 액수를 넘겨서 기부할 수 없음
                     * 변경 짤라서 남은 금액 채워두고 다음 캠패인에 남은 금액 채우는 형식으로 변경
                     * v2 에서는 else 안에 있는 내용 밖으로 빼고 공통으로 남김
                     * failReason 제거
                     */

                    remainRzPoint = (totalAmount + (2 * rzPoint/*사용자 기부 + LG 기부*/))-(targetAmount*1);
                    nowRzPoint -= remainRzPoint


                    failReason = "기부 캠페인 목표금액 도달"
                }else {

                    sqlQuery = memberQuery.selectMember(memberId);
                    [member] = await connection.query(sqlQuery);

                    let donorName = "";
                    let donorEmail = "";
                    if(member.length == 1) {
                        apiStatus =true;
                        donorName = member[0].nickName;
                        if(member[0].joinChannel == 1) {
                            donorEmail = member[0].accountName;
                        } else {
                            donorEmail = member[0].snsEmailAddress;
                        }
                        let reason = "보유 rz로 " + rzPoint + "원이 기부되었습니다.";
                        if(reason.length > 300) {
                            reason = reason.substring(0, 300);
                        }

                        let donated = {
                            campaignId : campaignId,
                            memberId : memberId,
                            donationType : 3,
                            donationReason : reason,
                            articleType : 3,
                            articleId : campaignId,
                            donorName : donorName,
                            donorEmail : donorEmail,
                            rzPoint : rzPoint,
                        }
                        sqlQuery = donationQuery.insertDonatedPoint(donated);
                        [rows] = await connection.query(sqlQuery);
                        // if(remainRzPoint>0){
                        //     //남은 금액이 있을경우 다음 기부 캠페인에 저장
                        //     sqlQuery = donationQuery.selectDonationSubCampaign(campaignId);
                        //     [subCampaign] = await connection.query(sqlQuery);
                        //     let reason2 = "보유 rz로 " + rzPoint + "원이 기부되었습니다.";
                        //     if(reason2.length > 300) {
                        //         reason2 = reason2.substring(0, 300);
                        //     }
                        //
                        //     let donated = {
                        //         campaignId : subCampaign[0].campaignId,
                        //         memberId : memberId,
                        //         donationType : 3,
                        //         donationReason : reason2,
                        //         articleType : 3,
                        //         articleId : subCampaign[0].campaignId,
                        //         donorName : donorName,
                        //         donorEmail : donorEmail,
                        //         rzPoint : remainRzPoint,
                        //     }
                        //     sqlQuery = donationQuery.insertDonatedPoint(donated);
                        //     [rows] = await connection.query(sqlQuery);
                        //
                        //     엘지기부포인트증가부분은 스케쥴러 처리로 변경함으로써 진행안해도됨
                        //     sqlQuery = donationQuery.addLgChemDonation(subCampaign[0].campaignId,nowRzPoint);
                        //     console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
                        //     [rows] = await connection.query(sqlQuery);
                        //     sqlQuery = donationQuery.addLgChemDonation(campaignId,nowRzPoint);
                        //     console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
                        //     [rows] = await connection.query(sqlQuery);
                        // }

                    }else{
                        failReason = 'not found member'
                    }

                }

            }else{
                failReason = "Doesn't fit within campaign period"
            }


        }else{
            failReason = 'not Found campaign'
        }

        await connection.commit();
        connection.release();
        let returnDetail = {
            result : 'success',
            failReason : failReason
        }
        if(apiStatus){
            return returnDetail;
        }else{
            returnDetail.result = 'false'
            return returnDetail;
        }


    } catch (err) {

        await connection.rollback();
        await connection.release();
        throw err
    }
}
checkAdditionalPoints = async (campaignId,memberId,missionId,rzPoint) => {

    let connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [campaign] = []
        let [mission] = []
        let [member] = []
        let joinCount = 0
        let failReason = ''
        sqlQuery = missionService.selectMission(campaignId);
        [mission] = await connection.query(sqlQuery);

        joinCount = await missionService.selectMissionParticipationMemberCount(missionId, memberId, 0)
        let rzPoint = mission[0].rzPointPer
        let donationPer = mission[0].donationPointPer
        let extraRzPeriod = mission[0].extraRzPeriod;
        let extraRzPoint = mission[0].extraRzPoint;
        let maxParticipationNum = mission[0].maxParticipationNum;
        if(joinCount > 0 && extraRzPeriod > 0 && extraRzPoint > 0 && joinCount % extraRzPeriod == 0) {
            // 추가 지급 시기
            rzPoint += extraRzPoint;
        }
        if (maxParticipationNum == joinCount){
            // 맥스 참여 카운트와 유저 참여 카운트가 같을때 완료 포인트 지급 할게 있으면 추가
            let retrievalCount = await missionService.selectMissionRetrievalCount(missionId, memberId);
            if(retrievalCount == 0){
                rzPoint += mission[0].totalRzPoint;
            }

        }
        await connection.commit();
        connection.release();

        return rzPoint

    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}


donationTest = async (campaignId,memberId,rzPoint) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [campaign] = []
        let [subCampaign] = []
        let [member] = []
        let failReason = ''
        sqlQuery = donationQuery.selectDonationCampaign(campaignId);
        [campaign] = await connection.query(sqlQuery);
        let apiStatus = false;


        await connection.commit();
        connection.release();
        let returnDetail = {
            result : 'success',
            failReason : campaign
        }
        if(apiStatus){
            return returnDetail;
        }else{
            returnDetail.result = 'false'
            return returnDetail;
        }


    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}

updateLgPoint = async (dateFrom,dateTo) => {

    const connection = await dbApp.getConnection(async conn => conn);
    try {
        await connection.beginTransaction();
        let sqlQuery = ``;
        let [rows] = []
        let [donateInfo] = []
        let [member] = []
        let failReason = ''
        //현재 시간으로 부터 1분전에 도네이션 된 값들의 합
        sqlQuery = donationQuery.selectDonatedPoint1min(dateFrom,dateTo);
        [donateInfo] = await connection.query(sqlQuery);
        console.log("기부정보", donateInfo);
        if (donateInfo.length !== 0){
            for (let i = 0; i < donateInfo.length ; i++) {

                if (donateInfo[i].rzPoint){
                    sqlQuery = donationQuery.addLgChemDonation(donateInfo[i].campaignId,donateInfo[i].rzPoint);
                    console.log("엘지기부포인트증가");
                    [rows] = await connection.query(sqlQuery);
                }
            }
        }


        await connection.commit();
        connection.release();


    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err
    }
}
module.exports = {
    missionDonation ,
    messageDonation ,
    donation ,

    setTotalAmount,
    checkAdditionalPoints,

    updateLgPoint,
    donationTest ,

}