const express = require('express');
const router = express.Router();
const Controller = require('../../controller/donation.controller');

router.post('/mission', Controller.missionDonation); // 미션참여 도네이션 포인트 증가
router.post('/message', Controller.messageDonation); // 메세지참여 도네이션 포인트 증가
router.post('/', Controller.donation); // 도네이션




router.post('/test', Controller.donationTest); // 도네이션




module.exports = router;
