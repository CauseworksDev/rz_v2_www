const express = require('express');
const request = require('request');
const router = express.Router();
let leadingZeros = function (n, digits) {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
};
router.post('/', function(req, res, next) {
    res.send(200)
});
router.get('/', function(req, res, next) {
    let userSession = req.session
    // console.log(userSession)
    if(!req.session.language){
        //세션에 랭귀지 값이 없다면 kr 셋팅
        userSession.language = 'Kr'
    }
    userSession.main = 'Y'

    res.redirect(`/main/${userSession.language}`)
    // res.render('user/test', {url:url,PaReq:PaReq,xid:xid});
});
router.get('/main/:language', async function(req, res, next) {
    let userSession = req.session
    userSession.main = 'Y'
    if (req.params.language){
        //url 파라미터로 언어 값이 들어온 경우 세션 랭귀지 값에 파라미터값 셋팅
        if(req.params.language == 'en'||req.params.language == 'En'){
            req.params.language = 'En'
        }else{
            req.params.language = 'Kr'
        }
        userSession.language = req.params.language
    }else{
        //url 파라미터로 언어값이 없을 경우
        if(!req.session.language){
            //세션에 랭귀지 값이 없다면 kr 셋팅
            userSession.language = 'Kr'
        }

    }
    let recycleInfo = {
        activeCount : 0 ,
        weightCoast : 0 ,
        weightPet : 0 ,
        personnel : 0 ,
        dateLast : '*2023년 8월 기준' ,
    }
    if (userSession.language){
        res.render(`user/main/main${userSession.language}`, {userSession:userSession,recycleInfo:recycleInfo});
    }else{
        res.render(`user/main/mainKr`, {userSession:userSession,recycleInfo:recycleInfo});
    }

    // 백단에서 api 요청 하는 법
    // await request({
    //     url: 'http://127.0.0.1:5225/api/recycle/v1.0/pet',
    //     method: 'GET',
    //     qs: {}
    // }, await function (err, res1, body) {
    //
    //     if(err){
    //
    //     }else{
    //
    //         if(body){
    //             // console.log(body)
    //             let apiResult = JSON.parse(body)
    //             recycleInfo.weightPet = parseInt(apiResult.data.items[0].weightPet)
    //             let updateDate = new Date(apiResult.data.items[0].dateLast);
    //            recycleInfo.dateLast = "*"+leadingZeros(updateDate.getFullYear(), 4) + '년 ' + leadingZeros(updateDate.getMonth() + 1, 2)+ '월 기준';
    //         }
    //
    //     }
    //
    // });


    // console.log(req.query)


});
// router.get('/main', function(req, res, next) {
//     let userSession = req.session
//     userSession.language = 'kr'
//
//     console.log(req.query)
//     res.render('user/main/main', {userSession:userSession});
// });

router.get('/mainEn', function(req, res, next) {
    let userSession = req.session
    userSession.language = 'en'
    userSession.main = 'Y'
    // console.log(req.query)
    res.render('user/main/mainEn', {userSession:userSession});
});

router.get('/academy', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/academy/academy', {userSession:userSession});
});

router.get('/program', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/program', {userSession:userSession});
});

router.get('/shop', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/shop', {userSession:userSession});
});

router.get('/collectionA', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/collectionA', {userSession:userSession});
});

router.get('/collectionB', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/collectionB', {userSession:userSession});
});

router.get('/collectionC', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/collectionC', {userSession:userSession});
});

router.get('/collectionD', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/program/collectionD', {userSession:userSession});
});

router.get('/sea', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/sea/sea', {userSession:userSession});
});

router.get('/board', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/board/board', {userSession:userSession});
});

router.get('/newMain', function(req, res, next) {
    let userSession = req.session
    userSession.main = 'N'

    // console.log(req.query)
    res.render('user/main/newMain', {userSession:userSession});
});

module.exports = router;
