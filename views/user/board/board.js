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
        type : 2,
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
                }
            }


        }
    });

}

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
                            $("#contentImgTitle").text(textLengthCheck(item.title))
                            $("#contentImgLastDate").text(dateLast)
                            $("#contentImgText").text(item.contentText)
                        } else if (item.category == 2) {
                            $("#contentVidFrame").attr("title",item.title)
                            $("#contentVidFrame").attr("src",item.link)
                        } else if (item.category == 3) {
                            $("#contentCardTitle").text(textLengthCheck(item.title))
                            $("#contentCardLastDate").text(dateLast)
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

                    });
                }
            }


        }
    });

    layer_OPEN(type)
}
