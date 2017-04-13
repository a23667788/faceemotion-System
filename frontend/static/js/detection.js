var zoom
var areas
var imageCategories
var imageAesthetics
var imageAffections
var imageScenes
var objectLabels
var objectAttributes

originalData = {}

const color = ['red', 'blue', 'green', 'DarkViolet', 'DarkGoldenRod', 'LightSeaGreen']


$(document).ready(function() {
    initialTextChangeEvent()
    initialAutoComplete()
    $.prompt(promptJob);
});



var promptJob = {
    state0: {
        title: '偵測標注',
        html: '<label>請輸入資料集名稱 <input type="text" name="dataset_name" value=""></label><br />' +
            '<label>請輸入編號 <input type="text" name="task_id" value=""></label><br />',
        buttons: { 確認: 1 },
        focus: "input[name='dataset_name']",
        submit: function(e, v, m, f) {
            e.preventDefault();
            task_id = f.task_id
            if (v == 1) {
                $.prompt.close();
                getTask(f.dataset_name, f.task_id)
                goToFirstData()
            }

        }
    }
};


function loadData(data, image_url) {
    originalData = data
    setImageInfo(data.image)
    loadImage(data, image_url)

    clearObjectList();
    setObjectInfo('');

    loadObjectList(areas)
    if (data.status) {
        dataStatus = data.status
    } else {
        dataStatus = 'new'
    }
    updateStatus()

}

function clearData() {
    resetBox()
    setObjectInfo('')
}

function dumpData() {
    ret = originalData

    objectsInfo = []
    var final_areas = $('#image').selectAreas('areas');
    ret.status = dataStatus
    $.each(final_areas, function(id, area) {
        obj = {
            'bbox': {
                'xmin': area.x * zoom,
                'ymin': area.y * zoom,
                'xmax': area.x * zoom + area.width * zoom,
                'ymax': area.y * zoom + area.height * zoom
            },
            'label': area.label,
            'attribute': area.attribute
        }
        objectsInfo.push(obj)
    });

    ret.image.caption = getImageInfo().caption
    ret.image.label.category = getImageInfo().category
    ret.image.label.scene = getImageInfo().scene
    ret.image.label.aesthetic = getImageInfo().aesthetic
    ret.image.label.affection = getImageInfo().affection
    ret.objects = objectsInfo

    return ret
}



function updateStatus() {
    if (dataStatus == 'checked') {
        setStatusLabel('primary', '已完成');
    } else if (dataStatus == 'to_check') {
        setStatusLabel('danger', '待確認');
    } else if (dataStatus == 'garbage') {
        setStatusLabel('danger', '垃圾');
    } else {
        checkStatus()
    }
}

function checkStatus() {

    if ($('#object_list > option').length != 0) {
        dataStatus = 'labeled'
        setStatusLabel('success', '已標記：' + $('#object_list > option').length + '個物件')
    } else {
        dataStatus = 'new'
        setStatusLabel('warning', '未標記')
    }
}


function getDataStatus() {
    return dataStatus
}

function setDataStatus(status) {
    dataStatus = status
}


////////////


function loadImage(data, image_url) {

    targetW = $('#image-panel').width();

    $('#image').selectAreas('destroy');
    $('#image').attr('src', image_url);

    zoom = data.image.size.width / (targetW)
    areas = loadBox(data.objects)
    $('#image').selectAreas({
        minSize: [5, 5],
        onChanged: displayBox,
        width: targetW,
        areas: areas
    });
}



/*========== Data operations ==========*/

function quickButton(name) {
    $('#object_label').val(name + ",");
    updateObjectList()
}


// Function of getting data info
function getDataInfo() {
    return {
        'name': $('#data_name').val(),
        'index': $('#data_index').val(),
        'status': $('#data_status').val()
    }
}


/*========== Image operations ==========*/

// Function of setting image's data
function setImageInfo(imageInfo) {
    $('#image_category').val(imageInfo.label.category);
    $('#image_scene').val(imageInfo.label.scene);
    $('#image_aesthetic').val(imageInfo.label.aesthetic);
    $('#image_affection').val(imageInfo.label.affection);
    $('#image_caption').val(imageInfo.caption);
}

function resetImageInfo(imageInfo) {
    $('#image_category').val('');
    $('#image_scene').val('');
    $('#image_aesthetic').val('');
    $('#image_affection').val('');
    $('#image_caption').val('');
}
// Function of getting image's data
function getImageInfo() {
    return {
        'category': $('#image_category').val(),
        'scene': $('#image_scene').val(),
        'aesthetic': $('#image_aesthetic').val(),
        'affection': $('#image_affection').val(),
        'caption': $('#image_caption').val()
    }
}


/*========== Object list operations ==========*/

// Function of clearing object list
function clearObjectList() {
    $('#object_list').empty();
}
// Function of appending object to object list
function appendObjectList(index, object) {
    c = color[index % color.length]
    text = (typeof index === 'undefined' ? '' : (index)) + ' | ' + object.label + ' | ' + object.attribute

    $('#object_list').append(
        $('<option></option>').attr('value', index).css('color', c).text(text));
}
// Function of load objects to object list
function loadObjectList(objects) {
    keys = Object.keys(objects);
    for (i = 0; i < keys.length; ++i)
        appendObjectList(i, objects[i])
}
// Function of updating object list
function updateObjectList() {
    setBoxInfo(getObjectInfo().label, getObjectInfo().attribute);
    if ((checkObjectList() || $('#image_affection').val() != '') && getDataInfo().status == 'New') {
        setDataStatus('Labeled', 'update')
    }
    if ((checkObjectList() == false && $('#image_affection').val() == '') && getDataInfo().status == 'Labeled') {
        setDataStatus('New', 'update')
    }
    clearObjectList();
    $.each($('#image').selectAreas('areas'), function(id, area) {
        appendObjectList(area.id, area);
        if (area.z == 100) setFocusObject(area.id)
    });
}
// Function of checking object list is not empty
function checkObjectList() {
    if ($('#object_list > option').length > 0) return true;
    else return false;
}






