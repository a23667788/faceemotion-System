var DEBUG = true;
var BACKEND

var task
var pointer
var dataStatus
var dataFilter = []
$(document).ready(function() {
    initialControllerEvents();
    updateDataFilter()
});

function setBackend(backend) {
    BACKEND = backend
}

function initialControllerEvents() {

    $('#btn_input_idx').click(function() {
        pointer = parseInt($('#input_idx').val())-1
        console.log(pointer)
        getData(task.dataset, task.list[pointer].id.toString());
    });

    // Button Events
    $('#btn_prev_image').click(function() {
        goToPrevData();
    });
    $('#btn_next_image').click(function() {
        goToNextData();
    });
    $('#btn_clear').click(function() {
        clearData();
    });
    $('#btn_save').click(function() {
        putData(task.dataset, task.list[pointer].id.toString());
    });
    $('#btn_garbage').click(function() {
        switchStatusLabel('garbage')
    });
    $('#btn_to_check').click(function() {
        switchStatusLabel('to_check')
    });
    $('#btn_checked').click(function() {
        switchStatusLabel('checked')
    });
    $('#show_all').change(function() {

        if (this.checked) {
            $('#show_checked').prop('checked', true);
            $('#show_to_check').prop('checked', true);
            $('#show_garbage').prop('checked', true);
            $('#show_new').prop('checked', true);
            $('#show_labeled').prop('checked', true);

        } else {
            $('#show_checked').prop('checked', false);
            $('#show_to_check').prop('checked', false);
            $('#show_garbage').prop('checked', false);
            $('#show_new').prop('checked', true);
            $('#show_labeled').prop('checked', true);
        }
        updateDataFilter()
    });
    $('#show_checked').change(function() {
        updateDataFilter()
    });
    $('#show_to_check').change(function() {
        updateDataFilter()
    });
    $('#show_garbage').change(function() {
        updateDataFilter()
    });
    $('#show_new').change(function() {
        updateDataFilter()
    });
    $('#show_labeled').change(function() {
        updateDataFilter()
    });



    // Keyboard Events
    $(document.body).on('keydown', function(e) {
        switch (e.which) {
            case 27: //Clear data: esc
                e.preventDefault();
                clearData();
                break;
            case 33: //Previous data: page up
                e.preventDefault();
                goToPrevData();
                break;
            case 32: //Next data: space
            case 34: //Next data: page down
                e.preventDefault();
                goToNextData();
                break;
            case e.ctrlKey && 71: //Set data garbage: ctrl+g
                e.preventDefault();
                switchStatusLabel('garbage')
                break;
            case e.ctrlKey && 84: //Set data to-check: ctrl+t
                e.preventDefault();
                switchStatusLabel('to_check')
                break;
            case e.ctrlKey && 83: //save data: ctrl+s
                e.preventDefault();
                putData(task.dataset, task.list[pointer].id.toString());
                break;
            case e.ctrlKey && 67: //Set data check: ctrl+c
                e.preventDefault();
                switchStatusLabel('checked')
                break;
        }

    });
}



// ========== Data control functions ==========

function updateDataFilter() {
    new_filter = []
    if ($('#show_checked').is(":checked")) {
        new_filter.push('checked')
    }
    if ($('#show_new').is(":checked")) {
        new_filter.push('new')
    }
    if ($('#show_to_check').is(":checked")) {
        new_filter.push('to_check')
    }
    if ($('#show_garbage').is(":checked")) {
        new_filter.push('garbage')
    }
    if ($('#show_labeled').is(":checked")) {
        new_filter.push('labeled')
    }

    dataFilter = new_filter
   // dataFilter = ['checked', 'new', 'to_check', 'garbage', 'labeled']
}

function nextAvailableData(startFrom) {
    for (var i = startFrom + 1; i < task.list.length; i++) {
        if (dataFilter.includes(task.list[i].status))
            return i;
    }
    return startFrom;
}

function prevAvailableData(startFrom) {
    for (var i = startFrom - 1; i >= 0; i--) {
        if (dataFilter.includes(task.list[i].status))
            return i;
    }
    return startFrom;
}

function all_done_prompt(msg){
    
    var warningWindow = {
        state0: {
            title:  'EmotiEyE 情緒投票系統',
            html:   '此清單已完成。',
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


function goToFirstData() {
    pointer = nextAvailableData(-1)
    if (pointer == -1)
    {
        pointer = 0;
        all_done_prompt();
        $('#show_all').prop('checked', true);
        $('#show_checked').prop('checked', true);
        $('#show_to_check').prop('checked', true);
        $('#show_garbage').prop('checked', true);
        $('#show_new').prop('checked', true);
        $('#show_labeled').prop('checked', true);
        updateDataFilter()
    }
    getData(task.dataset, task.list[pointer].id.toString());
}


function goToPrevData() {
    // putData(task.dataset, task.list[pointer].id.toString());
    pointer = prevAvailableData(pointer)
    getData(task.dataset, task.list[pointer].id.toString());
}

function goToNextData() {
    // putData(task.dataset, task.list[pointer].id.toString());
    pointer = nextAvailableData(pointer)
    getData(task.dataset, task.list[pointer].id.toString());
}

function setPointerLabel() {
    $("#data_pointer").text((pointer + 1).toString() + '/' + task.list.length.toString());
    // $("#input_idx").val((pointer + 1).toString());
}



function setStatusLabel(label, message) {
    $("#data_status").attr("class", "label label-" + label);
    $("#data_status").text(message);
}

function switchStatusLabel(status, label, message) {
    if (getDataStatus() != status) {
        setDataStatus(status)
        switch (status) {
            case 'garbage':
                setStatusLabel('danger', '垃圾');
                break;
            case 'to_check':
                setStatusLabel('danger', '待確認');
                break;
            case 'checked':
                setStatusLabel('primary', '已完成');
                break;
        }
    } else {
        checkStatus()
    }
}


// ========== API Operations ==========
function getData(datasetName, id) {

    targetUrl = BACKEND + '/datasets/' + datasetName + '/' + id
    $.ajax({
        url: targetUrl + '/meta',
        async: false
    }).then(function(data) {
        loadData(data, targetUrl + "/image")
    })
    setPointerLabel()
}

function putData(datasetName, id) {

    targetUrl = BACKEND + '/datasets/' + datasetName + '/' + id
    $.ajax({
        url: targetUrl + '/meta',
        contentType: "application/json",
        type: "PUT",
        async: false,
        data: JSON.stringify(dumpData())
    }).success(function(msg) {
        task.list[pointer].status = getDataStatus()
    })
}

function getTask(datasetName, taskId) {

    $.ajax({
        url: BACKEND + '/jobs/' + datasetName + '/' + taskId,
        async: false
    }).then(function(data) {
        task = data
        pointer = 0
    })

}

// ========== End of API Operations ==========
