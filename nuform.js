
function nuBuildForm(f){

	window.nuFORM[0]	= f;
	
	if(f.form_id == ''){
		nuLogin();
		return;
	}

	window.nuSESSION		= f.session_id;
	window.nuFIELD		= [];
	window.nuSUBFORMROW	= [];
	
	$('body').html('');
	$('body').removeClass('nuBrowseBody').removeClass('nuEditBody');
	
	if(f.record_id == ''){
		$('body').addClass('nuBrowseBody');
	}else{
		$('body').addClass('nuEditBody');
	}
	
	var b 						= window.nuBC.length-1;
	
	window.nuBC[b].form_id 		= f.form_id;
	window.nuBC[b].record_id 		= f.record_id;
	window.nuBC[b].session_id 		= f.session_id;
	window.nuBC[b].title 			= f.title;
	window.nuBC[b].row_height		= f.row_height;
	window.nuBC[b].rows 			= f.rows;
	window.nuBC[b].browse_columns	= f.browse_columns;
	window.nuBC[b].browse_rows		= f.browse_rows;
	window.nuBC[b].pages			= f.pages;
	
	nuResizeiFrame(f.dimensions, f.record_id);

	nuAddHolder('nuActionHolder');
	nuAddHolder('nuBreadcrumbHolder');
	
	if(f.record_id == ''){
	}else{
		nuAddHolder('nuTabHolder');
		nuAddHolder('nuFormsHolder');
		nuAddHolder('nuFormHolder');
	}
	
	nuAddBreadcrumbs();
	nuAddEditTabs('', f);
	nuAddActionButtons(f);

	nuMainRecordProperties(f);
	nuBuildEditObjects(f, '', '', f);
	
	nuGetStartingTab();
	
}

function nuResizeiFrame(d, r){

	if(window.nuTYPE != 'lookup'){return;}

	if(r == ''){
		
		var h			= Number(d[0]);
		var w			= Number(d[1]);

		$('#nuDragDialog', window.parent.document).
		css({'height'		:	(h - 0) + 'px',
			'width' 		:	(w - 0) + 'px',
			'visibility' 	:	'visible'
		});

		$('#nuLookup', window.parent.document).
		css({'height'		:	(h - 40) + 'px',
			'width' 		:	(w - 10) + 'px'
		});
			
	}else{
		
		var h			= Number(d[2]);
		var w			= Number(d[3]);
		
		$('#nuDragDialog', window.parent.document).
		css({'height'		:	(h - 0) + 'px',
			'width' 		:	(w - 0) + 'px',
			'visibility' 	:	'visible'
		});

		$('#nuLookup', window.parent.document).
		css({'height'		:	(h - 40) + 'px',
			'width' 		:	(w - 10) + 'px'
		});
			
	}
}

function nuAddActionButtons(f){

	var b = f.buttons;
	
	if(f.record_id == ''){
	
		var v = window.nuBC[window.nuBC.length-1].search;

		$('#nuActionHolder').append("<input id='nuSearchField' type='text' class='nuSearch' onchange='nuSetSearch(this)' value='" + v + "'>&nbsp;");
		$('#nuActionHolder').append("<input id='nuSearchButton' type='button' class='nuButton' value='Search' onclick='nuSearchAction()'>&nbsp;");
		
	}

	for(var i = 0 ; i < b.length ; i++){
		
		$('#nuActionHolder').append("<input id='nu" + b[i][1] + "Button' type='button' class='nuButton' value='" + b[i][0] + "' onclick='nu" + b[i][1] + "Action()'>&nbsp;");
		
	}
	
	if(window.nuTYPE 	== 'browse'){
		
		$('#nuActionHolder').append("<img id='thelogo' src='logo.png' style='position:absolute;right:20px'>");
		
	}
	
}

function nuBuildEditObjects(f, p, o, prop){
	
	var l = 3;
	
	for(var i = 0 ; i < f.objects.length  ; i++){

		var t                       = prop.objects[i].type;
		f.objects[i].parent_type    = o.subform_type;

		if(t == 'input' || t == 'display' || t == 'lookup' || t == 'textarea'){
			
			l = l + nuINPUT(f, i, l, p, prop);
			
		}else if(t == 'run'){
			
			l = l + nuRUN(f, i, l, p, prop);
			
		}else if(t == 'html'){
			
			l = l + nuHTML(f, i, l, p, prop);
			
		}else if(t == 'select'){
			
			l = l + nuSELECT(f, i, l, p, prop);
			
		}else if(t == 'subform'){

			l = l + nuSUBFORM(f, i, l, p, prop);
			
		}
		
		l = l + 2;
		
	}
	
}

function nuMainRecordProperties(w){

	var pk    = 'nuPrimaryKey';
	var de    = 'nuDelete';
	var fh    = 'nuFormHolder';                       //-- Edit Form Id
	var inp   = document.createElement('input');
	var chk   = document.createElement('input');

	inp.setAttribute('id', pk);
	chk.setAttribute('id', de);
	chk.setAttribute('type', 'checkbox');
	
	$('#' + fh).append(inp)
	.append(chk)
	.addClass('nuSection')
	.attr('data-nu-edit-form-id', w.id)
	.attr('data-nu-parent', '');

	$('#' + pk).css({'visibility' : 'hidden'})
	.val(w.record_id)
	.attr('data-nu-form', '');
	
	$('#' + de).css('visibility', 'hidden')
	.prop('checked', w.record_id == -1)
	.attr('data-nu-form', '');

}


