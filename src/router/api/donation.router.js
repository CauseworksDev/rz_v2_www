const express = require('express');
const router = express.Router();
const Controller = require('../../controller/donation.controller');

router.post('/lgChemPoint', Controller.addLgChemDonation); // 도네이션 포인트 증가
router.post('/', Controller.donation); // 도네이션




module.exports = router;
