let nowPage = 0
let listPass = true

let getContentList = function(page,row){
    if(listPass ==false){
        return false;
    }
    if (nowPage == 0){
        nowPage = 2
        $("#tbl_dataList").empty();
    }
    if(!page){
        nowPage += 1
        page = nowPage
    }
    let data = {
        status : 1,
        type : 1,
        pageNo:page,
        numOfRows : row
    };

    $.ajax({
        url:"/api/content/v1.0/",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){
            if(result1.result.resultCode == 200){
                if(result1.data.items){
                    let list = result1.data.items;
                    let itemHTMLAddr = '';
                    if(list.length == 0){
                        nowPage -= 1
                        listPass = false
                        $(".btn_more").hide()
                        return false
                    }
                    let hideBtnCnt = 20
                    if(page !== 1){
                        hideBtnCnt = 10
                    }

                    if(list.length < hideBtnCnt){
                        $(".btn_more").hide()
                    }
                    $.each(list, function (idx, item) {
                        let dateLast = '-'
                        if (item.dateLast) {
                            dateLast = getDayStamp(item.dateLast)
                        }else{
                            dateLast = getDayStamp(item.dateReg)
                        }
                        let category = ``
                        let popupLayer = `.popup_card`
                        if (item.category == 1) {
                            category = `이미지`
                            popupLayer = `.popup_img`
                        } else if (item.category == 2) {
                            category = `동영상`
                            popupLayer = `.popup_vid`
                        } else if (item.category == 3) {
                            category = `카드뉴스`
                            popupLayer = `.popup_card`
                        }
                        itemHTMLAddr = itemHTMLAddr +
                            `<li>
                                <div class="list_item">
                                    <div class="thum_wrap">
                                        <button type="button" onclick="layerReady('${popupLayer}','${item.contentId}')">
                                            <figure class="item_thum"
                                                    style="background-image: url(${item.imgUrl})"></figure>
                                        </button>
                                        <h3 class="item_tag">${category}</h3>
                                    </div>
                                    <div class="text_wrap">
                                        <h2 class="item_title">
                                            <button type="button" onclick="layerReady('${popupLayer}','${item.contentId}')">${textLengthCheck(item.title, 20)}</button>
                                        </h2>
                                        <p class="item_date">${dateLast}</p>
                                    </div>
                                </div>
                            </li>`

                    });
                    $("#tbl_dataList").append(itemHTMLAddr);
                }else{

                }
            }


        }
    });

}
let swiper = undefined;
let layerReady = function (type,contentId) {
    let data = {
        "contentId": contentId,
    };

    $.ajax({
        url:"/api/content/v1.0/",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){

            if(result1.result.resultCode == 200){
                if(result1.data.items){
                    let list = result1.data.items;

                    $.each(list, function (idx, item) {
                        let dateLast = '-'
                        if (item.dateLast) {
                            dateLast = getDayStamp(item.dateLast)
                        }else{
                            dateLast = getDayStamp(item.dateReg)
                        }
                        let category = ``
                        let popupLayer = `.popup_card`
                        if (item.category == 1) {
                            if(item.imgUrl){
                                $("#contentImg").css({"background-image":`url(${item.imgUrl})`});
                            }
                            // console.log(item.contentText)
                            $("#contentImgTitle").text(textLengthCheck(item.title))
                            $("#contentImgLastDate").text(dateLast)
                            $("#contentImgText").empty()
                            $("#contentImgText").append(item.contentText)
                        } else if (item.category == 2) {
                            $("#contentCardDate").text(dateLast)
                            $("#contentVidFrame").attr("title",item.title)
                            $("#contentVidFrame").attr("src",item.link)
                        } else if (item.category == 3) {
                            $("#contentCardTitle").text(textLengthCheck(item.title))
                            $("#contentCardLastDate").text(dateLast)
                            $("#contentCardDate").text(dateLast)
                            $("#contentCardSlider").empty()
                            let imgList = result1.data.imageUrls
                            let itemHTMLAddr = ''
                            $.each(imgList, function (idx2, item2) {
                                itemHTMLAddr = itemHTMLAddr +
                                    `
                                      <div class="swiper-slide"
                                        style="background-image: url(${item2})"></div>  
                                    `

                            })
                            $("#contentCardSlider").append(itemHTMLAddr);
                        }
                        if (swiper != undefined){
                            swiper.destroy();
                            swiper = undefined;
                        }
                        //popup_card swiper setting
                        swiper = new Swiper('#popup_all .popup_card .swiper-container', {
                            observer: true,
                            observeParents: true,
                            allowTouchMove: true,
                            speed: 500,
                            resistance: true,
                            freeMode: false,
                            navigation: {
                                nextEl: '#popupNext',
                                prevEl: '#popupPre',
                            },
                            pagination: {
                                el: '#popup_all .popup_card .swiper-container .swiper-pagination',
                                type: 'bullets',
                                clickable: true,
                            },
                            slidesPerView: 1,
                            spaceBetween: 0,
                        });
                    });
                }
            }


        }
    });

    layer_OPEN(type)
}