function nuSubformRecordProperties(w, l, p){

	var pk    = p + 'nuPrimaryKey';
	var de    = p + 'nuDelete';
	var fh    = p + 'nuFormHolder';                       //-- Edit Form Id
	var inp   = document.createElement('input');
	var chk   = document.createElement('input');

	inp.setAttribute('id', pk);
	chk.setAttribute('id', de);
	chk.setAttribute('type', 'checkbox');
	$('#' + fh)
	.append(inp)
	.append(chk)
	.addClass('nuSection')
	.attr('data-nu-edit-form-id', w.id)
	.attr('data-nu-parent', p)
	.attr('data-nu-form', p);
	
	$('#' + pk).css({'visibility' : 'hidden'})
	.val(w.record_id)
	.attr('data-nu-form', p);
	
	$('#' + de).css({'top'		: 3, 
					'left'		: Number(l) + 3, 
					'position' 	: 'absolute', 
					'visibility'	: 'visible'})
	.prop('checked', w.record_id == -1)
	.attr('data-nu-form', p);

}

function nuINPUT(w, i, l, p, prop){
	
	var id   = p + prop.objects[i].id;
	var ef   = p + 'nuFormHolder';                       //-- Edit Form Id
	var ty	= 'textarea';
	
	if(prop.objects[i].type != 'textarea'){         		//-- Input Object
		
		ty	= 'input';
	}

	var inp  = document.createElement(ty);
	inp.setAttribute('id', id);
	
	if(prop.objects[i].parent_type == 'g'){        		//--  in a grid subform
		
		prop.objects[i].left = l;
		prop.objects[i].top = 3;
		
	}else{
		
		nuLabel(w, i, p, prop);
		
	}

	$('#' + ef).append(inp);
	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'       	: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'height'		: Number(prop.objects[i].height),
					'text-align'	: prop.objects[i].align,
					'position'	: 'absolute'
	})
	.val(w.objects[i].value)
	.attr('data-nu-field', prop.objects[i].id)
	.attr('data-nu-object-id', w.objects[i].object_id)
	.attr('data-nu-prefix', p);
	window.nuFIELD[id]	= w.objects[i].value;


	if(prop.objects[i].type == 'display'){
		
		$('#' + id).addClass('nuReadonly');
		$('#' + id).prop('readonly', true);
	
	}

	if(prop.objects[i].type == 'lookup'){
		
		$('#' + id).hide();
		
		window.nuFIELD[id]	= w.objects[i].values[0][1];
		$('#' + id).val(w.objects[i].values[0][1]);

		var target			= id;
		id					= target + 'code';
		var inp				= document.createElement('input');
		
		inp.setAttribute('id', id);
		
		$('#' + ef).append(inp);
		nuAddDataTab(id, prop.objects[i].tab, p);
		$('#' + id).css({'top'	: Number(prop.objects[i].top),
		    			'left'		: Number(prop.objects[i].left),
			    		'width'		: Number(prop.objects[i].width),
					'height'		: Number(prop.objects[i].height)
		})
		.attr('data-nu-form-id', w.objects[i].form_id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-target', target)
		.attr('onkeyup', 'nuLookupKeyUp(event)')
		.attr('onkeydown', 'nuLookupKeyDown(event)')
		.attr('onblur', 'nuLookupBlur(event)')
		.attr('onfocus', 'nuLookupFocus(event)')

		.addClass('nuLookupCode');

		id 			= target + 'button';
		var inp 		= document.createElement('div');
		
		inp.setAttribute('id', id);
		
		$('#' + ef).append(inp);
		nuAddDataTab(id, prop.objects[i].tab, p);
		$('#' + id).css({'top'      	: Number(prop.objects[i].top),
						'left'      	: Number(prop.objects[i].left) + Number(prop.objects[i].width) + 2,
						'width'		: 15,
						'height'		: Number(prop.objects[i].height)
		})
		.attr('type','button')
		.attr('data-nu-form-id', w.objects[i].form_id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-target', target)
		.addClass('nuLookupButton')
		.html('<img border="0" src="lookup.png" width="10" height="10">')
		.attr('onclick', 'nuBuildLookup(this,[])');

		id = p + prop.objects[i].id + 'description';
		var inp = document.createElement('input');
		inp.setAttribute('id', id);
		
		$('#' + ef).append(inp);
		nuAddDataTab(id, prop.objects[i].tab, p);
		$('#' + id).css({'top'		: Number(prop.objects[i].top),
						'left'		: Number(prop.objects[i].left) + Number(prop.objects[i].width) + 21,
						'width'		: prop.objects[i].description_width,
						'height'		: Number(prop.objects[i].height)
		})
		.attr('tabindex','-1')
		.addClass('nuLookupDescription')
		.addClass('nuReadonly')
		.prop('readonly', true);
		
		w.objects[i].values[0][0]	= p + w.objects[i].values[0][0];
		w.objects[i].values[1][0]	= p + w.objects[i].values[1][0];
		w.objects[i].values[2][0]	= p + w.objects[i].values[2][0];
		
		nuPopulateLookup3(w.objects[i].values);

		return Number(prop.objects[i].width) + Number(prop.objects[i].description_width) + 30;
		
	}else{
		
		return Number(prop.objects[i].width);
		
	}
	
}

function nuHTML(w, i, l, p, prop){

	var id  = p + prop.objects[i].id;
	var ef  = p + 'nuFormHolder';                       //-- Edit Form Id
	var inp = document.createElement('div');
	
	inp.setAttribute('id', id);
	
	if(prop.objects[i].parent_type == 'g'){
		
		prop.objects[i].left = l;
		prop.objects[i].top = 3;
		
	}else{
		
		nuLabel(w, i, p, prop);
		
	}
	
	$('#' + ef).append(inp);
	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'     : Number(prop.objects[i].top),
					'left'     : Number(prop.objects[i].left),
					'width'    : Number(prop.objects[i].width),
					'height'   : Number(prop.objects[i].height),
					'position' : 'absolute'
	})
	.html(w.objects[i].html);
	
	return Number(prop.objects[i].width);

}

