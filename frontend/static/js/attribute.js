var URL = 'http://192.168.3.2:1327'
var user_name
var item_id
var item_name
var emotions = ['happy', 'angry', 'sad', 'disgust', 'surprise', 'contempt', 'afraid', 'confused']
var expression = []
$(function () {
    // Initial events
    // login_prompt()
    


});

function warning_prompt(msg){
    
    var warningWindow = {
        state0: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<h4>' + msg + '</h4>',
            buttons: { '知道了': 0 },
            focus: 0,
            submit:function(e,v,m,f){
                e.preventDefault();
                $.prompt.close();
            }
        }
    }
    $.prompt(warningWindow)
}

function confirm_prompt(){
    
    var confirmWindow = {
        
        state0: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<h4>你這張圖沒有標記喔</h4>',
            buttons: {'存檔並下一張':0, '補標': 1 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) {
                    sent_to_server()
                    goToNextImage()
                    $.prompt.close();
                }
                else{
                    $.prompt.close();
                }
            }
        },
        
    };
    $.prompt(confirmWindow)
}

function login_prompt(){
    var startWindow = {
        state0: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<label>請輸入帳號 <input type="text" name="user_name" value="" id="input_user_name"></label><br />',
            buttons: {  '下一頁': 1 },
            focus: 1,
            submit:function(e,v,m,f){
                user_name = f.user_name
                // console.log(user_name)
                e.preventDefault();
                if (check_user_name())
                    $.prompt.goToState('state1');
                // else
                //     $.prompt.goToState('state0e');
            }
        },
        state0e: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<label>請重新輸入帳號 <input type="text" name="user_name2" value="" id="input_user_name2"></label><br />',
            buttons: {  '下一頁': 1 },
            focus: 1,
            submit:function(e,v,m,f){
                user_name = f.user_name2
                e.preventDefault();
                if (check_user_name())
                    $.prompt.goToState('state1');
                else
                    $.prompt.goToState('state0e');
            }
        },
        state1: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/1.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state0');
                else if (v == 1) $.prompt.goToState('state2');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state2: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/2.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state1');
                else if (v == 1) $.prompt.goToState('state3');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state3: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/3.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state2');
                else if (v == 1) $.prompt.goToState('state4');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state4: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/4.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state3');
                else if (v == 1) $.prompt.goToState('state5');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state5: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/5.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state4');
                else if (v == 1) $.prompt.goToState('state6');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state6: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/6.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state5');
                else if (v == 1) $.prompt.goToState('state7');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state7: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/7.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state6');
                else if (v == 1) $.prompt.goToState('state8');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state8: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/8.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state7');
                else if (v == 1) $.prompt.goToState('state9');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state9: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/9.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state8');
                else if (v == 1) $.prompt.goToState('state10');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state10: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/10.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state9');
                else if (v == 1) $.prompt.goToState('state11');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state11: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<img src="images/11.png" width="100%">',
            buttons: { '上一頁': 0, '下一頁': 1 ,'跳過說明':2 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state10');
                else if (v == 1) $.prompt.goToState('state12');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        state12: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<h4>開始標註</h4>',
            buttons: { '上一頁': 0, '開始標註': 1 },
            focus: 1,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 0) $.prompt.goToState('state11');
                else {
                    $.prompt.close();
                    init()
                }
            }
        },
        
    };


    
    $.prompt(startWindow)
}


function alert_done_all(){
    var startWindow = {
        
        state0: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '<h4>已完成所有臉的標註</h4>',
            buttons: {'從頭顯示所有':4, '知道了': 3 },
            focus: 3,
            submit:function(e,v,m,f){
                e.preventDefault();
                if (v == 4) {
                    init('show_all')
                    $.prompt.close();
                }
                else{
                    $.prompt.close();
                }
            }
        },
        
    };


    
    $.prompt(startWindow)

}


function check_user_name(){
    var ret = false
    // console.log(user_name)
    $.ajax({
        url: URL + '/api/check_user',
        data: JSON.stringify({
            user_name: user_name
        }),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        async: false,
        success: function(data){
            ret = true
        },
        error:function(xhr, ajaxOptions, thrownError){  
            ret = false
        }
    });
    return ret
}

// Function of initializing image
function init(show){
    show = show || "show_todo";
    $("#show_image").val(show);
    $.ajax({
        url: URL + '/api/get_item',
        data: JSON.stringify({
            user_name: user_name, 
            current_id: item_id,
            direction: 'init',
            show: show
        }),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        async: false,
        success: function(data){
            if (data == 'ALLDONE'){
                alert_done_all()
            }
            else if (data == 'EOF'){
                warning_prompt('沒有下一張了')
            }
            else if (data == 'BOF'){
                warning_prompt('沒有上一張了')
            }
            else{
                item_id = data.id
                item_name = data.name
                loadImage()    
            }
        },
        error:function(xhr, ajaxOptions, thrownError){  
            
        }
    });
    initialButtonEvent()
    initialKeyboardEvent()
    initialRateEvent()
}

