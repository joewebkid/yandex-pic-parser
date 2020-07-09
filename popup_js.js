$(document).ready(function () {
    $('#start-stop').click(function () {
        startOrStop(this);
    });

    function startOrStop(elem) {
        if ($(elem).find('.play-or-stop.active').hasClass('play')) {
            $('.play-or-stop.stop').addClass('active');
            $('.play-or-stop.play').removeClass('active');
            startParsing();
        } else {
            $('.play-or-stop.play').addClass('active');
            $('.play-or-stop.stop').removeClass('active');
            stopParsing();
        }
    }

    function startParsing() {  

        $('.form').slideUp(500, function () {
            $.ajax({
              url: "http://x-case.ru/api/json/export/",
              context: document.body
            }).done(function(data) {
                setParams({
                    'main_page': 'https://yandex.ru/images/search',
                    'objects': data,
                });
              // $( this ).addClass( "done" );
            });
            // setParams({
            //     'main_page': 'https://yandex.ru/images/search',
            //     'objects': $('#objects').val(),
            // });
        });
    }

    function stopParsing() {
        $('.form').slideDown(500);
    }
});

function addInfo(text) {

    var b = 0;
    $('.info-str').map(function () {
        b++;
    });

    if (b >= 10) {
        $('.info-str:first').hide(300, function () {
            $('.info-str:first').remove();
        });
    }

    $('.info-block').append('<div class="info-str" style="display: none">' + text + '</div>');
    $('.info-str:last').show(300);
}

function setParams(params) {
    chrome.runtime.sendMessage({
        "type": "set_params",
        "data": params
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'info') {
            addInfo(request.message);
        }
    }
);