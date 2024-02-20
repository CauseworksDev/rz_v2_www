const responseCommon = require("../common/response");
const donationService = require("../service/donation.service");
const checkTypes = require('check-types');
const moment = require('moment');

// 활동 참여로 인한 기부금 증가
missionDonation = async (req, res, next) => {
    let result = {}
    let data = {}
    let campaignId = (!req.body.campaignId) ? "" : parseInt(req.body.campaignId);
    let memberId = (!req.body.memberId) ? "" : parseInt(req.body.memberId);
    let missionId = (!req.body.missionId) ? "" : parseInt(req.body.missionId);
    let rzPoint = (!req.body.rz) ? 0 : (req.body.rz);

    try {
        //미션참여시 추가 지급 체크 후 포인트 지급
        // let nowDonationPoint = await donationService.checkAdditionalPoints(campaignId,memberId,missionId,rzPoint)

        //도네이션 기부 금액 증가
        const resData = await donationService.missionDonation(campaignId,memberId,missionId,rzPoint)

        result = {
            resultCode : responseCommon.RESULT.SUCCESS.code,
            resultMsg : responseCommon.RESULT.SUCCESS.string
        };
        data = resData;
        responseCommon.sendResponseResult(result, data, res);

    } catch (err) {
        console.log('missionDonation:: ', err);
        responseCommon.sendResponseFail(err.code, res);
        result = {
            resultCode : err.code,
            resultMsg : err.message
        };
    }

}// 메세지 참여로 인한 기부금 증가
messageDonation = async (req, res, next) => {
    let result = {}
    let data = {}
    let campaignId = (!req.body.campaignId) ? "" : parseInt(req.body.campaignId);
    let memberId = (!req.body.memberId) ? "" : parseInt(req.body.memberId);
    let messageId = (!req.body.messageId) ? "" : parseInt(req.body.messageId);
    let rzPoint = (!req.body.rz) ? 0 : (req.body.rz);

    try {
        //미션참여시 추가 지급 체크 후 포인트 지급
        // let nowDonationPoint = await donationService.checkAdditionalPoints(campaignId,memberId,missionId,rzPoint)

        //도네이션 기부 금액 증가
        const resData = await donationService.messageDonation(campaignId,memberId,messageId,rzPoint)

        result = {
            resultCode : responseCommon.RESULT.SUCCESS.code,
            resultMsg : responseCommon.RESULT.SUCCESS.string
        };
        data = resData;
        responseCommon.sendResponseResult(result, data, res);

    } catch (err) {
        console.log('messageDonation:: ', err);
        responseCommon.sendResponseFail(err.code, res);
        result = {
            resultCode : err.code,
            resultMsg : err.message
        };
    }

}
donation = async (req, res, next) => {
    let result = {}
    let data = {}
    let campaignId = (!req.body.campaignId) ? "" : parseInt(req.body.campaignId);
    let memberId = (!req.body.memberId) ? "" : parseInt(req.body.memberId);
    let rzPoint = (!req.body.rz) ? "" : (req.body.rz);

    try {
        //도네이션 기부 금액 증가
        const resData = await donationService.donation(campaignId,memberId,rzPoint)

        result = {
            resultCode : responseCommon.RESULT.SUCCESS.code,
            resultMsg : responseCommon.RESULT.SUCCESS.string
        };
        data = resData;
        responseCommon.sendResponseResult(result, data, res);

    } catch (err) {
        console.log('donation:: ', err);
        responseCommon.sendResponseFail(err.code, res);
        result = {
            resultCode : err.code,
            resultMsg : err.message
        };
    }

}
donationTest = async (req, res, next) => {
    let result = {}
    let data = {}
    let campaignId = (!req.body.campaignId) ? "" : parseInt(req.body.campaignId);
    let memberId = (!req.body.memberId) ? "" : parseInt(req.body.memberId);
    let rzPoint = (!req.body.rz) ? "" : (req.body.rz);

    try {
        //도네이션 테스트
        const resData = await donationService.donationTest(campaignId,memberId,rzPoint)

        result = {
            resultCode : responseCommon.RESULT.SUCCESS.code,
            resultMsg : responseCommon.RESULT.SUCCESS.string
        };
        data = resData;
        responseCommon.sendResponseResult(result, data, res);

    } catch (err) {
        console.log('donation:: ', err);
        responseCommon.sendResponseFail(err.code, res);
        result = {
            resultCode : err.code,
            resultMsg : err.message
        };
    }

}
module.exports = {
    missionDonation,
    messageDonation,
    donation,



    donationTest,



}
