const responseCommon = require("../common/response");
const donationService = require("../service/donation.service");
const checkTypes = require('check-types');
const moment = require('moment');

// 도네이션 기부 금액 증가(LG)
addLgChemDonation = async (req, res, next) => {
    let result = {}
    let data = {}
    let campaignId = (!req.body.campaignId) ? "" : parseInt(req.body.campaignId);
    let rzPoint = (!req.body.rz) ? "" : (req.body.rz);

    try {
        //도네이션 기부 금액 증가
        const resData = await donationService.addLgChemDonation(campaignId,rzPoint)

        result = {
            resultCode : responseCommon.RESULT.SUCCESS.code,
            resultMsg : responseCommon.RESULT.SUCCESS.string
        };
        data = resData;
        responseCommon.sendResponseResult(result, data, res);

    } catch (err) {
        console.log('postRevisionStyle:: ', err);
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
        console.log('postRevisionStyle:: ', err);
        responseCommon.sendResponseFail(err.code, res);
        result = {
            resultCode : err.code,
            resultMsg : err.message
        };
    }

}
module.exports = {
    addLgChemDonation,
    donation,



}