let getBannerSet = function(page,row){

    let data = {
    };

    $.ajax({
        url:"/api/banner/v1.0/setting",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){
            if(result1.result.resultCode == 200){
                if(result1.data.top == 1){
                    $(".aca_sec_02_top").show()
                }else{
                    $(".aca_sec_02_top").hide()
                }
                if(result1.data.bottom == 1){
                    $(".aca_sec_02_btm").show()
                }else{
                    $(".aca_sec_02_btm").hide()
                }

                if(result1.data.active == 1){
                    getBannerInfo()
                }else{
                    $(".aca_sec_02").hide()
                }


            }


        }
    });

}

let getBannerInfo = function(page,row){
    $("#bannerTop").empty()
    $("#bannerBottom").empty()
    let data = {
        status : 1,
    };

    $.ajax({
        url:"/api/banner/v1.0/",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){
            // console.log(result1)
            if(result1.result.resultCode == 200){
                if(result1.data.items){
                    let list = result1.data.items;
                    let itemHTMLAddrTop = '';
                    let itemHTMLAddrBottom = '';
                    if(list.length == 0){
                        $(".aca_sec_02").hide()
                        return false
                    }
                    if(list.length == 1){
                        $(".swiper-navigation").hide()
                        $(".swiper-pagination-bullets").hide()
                    }
                    $.each(list, function (idx, item) {
                        // console.log(item)
                        let startATag = ``
                        let endATag = ``
                        if(item.link){
                            startATag =`<a href="${item.link}" target="_blank">`
                            endATag = `</a>`
                        }
                        itemHTMLAddrTop =
                            `
                            <div class="swiper-slide slide_0${idx+1}">
                                ${startATag}
                                    <figure class="banner_pc_slider" id="banner_top_pc${idx+1}"></figure>
                                    <figure class="banner_mo_slider" id="banner_top_mo${idx+1}"></figure>
                                ${endATag}
                                <!-- 모바일인 경우 이미지가 모바일용으로 달라짐 -->
                            </div>
                            `
                        itemHTMLAddrBottom =
                            `
                            <div class="swiper-slide slide_0${idx+1}">
                                ${startATag}
                                    <figure class="banner_pc_slider" id="banner_bottom_pc${idx+1}"></figure>
                                    <figure class="banner_mo_slider" id="banner_bottom_mo${idx+1}"></figure>
                                ${endATag}
                                <!-- 모바일인 경우 이미지가 모바일용으로 달라짐 -->
                            </div>
                            `

                        if(item.imgUrlPc&&item.imgUrlMo){
                            $("#bannerTop").append(itemHTMLAddrTop)
                            $("#bannerBottom").append(itemHTMLAddrBottom)

                            $("#banner_top_pc"+(idx+1)).css({"background-image":`url(${item.imgUrlPc})`});
                            $("#banner_bottom_pc"+(idx+1)).css({"background-image":`url(${item.imgUrlPc})`});
                            $("#banner_top_mo"+(idx+1)).css({"background-image":`url(${item.imgUrlMo})`});
                            $("#banner_bottom_mo"+(idx+1)).css({"background-image":`url(${item.imgUrlMo})`});
                        }





                    });

                }else{
                    $(".aca_sec_02").hide()
                }
            }


        }
    });

}