function nuRUN(w, i, l, p, prop){

	var id  = p + prop.objects[i].id;
	var ef  = p + 'nuFormHolder';                       //-- Edit Form Id
	var ele = 'input';
	
	if(prop.objects[i].parent_type == 'g'){
		
		prop.objects[i].left = l;
		prop.objects[i].top = 3;
		
	}
	
	if(prop.objects[i].run_method != 'b'){
		
		ele = 'iframe';
		
	}

	if(!prop.objects[i].parent_type == 'g' && prop.objects[i].run_method != 'b'){
		
		nuLabel(w, i, p, prop);
		
	}

	var inp = document.createElement(ele);
	
	inp.setAttribute('id', id);
	
	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'     	: Number(prop.objects[i].top),
					'left'     	: Number(prop.objects[i].left),
					'width'    	: Number(prop.objects[i].width),
					'height'   	: Number(prop.objects[i].height),
					'position' 	: 'absolute'
	})
	.attr('data-nu-index', i);

	if(prop.objects[i].run_method == 'b'){
	
		$('#' + id).attr({
					'type'		: 'button',
					'value'		: prop.objects[i].label,
					'onclick'	: "nuGetForm('" + prop.objects[i].form_id + "','" + prop.objects[i].record_id + "')"
		}).addClass('nuButton');

		
	}else{
	    
		$('#' + id).attr({'src':prop.objects[i].src})
		$('#' + id).attr({'src':'http://forums.nubuilder.com/index.php'})


	}
	
	return Number(prop.objects[i].width);
	
}

function nuSELECT(w, i, l, p, prop){

	var id  = p + prop.objects[i].id;
	var ef  = p + 'nuFormHolder';                       //-- Edit Form Id
	
	if(prop.objects[i].parent_type == 'g'){
		
		prop.objects[i].left = l;
		prop.objects[i].top = 3;
		
	}else{
		
		nuLabel(w, i, p, prop);
		
	}

	var sel = document.createElement('select');
	
	sel.setAttribute('id', id);

	$('#' + ef).append(sel);
	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'     : Number(prop.objects[i].top),
					'left'     : Number(prop.objects[i].left),
					'width'    : Number(prop.objects[i].width),
					'position' : 'absolute'
	})
	.attr('data-nu-index', i)
	.attr('data-nu-field', prop.objects[i].id)
	.attr('data-nu-object-id', w.objects[i].object_id)
	.attr('data-nu-prefix', p);

	window.nuFIELD[id]	= w.objects[i].value;

	if(prop.objects[i].multiple == 1){
	    
		$('#' + id).attr('multiple', 'multiple');
		$('#' + id).css('height', Number(prop.objects[i].height));
    	
	}
	
	var values = String(w.objects[i].value).split('#nuSep#');

	for(var n = 0 ; n < prop.objects[i].options.length ; n++){

		if(values.indexOf(prop.objects[i].options[n][0]) == -1){
		    $('#' + id).append('<option  value="'+prop.objects[i].options[n][0]+'">'+prop.objects[i].options[n][1]+'</option>');
		}else{
		    $('#' + id).append('<option selected="selected "value="'+prop.objects[i].options[n][0]+'">'+prop.objects[i].options[n][1]+'</option>');
		}
		
	}

	return Number(prop.objects[i].width);
	
}