/*========== Object operations ==========*/

// Function of setting object's label, attribute and caption
function setObjectInfo(objectInfo) {
    if (objectInfo != '') {
        $('#object_label').val(objectInfo.label)
        $('#object_attribute').val(objectInfo.attribute)
    }
    // Set label, attribute and caption to ''
    else {
        $('#object_label').val('')
        $('#object_attribute').val('')
    }
}
// Function of getting object's label, attribute and caption
function getObjectInfo() {
    return {
        'label': $('#object_label').val(),
        'attribute': $('#object_attribute').val()
    }
}
// Function of going to next object
function goToNextObject() {
    if ($('#object_list option:selected').next().val())
        setFocusObject($('#object_list option:selected').next().val())
}
// Function of going to prev object
function goToPrevObject() {
    if ($('#object_list option:selected').prev().val())
        setFocusObject($('#object_list option:selected').prev().val())
}
// Function of going to specified object
function goToObject(index) {
    setFocusObject(index);
}
// Function of deleting object
function deleteObject() {
    deleteBox(getFocusObject())
    if (!checkObjectList()) setDataStatus('New', 'update')
}
// Function of setting focus to object
function setFocusObject(index) {
    $('#object_list').val(index);
    setFocusBox(index);
}
// Function of getting focus to object
function getFocusObject() {
    return $('#object_list').val();
}



/*========== Box operations ==========*/

// Function of setting focus boundingbox
function setFocusBox(index) {
    $('#image').selectAreas('blurAll');
    $('#image').selectAreas('focus', index);
    $.each($('#image').selectAreas('areas'), function(id, box) {
        if (box.z == 100) setObjectInfo(box);
    });
}

// Function of delete box
function deleteBox(index) {
    $('#image').selectAreas('remove', index);
}

// Function of set box info
function setBoxInfo(label, attribute) {
    $('#image').selectAreas('setInfo', getFocusObject(), label, attribute, '')
}

// Function of load box
function loadBox(objects) {
    keys = Object.keys(objects);
    boxes = []
    for (i = 0; i < keys.length; ++i) {
        var box = {
            x: (parseFloat(objects[i].bbox.xmin) / zoom),
            y: (parseFloat(objects[i].bbox.ymin) / zoom),
            width: (parseFloat(objects[i].bbox.xmax - objects[i].bbox.xmin) / zoom),
            height: (parseFloat(objects[i].bbox.ymax - objects[i].bbox.ymin) / zoom),
            label: objects[i].label,
            attribute: objects[i].attribute,
            caption: '',
            color: color[i % color.length]
        };
        boxes = boxes.concat(box)
    }
    return boxes
}

// Function of reset box
function resetBox() {
    $('#image').selectAreas('reset');
}

// Function fo display box
function displayBox(event, id, boxes) {
    clearObjectList();
    $.each(boxes, function(id, box) {
        appendObjectList(box.id, box);
        if (box.z == 100) {
            $('#object_list').val(box.id);
            setObjectInfo(box);
        }
        $('#image').selectAreas('setColor', box.id, color[box.id % color.length])
    });

};



function loadConfig(){
    
    $.ajax({
        url: BACKEND + '/configs/clothes',
        async: false
    }).then(function(data) {
        
        imageCategories = data.image_categories;
        imageAesthetics = data.image_aesthetics;
        imageAffections = data.image_affections;
        imageScenes = data.image_scenes;
        objectLabels = data.object_labels
        objectAttributes = data.object_attributes
    })
}


// Event of text change
function initialTextChangeEvent() {
    $('#object_list').on('change', function() {
        setFocusBox(getFocusObject());
    });
    $('#object_label').on('input', function() {
        updateObjectList();
    });
    $('#object_attribute').on('input', function() {
        updateObjectList();
    });
}


function initialAutoComplete(){
    loadConfig()
    $('#image_category')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(imageCategories, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render;

    $('#image_affection')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(imageAffections, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render;

    $('#image_aesthetic')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(imageAesthetics, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render;

    $('#image_scene')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(imageScenes, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render;



    $('#object_attribute')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(objectAttributes, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus ,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render 


    $('#object_label')
    // don't navigate away from the field on tab when selecting an item
    .bind( 'keydown', autocomplete_event)
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(objectLabels, extractLast( request.term ) ) );
        },
        focus: autocomplete_focus,
        select: autocomplete_select 
    })
    .autocomplete( 'instance' )._renderItem = autocomplete_render;



    function split( val ) {
        return val.split( /,\s*/ );
    }
    function extractLast( term ) {
        return split( term ).pop();
    }

    function autocomplete_render(ul, item){
        return $( '<li>' )
        .append( '<a>' + item.category + ' | ' +item.label + ' | ' + item.desc + '</a>' )
        .appendTo( ul );
    }
    function autocomplete_event(event){

        if ( event.keyCode === $.ui.keyCode.TAB && 
            $( this ).autocomplete( 'instance' ).menu.active ) {
            event.preventDefault();
        }   
    }
    function autocomplete_focus(){
        return false; // prevent value inserted on focus
    }
    function autocomplete_select(event, ui){
        var terms = split( this.value );
        terms.pop();  // remove the current input
        terms.push( ui.item.label );  // add the selected item
        terms.push( '' ); // add placeholder to get the comma-and-space at the end
        this.value = terms.join( ', ' );
        updateObjectList()
        return false;
    }
}
