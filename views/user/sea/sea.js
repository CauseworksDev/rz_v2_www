let loacationName = {
    "인천":"incheon",
    "군산":"gunsan",
    "목포":"mokpo",
    "순천":"suncheon",
    "광양":"gwangyang",
    "여수":"yeosu",
    "부산":"busan",
    "제주(제주)":"jeju",
    "제주(서귀포)":"seogwipo",
    "양양":"yangyang",
    "서천":"seochun",
    "동해":"donghae",
    "통영":"tongyong",
}
let getRecycleStatistics = function(year){
    let data = {
        year : year
    };

    $.ajax({
        url:"/api/recycle/v1.0/total",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){

            let dateLast = '-'
            if(result1.result.resultCode == 200){
                if(result1.data.items.length == 1){
                    $("#personnel").text(numberWithCommas(result1.data.items[0].personnel))
                    $("#weight").text(parseInt(result1.data.items[0].weightCoast))
                    $("#dateLast").text(getMonthStampToString(result1.data.items[0].dateLast))
                    $("#activeCount").text((result1.data.items[0].activeCount))
                }
                getRecycleInfo(year)
            }



        }
    });

}
let swiper = undefined;
let getRecycleInfo = function(year){

    $("#tbl_dataList").empty();
    $("#pinList").empty();
    let data = {
        year : year
    };

    $.ajax({
        url:"/api/recycle/v1.0/",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){

            if(result1.result.resultCode == 200){

                let list = result1.data.items;
                let itemHTMLAddr = '';
                let itemHTMLAddr2 = '';
                $.each(list, function (idx, item) {

                    itemHTMLAddr = itemHTMLAddr +
                        `
                        <div class="swiper-slide">
                            <h4>지역별 활동 내역</h4>
                            <h5>${item.location}</h5>
                            <ul>
                                <li>
                                    <p><span>${item.activeCount}</span>회</p>
                                    <h6>활동 진행 횟수</h6>
                                </li>
                                <li>
                                    <p><span>${item.personnel}</span>명</p>
                                    <h6>활동 참여 인원</h6>
                                </li>
                                <li>
                                    <p><span>${parseInt(item.weightCoast)}</span>kg</p>
                                    <h6>수거 폐기물 양</h6>
                                </li>
                            </ul>
                        </div>
                        `
                    // console.log(`${item.location}`+loacationName[`${item.location}`])
                    let nowPinName = loacationName[`${item.location}`]
                    let nowPinClass=''
                    if(idx == 0){
                        nowPinClass  = 'class="on"'
                    }
                    itemHTMLAddr2 = itemHTMLAddr2 +

                        `
                        <li ${nowPinClass} data-region="${nowPinName}">
                                <button></button>
                            </li>
                        `

                });

                $("#tbl_dataList").append(itemHTMLAddr);
                $("#pinList").append(itemHTMLAddr2);

                if (swiper != undefined){
                    swiper.destroy();
                    swiper = undefined;
                }
                //sea sec 02 swiper setting
                let slideInx = 0; //현재 슬라이드 index
                swiper = new Swiper('.sea_sec_02 .slide_wrap .swiper-container', {
                    observer: true,
                    observeParents: true,
                    allowTouchMove: true,
                    effect: 'fade',
                    speed: 500,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    navigation: {
                        nextEl: '.sea_sec_02 .slide_wrap .btn_next',
                        prevEl: '.sea_sec_02 .slide_wrap .btn_prev',
                    },
                    pagination: {
                        el: '.sea_sec_02 .slide_wrap .swiper-pagination',
                        type: 'fraction',
                        clickable: true,
                    },
                    on: {
                        realIndexChange: function () {
                            let slideNum = swiper.realIndex;
                            let btnNum = $('.sea_sec_02 .pin_list li').eq(slideNum);
                            btnNum.addClass('on').siblings().removeClass('on');
                        },

                        // activeIndexChange: function () {
                        //     slideInx = this.realIndex; //현재 슬라이드 index 갱신
                        // }
                    },
                });

                let btn_map = $('.sea_sec_02 .pin_list li');
                btn_map.on('click', function () {
                    let idxNum = $(this).index()+1;
                    $(this).addClass('on').siblings().removeClass('on');
                    swiper.slideTo(idxNum);
                });

            }



        }
    });

}
let getSeaImage = function(year){
    $("#seaImageSlider").empty();
    let data = {
        status : 1
    };

    $.ajax({
        url:"/api/content/v1.0/month",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){

            if(result1.result.resultCode == 200){

                let list = result1.data.items;
                console.log(list)
                let itemHTMLAddr = '';
                let itemHTMLAddr2 = '';
                $.each(list, function (idx, item) {

                    itemHTMLAddr = itemHTMLAddr +
                        `
                        <div class="swiper-slide">
                            <figure style="background-image: url(${item.imgUrl})"></figure>
                        </div>
                        `



                });

                $("#seaImageSlider").append(itemHTMLAddr);


            }



        }
    });

}