function nuSUBFORM(w, i, l, p, prop){

    var SF  = prop.objects[i];							//-- first row
    var SFR = w.objects[i];							//-- all rows
	var id  = p + SF.id;
	var ef  = p + 'nuFormHolder';                       //-- Edit Form Id
	var inp = document.createElement('div');
	var fms = SFR.forms;

	inp.setAttribute('id', id);
	
	if(SF.parent_type == 'g'){
		
		SF.left = l;
		SF.top = 3;
		
	}else{
		
		nuLabel(w, i, p, prop);
		
	}

	$('#' + ef).append(inp);
	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'         : Number(SF.top),
					'left'       	: Number(SF.left),
					'width'      	: Number(SF.width),
					'height'		: Number(SF.height) + 2,
					'overflow-x'	: 'hidden',
					'overflow-y'	: 'h)idden'
	})
	.attr('data-nu-index', i)
	.attr('data-nu-subform', 'true')
	.addClass('nuSubform');

	nuGetSubformRowSize(SF.forms[0].objects, SF, id);

	if(SF.subform_type == 'f'){
		var rowHeight   	= Number(SF.dimensions[4]);
		var rowWidth    	= Number(SF.dimensions[5]);
	}else{
		var rowHeight   	= Number(SF.dimensions[6]);
		var rowWidth    	= Number(SF.dimensions[7]);
	}
	

    if(SF.delete == '1'){
		
        nuBuildSubformDeleteTitle(rowWidth - 40, id);
        rowWidth 			= rowWidth - 3;
		
    }else{
		
        rowWidth 			= rowWidth;
		
    }

	var rowTop      = 50;

	if(SF.subform_type == 'f'){
        
		var tabId  = id + 'nuTabHolder';
		var tabDiv = document.createElement('div');
		tabDiv.setAttribute('id', tabId);
		$('#' + id).append(tabDiv);
		$('#' + tabId).css({'top'      : 0,
						'left'       	: 0,
						'width'      	: rowWidth - 45,
						'height'     	: 23,
						'overflow-x'	: 'hidden',
						'overflow-y'	: 'hidden',
						'position'	: 'absolute',
						'padding'	: '29px 0px 0px 0px'
		}).addClass('nuTabHolder');

		nuAddEditTabs(id, SF.forms[0]);
		
    }

	
    var scrId		= id + 'scrollDiv';
	var scrDiv	= document.createElement('div');
	scrDiv.setAttribute('id', scrId);
	$('#' + id).append(scrDiv);
	$('#' + scrId).css({'top'       	: rowTop,
					'left'        	: 0,
					'width'       	: Number(rowWidth) + 1,
					'height'      	: Number(SF.height) - rowTop + 1,
					'border-width'	: 1,
					'border-style'	: 'none solid solid solid',
					'border-color'	: '#B0B0B0',
					'overflow-x'  	: 'hidden',
					'overflow-y'  	: 'scroll',
					'position'		: 'absolute'
	});

	if(rowWidth > Number(SF.width)){
		
			$('#' + id).css('overflow-x', 'scroll');
			$('#' + scrId).css('height', SF.height - rowTop - 25);
			
	}
	
	rowTop 	= 0;
	var even	= 0;

	for(var c = 0 ; c < fms.length ; c++){

		var prefix = id + nuPad3(c);
		var frmId  = prefix + 'nuFormHolder';
		var frmDiv = document.createElement('div');
		frmDiv.setAttribute('id', frmId);
		$('#' + scrId).append(frmDiv);
		$('#' + frmId).css({'top'       : Number(rowTop),
						'left'          : 0,
						'width'         : Number(rowWidth),
						'height'        : Number(rowHeight),
						'position'      : 'absolute'
		})
		.attr('onkeydown', 'nuAddSubformRow(this, event)')
		.addClass('nuSubform' + even);

		nuBuildEditObjects(SFR.forms[c], prefix, SF, SF.forms[0]);

		nuSubformRecordProperties(SF.forms[c], rowWidth - 40, prefix);

		rowTop 	= Number(rowTop) + Number(rowHeight);
		even		= even == '0' ? '1' : '0'

	}
	
	if(SF.add == 1){
		nuNewRowObject(String(prefix));
	}
	
	return Number(SF.width);

}

function nuNewRowObject(p){

	var o	= $('#' + p + 'nuFormHolder');
	var sf	= p.substr(0, p.length - 3);
	var h	= String(o[o.length-1].outerHTML);
	window.nuSUBFORMROW[sf]	= h.replaceAll(p, '#nuSubformRowNumber#', true);

}

function nuAddSubformRow(t, e){
	
	e.stopPropagation();
	var sf	= t.id.substr(0, t.id.length-15);
	
	if(window.nuSUBFORMROW[sf] === undefined){
		nuNewRowObject(sf + '000');
	}
	
	var o	= $('#' + t.id);
	var l	= o.parent().children().length;
	var r	= parseInt(t.id.substr(t.id.length-15, 3));

	var top	= parseInt(o.css('height')) * l;

	if(l-1 != r){return;}
	
	var h	= String(window.nuSUBFORMROW[sf]);
	var c	= l/2 == parseInt(l/2) ? '0' : '1';
	h		= h.replaceAll('#nuSubformRowNumber#', sf + nuPad3(l));
	h 		= h.replaceAll('"nuSubform0"', '"nuSubform1"', true);
	h 		= h.replaceAll('"nuSubform1"', '"nuSubform'+c+'"', true);
	
	o.parent().append(h);
	
	$('#' + sf + nuPad3(l) + 'nuFormHolder').css('top', top);
	$('#' + sf + nuPad3(l) + 'nuPrimaryKey').val('-1');
	$('#' + sf + nuPad3(l) + 'nuDelete').prop('checked', true);
	$('#' + sf + nuPad3(l-1) + 'nuDelete').prop('checked', false);
	
	var ps	= $('#' + t.id).parent().parent().parent().attr('data-nu-form');
	
	if($('#' + ps + 'nuDelete').length != 0){
		
		var ths	= document.getElementById(ps + 'nuFormHolder');
		
		nuAddSubformRow(ths, e);
		
	}
	
	$('.nuTabSelected').click();
	
}


function nuPad3(i){
	
	return String('00' + Number(i)).substr(-3);

}


function nuLabel(w, i, p, prop){

	if(prop.objects[i].label == ''){return;}
	
	var id     = 'label_' + p + prop.objects[i].id;
	var ef     = p + 'nuFormHolder';                       //-- Edit Form Id
	var lab    = document.createElement('label');
	var lwidth = nuGetWordWidth(prop.objects[i].label);
	
	lab.setAttribute('id', id);
	lab.setAttribute('for',  p + prop.objects[i].id);
	
	$('#' + ef).append(lab);
	nuAddDataTab(id, prop.objects[i].tab, p);
	$('#' + id).css({'top'            : Number(prop.objects[i].top),
		              'left'          : Number(prop.objects[i].left) - lwidth - 7,
		              'width'         : Number(lwidth)
	})
	.html(prop.objects[i].label);

}

function nuPopulateLookup3(v){
	
		for(var i = 0 ; i < v.length ; i++){
			$('#' + v[i][0]).val(v[i][1]);
		}
		
}

function nuAddHolder(t){

	var d = document.createElement('div');
	d.setAttribute('id', t);
	$('body').append(d);
	$('#' + t).addClass(t).html('&nbsp;&nbsp;&nbsp;');
	
}

function nuGetWordWidth(w){
	
	var h = "<div id='nuTestWidth' style='position:absolute;visible:hidden;width:auto'>" + w + "</div>";
	$('body').append(h);
	var l = parseInt($('#nuTestWidth').css('width'));
	$('#nuTestWidth').remove();
	
	return l + 5;
	
}	

