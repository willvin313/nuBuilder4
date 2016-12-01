
class nuListObject{
	
	constructor(e){
		
		var obj						= $('#' + e.target.id);
		var off						= obj.offset();
		var w						= parseInt(obj.css('width'));
		var h						= parseInt(obj.css('height'));

		this.OBJECT					= obj[0];
		this.EVENT					= e;
		this.rowHeight				= 19;
		this.top					= off.top + h;
		this.left					= off.left;
		this.width					= w;
		this.height					= 0;
		this.list					= [];
		this.boxTop					= 0;
		this.boxRows				= 0;
		this.boxList				= [];
		this.boxHighlight			= 0;
		
	}
	
	setList(a){

		if(JSON.stringify(this.list) != JSON.stringify(a)){

			this.list				= a;
			this.boxRows			= a.slice(0, 10).length;
			this.boxHighlight 		= 0;
			this.boxTop				= 0;
			this.height				= this.rowHeight * this.boxRows;
			this.setBoxList(0);
			
		}
		
	}
	
	setBoxList(bt){

		if(bt == -1 || bt == 1){
			this.boxTop				+= bt;
		}else{
			this.boxTop				=  bt;
		
		}
		
		if(this.list.length - this.boxRows == this.boxTop){
			this.boxTop				= 0;
		}
		
		this.boxList				= this.list.slice(this.boxTop, this.boxTop + 10);	
		this.boxRows				= this.boxList.length;	
		this.boxSize				= this.boxList.length;	
		
	}

	up(){

		if(this.boxHighlight < 1){											//-- top of box
			
			if(this.boxTop < 1){											//-- top of list
			
				this.boxHighlight	= this.boxRows - 1;						//-- bottom of box
				this.setBoxList(this.list.length - this.boxRows);			//-- bottom of list
				
			}else{
				this.setBoxList(-1);											
			}
			
		}else{
			this.boxHighlight 	= this.boxHighlight - 1;					//-- move up in box
		}
		
		$('#' + this.OBJECT.id).change();
		
	}
	
	down(){
		
		if(this.boxHighlight + 2 > this.boxRows){							//-- bottom of box
			
			if(this.boxTop + this.boxRows == this.list.length - 1){			//-- bottom of list
				
				this.boxHighlight	= 0;									//-- top of box
				this.setBoxList(0);											
				
			}else{
				this.setBoxList(1);											//-- top of list
			}
			
		}else{
			this.boxHighlight 	= this.boxHighlight + 1;					//-- move down in box
		}
		
		$('#' + this.OBJECT.id).change();
		
	}
	
	buildList(){
		
		$('#nuListerListBox').remove();
		
		var box 		= document.createElement('div');
		var rw			= '';
		
		box.setAttribute('id', 'nuListerListBox');
		
		$('body').append(box);

		$('#nuListerListBox').css({
						'top'			: this.top,
						'left'			: this.left,
						'width'			: this.width,
						'height'		: this.height,
						'text-align'	: 'left',
						'position'		: 'absolute',
						'overflow'		: 'hidden',
		});
		
		for(var i = 0 ; i < this.boxList.length ; i++){
			
			var uid		= 'id="nulister' + i + '"';
			var id		= this.EVENT.target.id
			var item	= this.boxList[i];
			var fit		= this.choppedAt(item, this.width);
			$('#' + id).val(item);
			console.log(id);
			if(i == this.boxHighlight){
				rw		= "<div " + uid + " onclick='nuPickFromList(event)' data-nu-index='" + (i + this.boxTop) + "' data-nu-value='" + item + "' data-nu-id='" + id + "' class='nuListerListBoxSelected'>" + fit + "</div>";
			}else{
				rw		= "<div " + uid + " onclick='nuPickFromList(event)' data-nu-index='" + (i + this.boxTop) + "' data-nu-value='" + item + "' data-nu-id='" + id + "' class='nuListerListBoxNotSelected'>" + fit + "</div>";
			}
			
			$('#nuListerListBox').append(rw);
		
		}
		
	}
	
	choppedAt(s, w){
		
		var len	= 0;
		
		for(var i = 0 ; i < s.length ; i++){
			
			len	= nuGetWordWidth(s.substr(0, s.length - i)) + 10;
			
			if(len < w){
				return s.substr(0, s.length - i) + (i === 0 ? '' : '...');
			}
		
		}
		
	}
	
}


function nuPickFromList(e){
		
		var o				= $('#' + e.target.id);
		var ind				= o.attr('data-nu-index');
		var val				= o.attr('data-nu-value');
		var id				= o.attr('data-nu-id');
		
		this.boxHighlight	= Number(ind);
		
		$('#' + id).val(val);

		$('#nuListerListBox').remove();
		
	}

