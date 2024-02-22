const schedule = require('node-schedule');
const donationController = require('./donation.controller');
const moment = require('moment');


jobStaticsStatus = () => {
    let period = '';
    if(process.env.NODE_ENV === 'live') {
        period = '*/60 * * * * *';
    }
    else {
        // period = '0 0 * * * ';
        period = '*/60 * * * * *';
    }

    schedule.scheduleJob(`${period}`, async () => {
        console.log(process.env.NODE_ENV,"환경 스케쥴러 시작", moment().format("YYYY-MM-DD HH:mm:ss"));

        await donationController.handleJobStatistics();
    });
};


module.exports = {
    jobStaticsStatus,
};