function nuGetSubformRowSize(o, SF, id){

    var l = 0;
    var w = 0;

    for(var i = 0 ; i < o.length ; i++){

        var d = Number(o[i].description_width);
        var T = SF.subform_type 		== 'g'      ? 0     : Number(o[i].top);
        var B = o[i].type          		== 'lookup' ? 30    : 0;                    //-- lookup button
        var D = o[i].type          		== 'lookup' ? d     : 0;                    //-- lookup description
        
        w = 2 + Number(o[i].width) + B + D;
        
        
        if(SF.subform_type == 'g'){                                             //-- grid
            
            nuBuildSubformTitle(o[i], l, w, id);
            l = l + w;
            
        }
        
    }

}

function nuBuildSubformTitle(o, l, w, id){
    
	var titleId  = id + o.id;
    	var div = document.createElement('div');
    	div.setAttribute('id', titleId);
    	$('#' + id).append(div);
    	
    	$('#' + titleId).css({'top'     	: 0,
    					'left'          	: Number(l),
    					'width'         	: Number(w),
    					'height'        	: 50,
    					'text-align'    	: 'center',
    					'position'      	: 'absolute'
    	})
	.html(o.label)
	.addClass('nuTabHolder');

}

function nuBuildSubformDeleteTitle(l, id){
    
	var titleId  = id + 'DeleteSF';
    	var div = document.createElement('div');
    	div.setAttribute('id', titleId);
    	$('#' + id).append(div);
    	
    	$('#' + titleId).css({'top'     	: 0,
    					'left'          	: Number(l)-10,
    					'width'         	: 50,
    					'height'        	: 50,
    					'text-align'    	: 'center',
    					'font-size'     	: 10,
    					'padding'     	: 0,
    					'position'      	: 'absolute'
    	}).html('<br>Delete')
	.addClass('nuTabHolder');

}

function nuAddBreadcrumbs(){

	var b 							= window.nuBC.length;
	
    for(var i = 0 ; i < b ; i++){
        
		nuAddBreadcrumb(i, b);

    }
    
}

function nuAddEditTabs(p, w){

	nuSetStartingTab(p);
	
    for(var i = 0 ; i < w.tabs.length ; i++){
        
        nuEditTab(p, w.tabs[i], i);

    }
	
	var l = 13;
	
    for(var i = 0 ; i < w.browse_columns.length ; i++){
        
        l = nuBrowseTitle(w.browse_columns[i], i, l);

    }
	
	if(w.browse_columns.length > 0){
		nuBrowseTable();
	}
    
}

function nuSetStartingTab(p){

	var t = window.nuBC[window.nuBC.length - 1].tab_start;
	
	for(var i = 0 ; i < t.length ; i++){
		
		if(t[i].prefix == p){return;}
		
	}
	
	t.push(new nuStartingTab(p));
	
}

function nuGetStartingTab(){

	var t = window.nuBC[window.nuBC.length - 1].tab_start;
	
	for(var i = 0 ; i < t.length ; i++){
		
		$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).addClass('nuTabSelected');
		$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).click();
		
	}
	
}

function nuStartingTab(p){

		this.prefix 		= p;
		this.tabNumber 	= 0;
		
}

function nuAddBreadcrumb(i, l){

	var last = (i + 1 == l);                  //-- last breadcrumb
	var bc 	= window.nuBC[i];
	var bcId = 'nuBC' + i;
	
	var div    = document.createElement('div');
	div.setAttribute('id', bcId);

	$('#' + 'nuBreadcrumbHolder').append(div);
	
	if(last){
		
		$('#' + bcId)
		.addClass('nuNotBreadcrumb')
		.html(bc.title);
		
	}else{
		
		$('#' + bcId)
		.attr('onclick', 'nuGetBreadcrumb(' + i + ')')
		.addClass('nuBreadcrumb')
		.html(bc.title + '<div id="nuarrow'+i+'" class="nuBreadcrumbArrow">&nbsp;&#x25BA;&nbsp;<div>');
		
	}
	
}

function nuEditTab(p, t, i){

    var tabId  = p + 'nuTab' + i;
	var div    = document.createElement('div');
	div.setAttribute('id', tabId);
	
	$('#' + p + 'nuTabHolder').append(div);
	$('#' + tabId
	).html(t.title
	).addClass('nuTab'
	).attr('data-nu-tab-filter', i
	).attr('data-nu-form-filter', p
	).attr('onclick','nuSelectTab(this)');
	

}

function nuSelectTab(tab){

    var n = String(tab.id).substr(5);
    var t = $('#' + tab.id).attr('data-nu-tab-filter');
    var f = $('#' + tab.id).attr('data-nu-form-filter');

    $("[data-nu-form='" + f + "']").hide();
    $("[data-nu-tab='"  + t + "'][data-nu-form='" + f + "']").show();

    $("[data-nu-form-filter='" + f + "']").removeClass('nuTabSelected');
    $("[data-nu-form-filter='" + f + "'][data-nu-tab-filter='"  + t + "']").show();

    $('#' + tab.id).addClass('nuTabSelected');

}

function nuAddDataTab(i, t, p){

    var P = String(p);
    var f = P.substr(0, P.length - 3);
    $('#' + i).attr('data-nu-tab', t).attr('data-nu-form', f);

}

