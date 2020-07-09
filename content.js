
chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.event === "place_in_input")
            placeInInput(request.params)
        // else if(request.event === "get_objects_list")
    }
)
    
$(window).on('load', () => {
    setTimeout(
        () => {
        if($('.input__control').val()){
            params = JSON.parse(localStorage.getItem('params'))
            bem = $('.serp-item.serp-item_pos_0').data('bem')

            if(bem) {
                bem = bem['serp-item']
                if(bem['dups']&&bem['dups'][0]) {
                    if(bem['dups'][0]['origin'])
                        params['img_source'] = bem['dups'][0]['origin']['url']
                    else
                        params['img_source'] = bem['dups'][0]['url']
                }else{
                    params['img_source'] = bem['img_href']                
                }
                params['url_source'] = bem['snippet']['url']
                params['title_source'] = bem['snippet']['title']
                params['text_source'] = bem['snippet']['text']
                params['parsed'] = 1

                // console.log(params)
                sendToBackground(params)
            }
        }
    }, 2000)
})


placeInInput = (params) => {
    localStorage.setItem('params', JSON.stringify(params))
    $('.input__control').val(params.query_title)
    $('.search2__button button').click()
    window.location.reload(false)
}



// function getPagesList(params) {
//     var list_class = params.pages_list_class;
//     var list = [];

//     $(list_class).map(function () {
//         var href = $(this).attr('href');
//         if (href.charAt(0) == '/') {
//             href = window.location.origin+href;
//         }

//         list.push(href);
//     });

//     sendToBackground({
//         "type": 'pages_list',
//         "list": list
//     })
// }

// function getObjectsList(params) {
//     var list_class = params.object_min_class;
//     var list = [];

//     list.push(window.location.href);

//     $(list_class).map(function () {
//         var href = $(this).attr('href');
//         if (href.charAt(0) == '/') {
//             href = window.location.origin+href;
//         }

//         list.push(href);
//     });

//     sendToBackground({
//         "type": 'objects_list',
//         "list": list
//     })
// }

function sendToBackground(params) {
    chrome.runtime.sendMessage({
        "type": "from_content",
        "data": params
    });
}