// Function of going to next image
function goToNextImage(){
    $.ajax({
        url: URL + '/api/get_item',
        data: JSON.stringify({
            user_name: user_name, 
            current_id: item_id,
            direction: 'next',
            show: $('#show_image').val()
        }),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        async: false,
        success: function(data){
            if (data == 'ALLDONE'){
                alert_done_all()
            }
            else if (data == 'EOF'){
                warning_prompt('沒有下一張了')
            }
            else if (data == 'BOF'){
                warning_prompt('沒有上一張了')
            }
            else{
                item_id = data.id
                item_name = data.name
                loadImage()    
            }
        },
        error:function(xhr, ajaxOptions, thrownError){  
        }
    });
}

// Function of going to prev image
function goToPrevImage(){
    $.ajax({
        url: URL + '/api/get_item',
        data: JSON.stringify({
            user_name: user_name, 
            current_id: item_id,
            direction: 'prev',
            show: $('#show_image').val()
        }),
        contentType: "application/json; ",
        type: "POST",
        async: false,
        success: function(data){
            if (data == 'ALLDONE'){
                alert_done_all()
            }
            else if (data == 'EOF'){
                warning_prompt('沒有下一張了')
            }
            else if (data == 'BOF'){
                warning_prompt('沒有上一張了')
            }
            else{
                item_id = data.id
                item_name = data.name
                loadImage()    
            }
        },
        error:function(xhr, ajaxOptions, thrownError){  
        }
    });
}

function loadImage(){
    $('#image').attr("src", URL + '/api/' + item_id + '/image');
    // console.log(item_id)
    $.ajax({
        url: URL + '/api/' + item_id + '/meta',
        type: "GET",
        async: false,
        success: function(data){

            scores = data['voting'][user_name]
            // $('#image_idx').text('#' + data['id'])
            if (typeof scores === "undefined"){
                $("#image_label").attr("class", "label label-warning");
                $("#image_label").text('未標記');
                // scores = ['0', '0', '0', '0', '0', '0', '0', '0']
                resetFields()
            }
            else if (scores[0] == '-1' ){
                $("#image_label").attr("class", "label label-danger");
                $("#image_label").text('垃圾');
                resetFields()
            }
            else{
                $("#image_label").attr("class", "label label-success");
                $("#image_label").text('已標記');
                jQuery.each( emotions, function( i, val ) {
                    $('#num-' + val).val(parseInt(scores[i]));
                })
                if (parseInt(scores[8])==1){
                    $("#check-squint").prop("checked",true);
                }
                else{
                    $("#check-squint").prop("checked",false);   
                }
                if (parseInt(scores[9])==1){
                    $("#check-pout").prop("checked",true);
                }
                else{
                    $("#check-pout").prop("checked",false);   
                }
                if (parseInt(scores[10])==1){
                    $("#check-tongue").prop("checked",true);
                }
                else{
                    $("#check-tongue").prop("checked",false);   
                }
                if (parseInt(scores[11])==1){
                    $("#check-boy").prop("checked",true);
                }
                else{
                    $("#check-boy").prop("checked",false);   
                }
                if (parseInt(scores[12])==1){
                    $("#check-girl").prop("checked",true);
                }
                else{
                    $("#check-girl").prop("checked",false);   
                }
                if (parseInt(scores[13])==1){
                    $("#check-none").prop("checked",true);
                }
                else{
                    $("#check-none").prop("checked",false);   
                }
            }
            
            

        },
        error:function(xhr, ajaxOptions, thrownError){  
        }
    });
}

function setGarbage(){

    if ($("#image_label").text()=='垃圾'){
        check_value()
    }
    else{
        resetFields()
        $("#image_label").attr("class", "label label-danger");
        $("#image_label").text('垃圾');
    }


}

function check_value(){
    var flag = false
    jQuery.each( emotions, function( i, val ) {
        
        if (parseInt($('#num-' + val).val()) > 0){
            flag = true
        }
    })
    if (flag){
        $("#image_label").attr("class", "label label-success");
        $("#image_label").text('已標記');
    }
    else{
        $("#image_label").attr("class", "label label-warning");
        $("#image_label").text('未標記');
    }
    return flag

}
function sent_to_server(){
    var payload = [];
    
    if ($("#image_label").text()=='垃圾'){
        payload = ['-1','-1','-1','-1','-1','-1','-1','-1','-1','-1']
    }
    else{
        jQuery.each( emotions, function( i, val ) {
            payload.push($(('#num-' + val)).val());
        });

        if ($("#check-squint").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }

        if ($("#check-pout").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }  

        if ($("#check-tongue").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }    

        if ($("#check-boy").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }      

        if ($("#check-girl").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }
        if ($("#check-none").prop("checked")){
            payload.push('1')
        }
        else{
            payload.push('0')
        }        
    }
    console.log(payload)
 
    $.ajax({
        url: URL + '/api/'+item_id + '/meta',
        data: JSON.stringify({
            user_name: user_name, 
            payload: payload
        }),
        contentType: "application/json; charset=utf-8",
        type: "POST",
        async: false,
        success: function(data){
            
        },
        error:function(xhr, ajaxOptions, thrownError){  
        }
    });

}