function nuBrowseTitle(b, i, l){

	var un	= window.nuBC[window.nuBC.length-1].nosearch_columns.indexOf(i);
	var id  	= 'nuBrowseTitle' + i;
	var w 	= Number(b.width);
	var div  = document.createElement('div');
	div.setAttribute('id', id);

	var cb	= '<input id="nusearch_' + i + '" type="checkbox" class="nuSearchColumn" checked="checked" onclick="nuSetSearchColumn()">';
	var br	= '<br>';
	var sp	= '<span style="font-size:16px" id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"> ' + b.title + ' </span>'
	
	$('body').append(div);
	$('#' + id)
	.html(cb + br + sp)
	.addClass('nuBrowseTitle')
	.css({	'text-align'	: 'center',
			'overflow'	: 'hidden',
			'width'		: w,
			'left'		: l
	});
	
	$('#nusearch_' + i).attr('checked', un == -1);
	
	return l + w;
	
}

function nuBrowseTable(){

	var bc	= nuBC[nuBC.length-1];
	var col	= bc.browse_columns;
	var row	= bc.browse_rows;
	var rows	= bc.rows;
	var h	= bc.row_height;
	var t	= 145 - h;
	var l	= 13;
	
	for(r = 0 ; r < rows ; r++){
	
		l	= 13;
		t	= t + h;
		
		for(c = 0 ; c < col.length ; c++){
		
			var w	= Number(col[c].width);
			var a	= nuAlign(col[c].align);
			var rw	= 'nubrowse' + String('00' + r).substr(-3);
			var id	= rw + String('00' + c).substr(-3);
			var div  = document.createElement('div');
			div.setAttribute('id', id);
				
			$('body').append(div);
			$('#' + id)
			.attr('data-nu-row', rw)
			.addClass(w == 0 ? '' : 'nuBrowseTable')
			.css({	'text-align'	: a,
					'overflow'	: 'hidden',
					'width'		: w-7,
					'top'		: t,
					'left'		: l,
					'height'		: h-7
			});

			if(r < row.length){
				
				$('#' + id)
				.html(row[r][c+1])
				.attr('data-nu-primary-key', row[r][0])
				.attr('onclick', 'nuSelectBrowse(this)')
				.hover(
					function() {
						var rw = $( this ).attr('data-nu-row');
						$("[data-nu-row='"+rw+"']").addClass('nuSelectBrowse');
					}, function() {
						var rw = $( this ).attr('data-nu-row');
						$("[data-nu-row='"+rw+"']").removeClass('nuSelectBrowse');
					}
				);

			}
			
			l = l + w;

		}
		
	}
	
	var la	= '<span id="nuLast" onclick="nuGetPage(' + (bc.page_number) + ')" class="nuBrowsePage">&#9668;</span>';
	var pg	= '&nbsp;Page&nbsp;';
	var cu	= '<input id="browsePage" style="text-align:center;margin:3px 0px 0px 0px;width:40px" onchange="nuGetPage(this.value)" value="' + (bc.page_number + 1) + '" class="browsePage"/>';
	var of	= '&nbsp;/&nbsp;' + bc.pages + '&nbsp;';
	var ne	= '<span id="nuNext" onclick="nuGetPage(' + (bc.page_number + 2) + ')" class="nuBrowsePage">&#9658;</span>';
	
	var id	= 'nuBrowseFooter';
	var div  = document.createElement('div');
	div.setAttribute('id', id);
		
	$('body').append(div);
	$('#' + id)
	.addClass('nuBrowseTitle')
	.html(la+pg+cu+of+ne)
	.css({	'text-align'	: 'center',
			'width'		: l - 13,
			'top'		: t + h,
			'left'		: 13,
			'height'		: 25,
			'position'	: 'absolute'
	});
	
	nuHighlightSearch();

}

function nuAlign(a){

	if(a == 'l'){return 'left';}
	if(a == 'r'){return 'right';}
	if(a == 'c'){return 'center';}
	
}


function nuSetSearchColumn(){

	var nosearch = [];

	$('.nuSearchColumn').each(function( index ) {
		if(!$(this).is(':checked')) {nosearch.push(index);}
	});

	window.nuBC[window.nuBC.length-1].nosearch_columns = nosearch;
	
}

function nuSetSearch(t){
	
	window.nuBC[window.nuBC.length-1].search 		= String(t.value).replaceAll("'","&#39;", true);
	window.nuBC[window.nuBC.length-1].page_number	= 0;
	
}

function nuSearchAction(){

	nuGetBreadcrumb(nuBC.length - 1);
	
}


function nuAddAction(){

	var bc	= nuBC[nuBC.length - 1];
	nuGetForm(bc.form_id, '-1');
	
}

function nuSortBrowse(c){
	
	var l	= nuBC.length - 1;
	var B 	= nuBC[l];
	
	if(c == B.sort){
		nuBC[l].sort_direction 	= (B.sort_direction == 'asc' ? 'desc' : 'asc');
	}else{
		nuBC[l].sort 				= c;
		nuBC[l].sort_direction	= 'asc';
	}
	
	nuSearchAction();
	
}

function nuGetPage(p){

	var P = parseInt('00' + p);
	var B = nuBC[nuBC.length - 1];
	
	if(P == 0){P = 1;}
	if(P > B.pages){P = B.pages;}
	
	nuBC[nuBC.length - 1]. page_number = P - 1;
	
	nuSearchAction();
	
	
}

function nuSelectBrowse(t){

	var y 	= window.nuTYPE;
	var i 	= window.nuTARGET;
	var p	= $('#' + t.id).attr('data-nu-primary-key');
	var f	= nuBC[nuBC.length - 1].form_id;
	
	if(y == 'browse'){
		
		nuGetForm(f, p);
		
	}else if(y == 'lookup'){

		window.parent.nuGetLookupId(p, i);			//-- called from parent window
		
	}else{
		window[y](t);
	}
	
}


