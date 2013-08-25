/*!
 * Amplify Core 1.1.0
 * 
 * Copyright 2011 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 * 
 * http://amplifyjs.com
 */
(function( global, undefined ) {

var slice = [].slice,
	subscriptions = {};

var amplify = global.amplify = {
	publish: function( topic ) {
		var args = slice.call( arguments, 1 ),
			topicSubscriptions,
			subscription,
			length,
			i = 0,
			ret;

		if ( !subscriptions[ topic ] ) {
			return true;
		}

		topicSubscriptions = subscriptions[ topic ].slice();
		for ( length = topicSubscriptions.length; i < length; i++ ) {
			subscription = topicSubscriptions[ i ];
			ret = subscription.callback.apply( subscription.context, args );
			if ( ret === false ) {
				break;
			}
		}
		return ret !== false;
	},

	subscribe: function( topic, context, callback, priority ) {
		if ( arguments.length === 3 && typeof callback === "number" ) {
			priority = callback;
			callback = context;
			context = null;
		}
		if ( arguments.length === 2 ) {
			callback = context;
			context = null;
		}
		priority = priority || 10;

		var topicIndex = 0,
			topics = topic.split( /\s/ ),
			topicLength = topics.length,
			added;
		for ( ; topicIndex < topicLength; topicIndex++ ) {
			topic = topics[ topicIndex ];
			added = false;
			if ( !subscriptions[ topic ] ) {
				subscriptions[ topic ] = [];
			}
	
			var i = subscriptions[ topic ].length - 1,
				subscriptionInfo = {
					callback: callback,
					context: context,
					priority: priority
				};
	
			for ( ; i >= 0; i-- ) {
				if ( subscriptions[ topic ][ i ].priority <= priority ) {
					subscriptions[ topic ].splice( i + 1, 0, subscriptionInfo );
					added = true;
					break;
				}
			}

			if ( !added ) {
				subscriptions[ topic ].unshift( subscriptionInfo );
			}
		}

		return callback;
	},

	unsubscribe: function( topic, callback ) {
		if ( !subscriptions[ topic ] ) {
			return;
		}

		var length = subscriptions[ topic ].length,
			i = 0;

		for ( ; i < length; i++ ) {
			if ( subscriptions[ topic ][ i ].callback === callback ) {
				subscriptions[ topic ].splice( i, 1 );
				break;
			}
		}
	}
};

}( this ) );




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
		list : "<ul></ul>",
		header  : "<div>{header}</div>",
		footer : "<div>{footer}</div>",
		todo : ["<li>",
				"<span>","<input name=\"todo\" id={id} type=\"checkbox\"/>","</span>",
				"<div contenteditable=true></div>",
				"</li>"].join()
	}
	

}


Todo = function(attributes){
    var defaultValues = {		
		title : "",
		id  : generateUUID(),
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
		this.container = $ele;
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
		// var storedList = this.container.data("todoList");
		// if( storedList === undefined){
			// this.todos = new TodoCollection();
		// }else{
			// this.todos = storedList;
		// }
	},
	
	draw : function(){
		this.render("header");
		this.render("list");
		this.render("footer");
		amplify.publish("viewIntialized");
	},
	
	bindHandlers : function(){
	
	},
	
	render : function(what){
		var inst = this;
		switch(what)
		{
			case "header":
				inst.container.html( new Template(todoUtility.template.header, inst.options.label ).render());
			break;
			case "list":
				inst.container.append( new Template(todoUtility.template.list, inst.options.label ).render());
			break;
			case "footer":
			inst.container.append( new Template(todoUtility.template.footer, inst.options.label ).render()); 
							
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
	label: { header : "Heading 1", footer : "Footer"}
	
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