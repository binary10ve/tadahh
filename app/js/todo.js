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
		todo : ['<li id="{id}">',
					'<div>',
						'<div class="marker">',
							'<div class="dragger"></div>',
							'<div class="toggle" data-id="{id}"></div>',
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

	init : function(){
		
	},

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



TodoApp = function($ele,options){
		this.ele = $ele;
		this.options = options;
		this.init();
};


TodoApp.prototype = {

	init : function (){
		this.fetchTodos();
		this.draw();
		this.setUpVariables();
		this.bindHandlers();
		
	},
	
	fetchTodos : function(){
		this.todos = this.options.source || [(new Todo())]
		return this.todos;
	},

	getTodo: function (id, callback) {
		var inst = this;
		$.each(this.todos, function (i, val) {
			if (val.id === id) {
				callback.apply(inst, arguments);
				return false;
			}
		});
	},
	
	draw : function(){
		this.render("container");
		this.render("header");
		this.render("list");
		this.render("footer");
		this.render("todos");
	},

	setUpVariables : function(){
		this.header = this.container.find("#todo-header");
		this.toggler = this.container.find(".toggle");
		this.footer = this.container.find("#todo-footer");	
		this.editables = this.container.find("div[contenteditable]");
	},

	bindHandlers : function(){
		var inst = this;
		this.toggler.click(function(event) {
			inst.markAsComplete($(this), $(this).hasClass('complete'));
		});
		this.container.on('keypress', 'div[contenteditable]',function(e){
			if(e.which === 13){
				inst.handleEnterKey(e);	
			}
			if(e.which === 8){
				inst.handleBackSpace(e);
			}
	
		});
	},


	markAsComplete : function($ele, flag){
		this.getTodo($ele.attr("data-id"), function(i, item){
			item.completed = !flag;
		})
		$ele.toggleClass('complete',!flag);
	},

	handleBackSpace : function(e){
		var val = $.trim($(e.target).html());
		if(val == ""){
				console.log('delet this')
		}
	},

	handleEnterKey : function(e){
			var val = $.trim($(e.target).html());
			if(val != ""){
				this.addNewTodo($(e.target));
			}
           e.preventDefault();
	},

	addNewTodo : function(editable){
		var parent = editable.parents("li");
		var todo = new Template(todoUtility.template.todo, (new Todo())).render();	
		$(todo).insertAfter(parent);
		parent.next().find("div[contenteditable]").focus();
	},
	
	render : function(what){
		var inst = this;
		switch(what)
		{
			case "container":
				this.ele.html( new Template(todoUtility.template.container).render());
				this.container = this.ele.find(".todo-container");
			break;
			case "header":
				this.container.html( new Template(todoUtility.template.header, this.options.label ).render());		
			break;
			case "list":
				this.container.append( new Template(todoUtility.template.list, this.options.label ).render());
			break;
			case "footer":
				inst.container.append( new Template(todoUtility.template.footer, inst.options.label ).render());			
			case "todos":
			this.listContainer = this.container.find("#todo-list-cont");
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
			app = new TodoApp(this, options);
			$.data(this, 'todoApp', app);
		} 
        
        return this;
        
    };


$.fn.todoApp.defaults = {
	label: { header : "Heading 1", footer : "Footer"},
	onCreate : $.noop,
	onDelete : $.noop,
	onUpdate : $.noop,
	source : [{ id : "456456", description : "fdgfdg", completed : false},
				{ id : "13343", description : "ccccccd", completed : true}
				]
	
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