function nuPopulateLookup(fm, target){

	var p 	= $('#' + target).attr('data-nu-prefix');
	var f	= fm.lookup_values;
	
	for(var i = 0 ; i < f.length ; i++){
		$('#' + p + f[i][0]).val(f[i][1]);
	}
	
	$('#dialogClose').click();

}

function nuBuildLookupList(fm, e){

	var i	= fm.target;
	$('#nuLookupList').remove();
	
	var v	= fm.lookup_values;
	var tar	= $('#' + i);
	var off	= $('#' + i).offset();
	var p	= $('#' + i).parent().attr('id')
	var d	= parseInt($('#' + i + 'description').css('width'));
	var t	= off.top;//parseInt(tar.css('top'));
	var l	= off.left; //parseInt(tar.css('left'));
	var h	= parseInt(tar.css('height'));
	var w	= parseInt(tar.css('width'));
	var div 	= document.createElement('div');
	div.setAttribute('id', 'nuLookupList');

//	$('#' +p).append(div);
	$('body').append(div);
	
	$('#nuLookupList').css({'top'		: t + h + 2,
						'left'       	: l,
						'width'      	: w + d + 20,
						'height'     	: Math.min(h * v.length, h * 4),
						'overflow-y'	: 'scroll',
						'position'	: 'absolute',
						'z-index'	: 1000
	})
	.addClass('nuLookupListContainer')
	.html(nuLookupListItems(fm, h, w, d));
	
	$('.nuLookupList').hover(
		function() {
			$('.nuLookupListSelect').removeClass('nuLookupListSelect');
			$( this ).addClass('nuLookupListSelect');
		}, function() {
			$( this ).removeClass('nuLookupListSelect');
		}
	);
	
}

function nuLookupListItems(fm, h, w, d){
	
	var v	= fm.lookup_values;
	var ht	= '';
	var srch	= $('#' + fm.target + 'code').val();
	var repl	= '<span class="nuLookupListMatch">' + srch + '</span>';

	for(var i = 0 ; i < v.length ; i++){
		ht 	+= '<div ';
		ht 	+= 'id="nuLookupList' + i + '" ';
		ht 	+= 'class="nuLookupList" ';
		ht 	+= 'data-nu-target="' 	+ fm.target + '" ';
		ht 	+= 'data-nu-down="'	 	+ (i == v.length - 1 	? 0 				: i+1) + '" ';
		ht 	+= 'data-nu-up="' 		+ (i == 0 			? v.length-1 		: i-1) + '" ';
		ht 	+= 'data-nu-id="' 		+ v[i][0] + '" ';
		ht 	+= 'data-nu-code="' 		+ v[i][1] + '" ';
		ht 	+= 'data-nu-description="' + v[i][2] + '" ';
		ht 	+= 'onclick="nuSelectLookupList(this)" ';
		ht 	+= 'class="nuLookupList" ';
		ht 	+= 'style="width:' + (w + d + 3) + 'px;height:' + h + 'px">';
		ht 	+= '<div style="width:' + (w + 20) + 'px;display:inline-block">' + String(v[i][1]).replace(srch, repl, true) + '</div>';
		ht 	+= v[i][2];
		ht 	+= '<input id="nuListFocus' + i + '" class="nuLookupList" style="width:0px;display:inline-block;visibility:hidden"/>';
		ht 	+= '</div>';
	}

	return ht;
}

function nuSelectLookupList(t){
	
	var p = $('#' + t.id).attr('data-nu-id');
	var i = $('#' + t.id).attr('data-nu-target');

	nuGetLookupId(p, i);
	
}

function nuLookupKeyDown(e){

	var c	= e.target.id;
	var i	= c.substr(0, c.length - 4);
	var d	= i + 'description';
	var next	= '';
	
	if(e.keyCode == 40 || e.keyCode == 38){
	
		if($('#nuLookupList').length == 0){return;}
		
		if(e.keyCode == 40){
			if($('.nuLookupListSelect').length == 0){
				next	= 0;
			}else{
				next	= $('.nuLookupListSelect').attr('data-nu-down');
			}
		}
		if(e.keyCode == 38){
			if($('.nuLookupListSelect').length == 0){
				next	= $('.nuLookupList').length - 1;
			}else{
				next	= $('.nuLookupListSelect').attr('data-nu-up');
			}
		}
		
		window.nuChangeLookup = false;
		$('.nuLookupListSelect').removeClass('nuLookupListSelect');
		$('#nuLookupList' + next).addClass('nuLookupListSelect');
		$('#nuListFocus' + next)
		.css('visibility', 'visible')
		.focus()
		.css('visibility', 'hidden');
		$('#' + d).val($('#nuLookupList' + next).attr('data-nu-description'));
		$('#' + i).val($('#nuLookupList' + next).attr('data-nu-id'));
		$('#' + c).val($('#nuLookupList' + next).attr('data-nu-code'))
		.focus();
		window.nuChangeLookup = true;
	
	}else if(e.keyCode == 13){									//-- enter key

		if($('.nuLookupListSelect').length == 0){return;}		//-- nothing selected from Lookup List

		var l = new nuLookupObject(i);
		nuGetLookupId($('#' + i).val(), l.id_id);
		$('#nuLookupList').remove();

	}else if(e.keyCode == 9){									//-- tab key

		if(window.nuLookupWas != e.target.value && window.nuChangeLookup){
		
			if($('.nuLookupListSelect').length == 0){				//-- nothing selected from Lookup List
				nuGetLookupCode(e, false);
			}else{
				var l = new nuLookupObject(e.target.id);
				nuGetLookupId($('#' + l.id_id).val(), l.id_id);
				$('#nuLookupList').remove();
			}

		}
		
		window.nuChangeLookup	= false;
		
	}
	
}

