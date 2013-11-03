

function Template( html, object_s ){
	this.html = html,
	this.object_s = object_s,
	this.parser = function( obj ){
		var html = this.html;
		for( var i in obj ){
		// Create a regex out of object key and replace it with their values
			var reg = new RegExp( "\{" + i + "\}" , "g" );
			var html = html.replace( reg, obj[i] );
		}
		return html;
	},
	this.collection = function(){
		var output = [];
		for( var i = 0, l = this.object_s.length; i < l ;i++ ){
			output.push( this.parser(this.object_s[i]) );
		}
		return output.join( "" );
	},
	this.locals = function(){
		return this.parser( this.object_s );
	},
	this.render = function(){
	// This is Nasty
	 return ( this.object_s instanceof Array ) ? this.collection() : this.locals();
	}	
}

var todoUtility = {

	s4 :  function(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},
	generateUUID : function(){
		  return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
         this.s4() + '-' + this.s4() + this.s4() + this.s4();
	},
	
	template : {
		container : "<div class='todo-container relative'></div>",
		list : '<div class="list_container"><ul id="todo-list-cont"></ul>',
		header  : ['<div class="header">',
						'<div class="left">{header}</div>',
						'<div class="right">',
							'<div class="minimize"></div>',
							'<div class="cross"></div>',
						'</div>',
					'</div>'].join(''),
		footer : "<div id='todo-footer' class='footer'>{footer}</div>",
		todo : ['<li>',
					'<div>',
						'<div class="marker">',
							'<div class="dragger"></div>',
							'<div class="toggle"></div>',
						'</div>',
						'<div contenteditable="true" class="editable">{description}</div>',
						'<div class="details"></div>',
						'<div class="clear-float">&nbsp;</div>',
					'</div>',
				'</li>'].join('')
	}
	

}


Todo = function(attributes){
    var defaultValues = {		
		title : "",
		id  : todoUtility.generateUUID(),
		description  : ""
	}
	
	attributes = $.extend({}, defaultValues, (attributes || {}))
	this.buildAttributes(attributes);
};

Todo.prototype = {

	create : function(){
	
	},
	update : function(){
	
	},
	destroy : function(){
	
	},
	buildAttributes : function(attr){
		for(var key in attr){
		this[key] = attr[key];
		}
	}
	
};


TodoCollection = [];


TodoApp = function($ele,options){
		this.ele = $ele;
		this.options = options;
		this.init();
};


TodoApp.prototype = {

	init : function (){
		this.fetchTodos();
		this.draw();
		this.bindHandlers();
		
	},
	
	fetchTodos : function(){
		return [(new Todo({"id" : 345345, "description" : "ffffffffff"})),(new Todo({ "id" : 6445654, "description" : "666666666"})), (new Todo({description : ""}))];
	},
	
	draw : function(){
		this.render("container");
		this.render("header");
		this.render("list");
		this.render("footer");
		this.render("todos");
	},
	
	bindHandlers : function(){
	
	},
	
	render : function(what){
		var inst = this;
		switch(what)
		{

			case "container":
				inst.ele.html( new Template(todoUtility.template.container).render());
				inst.container = inst.ele.find(".todo-container");
			break;
			case "header":
				inst.container.html( new Template(todoUtility.template.header, inst.options.label ).render());
				inst.header = inst.container.find("#todo-header");
			break;
			case "list":
				inst.container.append( new Template(todoUtility.template.list, inst.options.label ).render());
				inst.listContainer = inst.container.find("#todo-list-cont");
			break;
			case "footer":
			inst.container.append( new Template(todoUtility.template.footer, inst.options.label ).render()); 
			inst.footer = inst.container.find("#todo-footer");
			case "todos":
			inst.listContainer.html(new Template(todoUtility.template.todo, inst.fetchTodos()).render());
							
			break;
			default:
			
		}
		
	}
	
	

};




    $.fn.todoApp = function(options) {
        
        if (this.data('todoApp') !== undefined) {
            return this.data('todoApp');
        } else if ($.type(options)  ==  'string') {
            var todoApp = this.data('todoApp');
            if (todoApp) todoApp[options]();
            return this;
        }else if ($.type(options)  == "object"  || options == undefined ){		
			options = $.extend({}, $.fn.todoApp.defaults, (options || {}));
			var app = new TodoApp(this, options);
			$.data(this, 'todoApp', app);
		} 
        
        return this;
        
    };


$.fn.todoApp.defaults = {
	label: { header : "Heading 1", footer : "Footer"},
	onCreate : $.noop,
	onDelete : $.noop,
	onUpdate : $.noop 
	
}




/*

jQuery("#container").todoList({
	labels : { header:"",footer: "" },
	adapter : "localstorage"
	namespace : "",
	callbacks : {
		create : noop,
		delete : noop,
		update : noop	
	},
	
})

*/