/*========== Event ==========*/

// Event of keyboard event
function initialKeyboardEvent(){
    $(document.body).on('keydown', function (e) {
        
        switch (e.which) {

            case 27:  //Clear: ESC
                e.preventDefault();
                resetFields()
                break;
            case 33:  //Prev image: page up
                e.preventDefault();
                // sent_to_server()
                goToPrevImage();
                break;
            case 34:  //Next image: page down
                e.preventDefault();
                goToNextImage();
                break;
            // case 13:
            case 32:                                   
                e.preventDefault();
                if (check_value()) {
                    sent_to_server()
                    goToNextImage();    
                }
                else{
                    confirm_prompt()
                }
                    
                
                break;
            case e.ctrlKey && 71:                                   
                e.preventDefault();
                setGarbage()
                break;
        }
        
    });
}

// Event of button click
function initialButtonEvent(){
    $('#btn_clear').click(function(){
        resetFields()
    });
    $('#btn_save').click(function(){
        if (check_value()) {
            sent_to_server()
            goToNextImage();    
        }
        else{
            confirm_prompt()
        }
    });
    $('#btn_prev_image').click(function(){
        goToPrevImage()
    });
    $('#btn_next_image').click(function(){
        goToNextImage()
    });
    $('#btn_garbage').click(function(){
        setGarbage()
    });
}

function resetFields(){
    // Reset emotion images
    $.each(emotions, function(i, val){
        $('.face-rate-' + val).each(function(){
            curr_val = $(this).val()
            $(this).attr('src', 'images/emotion/' + val + curr_val + '.png')
        })
    })

    jQuery.each( emotions, function( i, val ) {
        $('#num-' + val).val(0);
    })
    $("#check-squint").prop("checked",false);
    $("#check-pout").prop("checked",false);
    $("#check-tongue").prop("checked", false);
    $("#check-boy").prop("checked",false);
    $("#check-girl").prop("checked", false);
    $("#check-none").prop("checked", false);
    check_value()
}  

function initialRateEvent(){
    $.each( emotions, function( i, val ) {
        resetFields()
        $('#num-' + val).bind('keyup mouseup', function () {
            check_value()
        });    
        
    });

    $('.face-rate').hover(function(){
        // Change all faces and previous face to color
        element = $(this)
        value = element.val()
        emotion = element.attr('class').split(' ')[1].split('-')[2]
        if (value != 0){
            element.attr('src', "images/emotion/colors/" + emotion + 'Y' + value + '.png')
            element.prevAll().each(function(){
            curr_val = $(this).val()
            $(this).attr('src','images/emotion/colors/' + emotion + 'Y' + curr_val + '.png')
            })
        }
    }, function(){
        // Remove all color 
        element = $(this)
        emotion = element.attr('class').split(' ')[1].split('-')[2]
        value = $("#num-" + emotion).val()

        $('.face-rate-' + emotion).each(function(){
            curr_val = $(this).val()
            if (curr_val != 0) {
                $(this).attr('src', 'images/emotion/' + emotion + curr_val + '.png')
            } 
        })

        if (value != 0) {
            $('.face-rate-' + emotion).each(function(){
                curr_val = $(this).val()
                if (curr_val <= value) {
                    $(this).attr('src', 'images/emotion/colors/' + emotion + 'Y' + curr_val + '.png')
                }
            })
        }
    })

    $('.face-rate').on('click', function(event) {
        element = $(this)
        value = element.val()
        emotion = element.attr('class').split(' ')[1].split('-')[2]
        prevVal = $('#num-' + emotion).val()
        $('.face-rate-' + emotion).each(function(){
            curr_val = $(this).val()
            if (curr_val != 0) {
                $(this).attr('src', 'images/emotion/' + emotion + curr_val + '.png')
            }
        })

        if (prevVal == value) {
            $("#num-" + emotion).val(0)
        } else {
            // Change image src to colored image
            if (value != 0){
                colorPath = "images/emotion/colors/" + emotion + 'Y' + value + '.png'
                element.attr('src', colorPath)
                element.prevAll().each(function(){
                    curr_val = $(this).val()
                    $(this).attr('src','images/emotion/colors/' + emotion + 'Y' + $(this).val() + '.png')
                })
            }
            // Update rating
            $("#num-" + emotion).val(value)
           
        }
        check_value()

    })
}




