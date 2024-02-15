const db = require('../middleware/db.pool');
const dbApp = db.appPool();
const donationQuery = require('../query/donation.query');
const memberQuery = require('../query/member.query');
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

        sqlQuery = donationQuery.addLgChemDonation(campaignId,rzPoint);
        console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
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
setTotalAmount = function (campaign) {
    let lgChemDonation = campaign.lgChemDonationAmount;						// LG 기부(관리자가 입력함)
    let lgChemDonationAddition = campaign.lgChemDonationAddition;
    let totalDonatedByCompany = parseInt(campaign.totalDonatedAmountBycompany);		// 기업 기부
    let totalDonatedByMember1 = parseInt(campaign.totalDonatedAmountBymember1);		// 개인 기부(활동 기부)
    let totalDonatedByMember3 = parseInt(campaign.totalDonatedAmountBymember3);		// 개인 기부(포인트 기부)

    let totalAmount = 0

    return totalAmount = lgChemDonation+lgChemDonationAddition+totalDonatedByCompany+totalDonatedByMember1+totalDonatedByMember3
}

donation = async (campaignId,memberId,rzPoint) => {

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
        console.log(campaign)
        let apiStatus = false;
        if(campaign.length == 1){
            let nowDate = moment().unix()
            let startDate = campaign[0].startDateValue
            let endDate = campaign[0].endDateValue

            console.log(nowDate , startDate , endDate)
            if(startDate <= nowDate && nowDate < endDate){
                let targetAmount = campaign.maxTargetAmount;
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


                    failReason = "Doesn't fit within campaign period"
                }else {

                    sqlQuery = memberQuery.selectMember(memberId);
                    [member] = await connection.query(sqlQuery);
                    console.log(member)
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
                        //     sqlQuery = donationQuery.addLgChemDonation(subCampaign[0].campaignId,nowRzPoint);
                        //     console.log("엘지기부포인트증가", moment().format("YYYY-MM-DD HH:mm:ss"));
                        //     [rows] = await connection.query(sqlQuery);
                        //     console.log(sqlQuery)
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
        connection.release();
        throw err
    }
}
module.exports = {
    addLgChemDonation ,
    donation ,
    setTotalAmount,

}