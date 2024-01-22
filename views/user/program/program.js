let getRecycleInfo = function(){
    let data = {
    };

    $.ajax({
        url:"/api/recycle/v1.0/pet",
        dataType :"json",
        data : data,
        beforeSend: function (request) {
        },
        type:"get",
        cache:false,
        success : function(result1,s,j ){
            console.log(result1)
            let dateLast = '-'
            if(result1.result.resultCode == 200){
                if(result1.data.items.length !== 0){

                    $("#weight").text(result1.data.items[0].weightPet)
                    $("#dateLast").text(getMonthStamp(result1.data.items[0].dateLast))
                }
                // console.log(result1.data.items)
            }



        }
    });

}