function nuLookupBlur(e){

	if(window.nuLookupWas != e.target.value && window.nuChangeLookup){
	
		if($('.nuLookupListSelect').length == 0){				//-- nothing selected from Lookup List
			nuGetLookupCode(e, false);
		}else{
			var l = new nuLookupObject(e.target.id);
			nuGetLookupId($('#' + l.id_id).val(), l.id_id);
			$('#nuLookupList').remove();
		}

	}

}

function nuLookupKeyUp(e){
	
	var a = [7,9,13,37,38,39,40]; 	//-- arrows,tab,enter

	if(a.indexOf(e.keyCode) == -1){

		nuGetLookupCode(e, true);
		
	}

}

function nuLookupFocus(e){

	if(window.nuChangeLookup || window.nuChangeLookup === undefined){
		window.nuLookupWas	= e.target.value;
	}
	
	window.nuChangeLookup		= true;
	
}

function nuChooseOneLookupRecord(e, fm){
	
	var o	= new nuLookupObject(e.target.id);
	var i	= o.id_id;
	var t	= document.getElementById(e.target.id);

	if(fm.lookup_values.length	== 0){nuGetLookupId('', i);}
	if(fm.lookup_values.length	== 1){nuGetLookupId(fm.lookup_values[0][0], i);}
	if(fm.lookup_values.length	 > 1){nuBuildLookup(t,[['search',e.target.value]]);}

}

function nuLookupObject(id, set, value){

	if($('#' + id).length == 0){
		
		this.id_id				= '';
		this.code_id				= '';
		this.description_id		= '';
		this.id_value				= '';
		this.code_value			= '';
		this.description_value	= '';
		console.log('No such field as ' + id);
		return;
		
	}
	
	var i					= nuValidLookupId(id, 'code');
	i						= nuValidLookupId(i, 'description');
	this.id_id				= i;
	this.code_id				= i + 'code';
	this.description_id		= i + 'description';
	this.id_value				= $('#'  + this.id_id).val();
	this.code_value			= $('#'  + this.code_id).val();
	this.description_value	= $('#'  + this.description_id).val();

	if(arguments.length == 3 && set == 'id'){
		$('#' + this.id).val(value);
	}
	if(arguments.length == 3 && set == 'code'){
		$('#' + this.code).val(value);
	}
	if(arguments.length == 3 && set == 'description'){
		$('#' + this.description).val(value);
	}
	
}

function nuValidLookupId(id, fld){
	
	var i	= String(id);
	var f	= String(fld);
	var il	= i.length;
	var fl	= f.length;

	if(i.substr(il-fl) === f){
		
		i			= i.substr(0, il - fl);

		if($('#' + i + f).length == 1 && $('#' + i + f + f).length == 1){
			
			i 	= i + f;
			
		}
		
	}
	
	return i;
	
}

function nuHighlightSearch(){

	var bc		= nuBC[nuBC.length - 1];
	var exclude	= bc.nosearch_columns;
	var search	= bc.search.split(' ')
	.filter(function(a) {return (a != '' && a.substr(0,1) != '-')})
	.sort(function(a,b) {return (a.length > b.length)});

	$('.nuBrowseTable').each(function(index){
		
		var col	= Number(String($(this).attr('id')).substr(11));
		
		if(exclude.indexOf(col) == -1){
			
			var h	= String($(this).html());
			
			for(var i = 0 ; i < search.length ; i++){
				h	= h.replace(search[i],'`````' + search[i] + '````', true);
			}

			h 		= h.replaceAll('`````', '<span class="nuBrowseSearch">', true);
			h 		= h.replaceAll('````', '</span>', true);
			
			$(this).html(h);
			
		}
		
	});
	
}

function nuGetFormData(){

	var a	= [];
	var s	= '';
	var f	= $("[id$='nuFormHolder']");
	
	f.each(function(index){
	
		var	s	= String($(this).attr('id'));
		
		a.push(s.substr(0, s.length - 12));
		
	});
	
	var b		= a.sort();
	var r		= [];
	
	for(var i = 0 ; i < b.length ; i++){

		var rw	= new nuFormClass(b[i]);
		
		if(rw.d == true || rw.p == '-1' || rw.f.length != 0){
			
			r.push(rw);
			
		}
		
	}
	
	console.log(JSON.stringify(r));
	
}


function nuFormClass(frm){
	
	var primary_key	= $('#' + frm + 'nuPrimaryKey').val();
	var form_id	= $('#' + frm + 'nuFormHolder').attr('data-nu-edit-form-id');
	var deleted		= $('#' + frm + 'nuDelete').is(":checked");

	var fields		= [];
	var values		= [];
	var o			= $("[data-nu-prefix='" + frm + "'][data-nu-field]");

	o.each(function(index){

		var f		= $(this).attr('data-nu-field');
		var v		= $(this).val();

		if(window.nuFIELD[frm + f] != v || primary_key == '-1'){
		
			fields.push(f);
			values.push(v);
		
		}
		
	});
	
	this.p	= primary_key;
	this.i	= form_id;
	this.d	= deleted;
	this.f	= fields;
	this.v	= values;

}


function nuSetFORM(F){
	
	for(var o = 0 ; o < F.objects.length ; o++){
		
		if(F.objects[o].type == 'subform'){
			
			for(var s = 0 ; s < F.objects[o].forms.length ; s++){
				
				nuSetFORM(F.objects[o].forms[s]);
				
			}
			
		}
		
		console.log(F.objects[o]);
		
	}
	
}