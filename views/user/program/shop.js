let getShopInfo = function(){
    $("#tbl_dataList").empty();
    let data = {
        searchKeyword : $("#searchKeyword").val(),
        pageNo:1,
        numOfRows : 1
    };

    $.ajax({
        url:"/api/content/v1.0/emart/store",
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

                    $.each(list, function (idx, item) {

                        itemHTMLAddr = itemHTMLAddr +
                            `<li>
                                <div class="name">${item.name}</div>
                                <div class="address">${item.address}</div>
                            </li>`

                    });
                    $("#tbl_dataList").append(itemHTMLAddr);
                }
            }


        }
    });

}

