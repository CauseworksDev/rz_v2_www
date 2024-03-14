//-----사파리 높이값 버그 수정-----
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
//resize
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

$(function () {
    //-----본문 바로가기 버튼-----
    const btnSkip = $('.skip a');
    btnSkip.on('focus', function(){
        $(this).parent().addClass("on")
    });
    btnSkip.on('click', function(){
        $(this).parent().removeClass("on")
    });
    btnSkip.on('focusout', function(){
        $(this).parent().removeClass("on")
    });

    //-----공통 팝업----- 
    let _focus;
    //tab 막기
    function preventTab() {
        $(".popup").each(function(){
            let focusList = $(this).find("button, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])");
            let firstFocus = focusList.eq(0);
            let lastFocus = focusList.eq(focusList.length - 1);
            //첫번째 요소 focus
            firstFocus.focus();
            firstFocus.on({
                'keydown': function (e) {
                    if (e.shiftKey && e.keyCode === 9) {
                        e.preventDefault();
                        $(lastFocus).focus();
                    }
                }
            });
            lastFocus.on({
                'keydown': function (e) {
                    if (!e.shiftKey && e.keyCode === 9) {
                        e.preventDefault();
                        $(firstFocus).focus();
                    }
                }
            });
        });
    }
    //팝업 버튼 클릭시
    $(".btn_popup").each(function () {
        let popupName = $(this).attr("data-popup");
        $(this).click(function () {
            _focus = $(this);
            $("html").addClass("ofy_hidden")
            $("#popup_all #" + popupName).addClass("active").attr("tabindex", 0).focus();
            preventTab();
            // Esc키 : 레이어 닫기
            window.onkeyup = function (e) {
                var key = e.keyCode ? e.keyCode : e.which;
                if (key === 27) {
                    $("html").removeClass("ofy_hidden")
                    $(".popup").removeClass("active").removeAttr("tabindex");
                    jQuery(document).off("keydown", preventTab());
                    _focus.focus()
                }
            }
        })
    });
    //팝업 닫기버튼 클릭시
    $(".btn_popup_close").click(function () {
        $("html").removeClass("ofy_hidden")
        $(".popup").removeClass("active").removeAttr("tabindex");
        jQuery(document).off("keydown",preventTab());
        _focus.focus()
    });
})//ready