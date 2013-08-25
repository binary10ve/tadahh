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



(function($){


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function generateUUID() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

TodoTemplate = {
	list = ["<ul></ul>"],
	header = ["<div>{heading}</div>"].join(),
	footer = ["<div>{footer}</div>"].join(),
	todo = ["<li>",
			"<span>","<input name=\"todo\" id={id} type=\"checkbox\"/>","</span>",
			"<div contenteditable=true></div>",
			"</li>"].join(),
	
}

Todo = function(){
    var defaultValues = {		
		this.title= ""
		this.id = generateUUID();
		this.description = "";
	}
	

};

Todo.prototype = {

	create : function(){
	
	},
	update : function(){
	
	},
	destroy : function(){
	
	}
	
};


TodoCollection = [];


TodoApp = function($ele){
		this.container = $ele;
		this.init();
};


TodoApp.prototype = {

	init : function (){
		this.fetchTodos();
		this.draw();
		this.bindHandlers();
		
	},
	
	fetchTodos = function(){
		var storedList = this.container.data("todoList");
		if( storedList === undefined){
			this.todos = new TodoCollection();
		}else{
			this.todos = storedList;
		}
	},
	
	draw : function(){
		this.render("header");
		this.render("list");
		this.render("footer");
		amplify.publish("viewIntialized");
	},
	
	bindHandlers : function(){
	
	},
	
	render : function(){
	
	}
	
	

};




    $.fn.todoApp = function(options) {
        
        if (this.data('todoApp') != "undefined") {
            return this.data('todoApp');
        } else if ($.type(options)  ==  'string') {
            var todoApp = this.data('todoApp');
            if (todoApp) todoApp[options]();
            return this;
        }else if ($.type(options)  == "object"){
			options = $.extend({}, $.fn.todoApp.defaults, options);
			var app = new TodoApp(this, options);
			$.data(this, 'todoApp', app);
		} 
        
        return this;
        
    };


$.fn.todoApp.defaults = {


}


})(jQuery)_


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