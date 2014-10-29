/*
	Berkeley Automation Lab
	Version: June 2006
	http://automation.berkeley.edu
	--> Edit Section @ Line 55 to update the menu navigation!
*/

 
YAHOO.namespace('News');	 
YAHOO.News.Scroller = function(args) {	 
	args = args || {};
  	this.viewableArea = document.getElementById(args.viewableArea) || 'ynscrollviewable';
	this.scrollerContainer = args.scrollerContainer || 'ynscroll';
	this.indicatorContainer = args.indicatorContainer || 'ynindcont';
	this.delayTime = args.delayTime || 10000;	

	this.currentPane = 0;
	this.autoScroll = null;
	this.autoScrollOn = true;
	 
	/* Setup ID/Class Names */
	this.indicatorClassOff = "off";
	this.indicatorClassOn = "on";
	
	this.w = this.viewableArea.offsetWidth;
	this.viewableArea.scrollLeft = '0px';
	
	// ********************* Count DIVs and assign a Global Value of Panes ******************
	var gettabs = document.getElementById(this.scrollerContainer); 
	var getdiv = gettabs.getElementsByTagName("div"); 			
	
	var countPanes = 0;
	var dl = getdiv.length;
	for (var x=0; x < dl; x++) {
		var classkey = getdiv[x].getAttribute("name");	
		
		if ((x === 0) && (classkey == "container")) {
			var getFirst = getdiv[x]; 
		}
			
	    if (classkey == "container") {
	 	    var idstring = getdiv[x].id;
		countPanes++;  
	    }				
	}
	this.maxpanes = countPanes-1;
	this.max_width = this.w * this.maxpanes;
	
	// ************************  Duplicate 1st Pane and append to end of ynscroll ****************************
	var duplicate = getFirst.cloneNode(true);
	duplicate.removeAttribute("id");
	duplicate.setAttribute("name", "duplicate");
	document.getElementById(this.scrollerContainer).appendChild(duplicate);
	
	// *************************  EDIT THIS PART TO CHANGE THE MENU NAVIGATION!! *****************************	
	document.write('<div id="'+this.indicatorContainer+'" class="dots"><ul id="navlist">');
	document.write('<li><a href="index.html" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">About</a></li>');
	document.write('<li><a href="projects.html" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">Projects</a></li>');
	document.write('<li><a href="people.html" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">People</a></li>');
	document.write('<li><a href="sponsors.html" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">Sponsors</a></li>');
	document.write('<li><a href="http://ieor.berkeley.edu/~goldberg/pubs/" target="_blank" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">Publications</a></li>');
	document.write('<li><a href="policy.html" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'">Policies/Advice/Resources</a></li>');
	document.write('</ul></div>');		
	
	/* *****************  This was originally to make the menu appear as a series of dots ********************
	document.write('<div id="'+this.indicatorContainer+'" class="dots">');
	  for (x=0; x <= this.maxpanes; x++) {
		if (x == 0) {
			document.write('<a href="javascript:;" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOn+'">Pane '+x+'&nbsp;</a>');
		} else {
			document.write('<a href="javascript:;" id="'+this.indicatorContainer+x+'" class="'+this.indicatorClassOff+'"><strong>Pane '+x+'</strong>&nbsp;</a>');
		}
	}
	document.write('</div>');*/
	 
	YAHOO.util.Event.onAvailable(this.scrollerContainer, this.init, this, true);
};

YAHOO.News.Scroller.prototype = {
	init : function() {		  
		
		  // ******************  Setup Indicator Button Links *****************
		  var getcont = document.getElementById(this.indicatorContainer);
		  var getAnchor = getcont.getElementsByTagName('a');
		  var il = getAnchor.length;
		   
		  for (var n = 0; n < il; n++) {		  	
		  	    getAnchor[n].cp = n;
				YAHOO.util.Event.addListener(getAnchor[n], 'mouseover', this.indicators, this, true);					
		  }
		  if (this.maxpanes != 0) { this.autoStart(); }
	}, 	
	
	indicators : function(e) {
		if (this.maxpanes != 0) { 
			this.stopInterval();
			this.currentPane = YAHOO.util.Event.getTarget(e).cp; 
			this.scrollToPane(this.currentPane); 
		}		
		YAHOO.util.Event.preventDefault(e);	
	},
	   
	 scrollToPane : function(currentPane) {
	      if (currentPane == -1) { return; }	
		  this.currentPane = currentPane;
		  this.animate(currentPane);
		  this.changeStates(currentPane);	 
	 }, 

	 animate : function(currentPane) {

	 	  var move = currentPane * this.w;	
	 	 
	  	  var attributes = {
		  	scroll: { to: [move, 0] }
	   	  };
	   	  var anim = new YAHOO.util.Scroll(this.viewableArea, attributes, 0.5, YAHOO.util.Easing.easeOut);
													
		  if ((this.autoScrollOn === true) && (currentPane > this.maxpanes)) {
				anim.onComplete.subscribe(this.setToZero);
	        	this.stopInterval();
				this.currentPane = 0;
	        	this.changeStates(this.currentPane);
		  }
		  anim.animate();	
		  return false;
	 },
  
	setToZero : function() {
	      var el = this.getEl();
	      el.scrollLeft = 0;	
	 },
 
	autoStart : function() {
		if (this.autoScrollOn) {
			var doit = function(self) {
			return function() {
		  			self.scrollToPane(self.currentPane+1);
					self.autoStart();
		      		}
			}
			clearTimeout(this.autoScroll);
			this.autoScroll = setTimeout(doit(this),this.delayTime); 
		}
	}, 	
	
	stopInterval : function() {
		if (this.autoScrollOn === true) {
			clearTimeout(this.autoScroll);
			this.autoScrollOn = false;
		}
	}
};
