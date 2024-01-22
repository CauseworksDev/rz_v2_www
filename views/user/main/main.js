let getPopupInfo = function(){
    let data = {
        status : 1
    };

    $.ajax({
        url:"/api/popup/v1.0/",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){
            let htmlText = ``
            let dateLast = '-'
            if(result1.result.resultCode == 200){
                if(result1.data.items.length >= 1){
                    let list = result1.data.items;
                    let itemHTMLAddr = '';

                    $.each(list, function (idx, item) {
                        if(idx == 0){
                            let startATag = ``
                            let endATag = ``
                            if(item.link){
                                startATag =`<a href="${item.link}" target="_blank">`
                                endATag = `</a>`
                            }
                            itemHTMLAddr = itemHTMLAddr +
                                `${startATag}<img src="${item.imgUrl}" class=""/>${endATag}`
                        }


                    });
                    $("#popupImgList").append(itemHTMLAddr);
                    $("#normalPopup").show()
                    console.log("팝업",result1.data.items)
                }


            }



        }
    });

}

let getRecycleInfo = function(){
    let data = {
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

                    // $("#personnel").text(numberWithCommas(result1.data.items[0].personnel))
                    // $("#weight").text(numberWithCommas(result1.data.items[0].weight))
                    // // $("#activeCount").append(numberWithCommas(result1.data.items[0].activeCount))
                    // $("#activeCount").append(`<strong class="count_num" data-count="${result1.data.items[0].activeCount}" >${result1.data.items[0].activeCount}</strong>회`)
                    // $("#dateLast").text(getMonthStamp(result1.data.items[0].dateLast))
                }
                // console.log(result1.data.items)
            }



        }
    });

}