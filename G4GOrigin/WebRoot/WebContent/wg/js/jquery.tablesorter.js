/*
 *
 * TableSorter 2.0 - Client-side table sorting with ease!
 *
 * Copyright (c) 2007 Christian Bach (http://lovepeacenukes.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * jQueryDate: 
 * jQueryAuthor: Christian jQuery
 *
 * TODO: 
 * 		  
 * 		click three no  sort 
 * 		 
 * 		add parsers.
 */
(function($) {

	$.extend({
		tablesorter: new function() {
			
			this.defaults = {
				cssHeader: "header",
				cssAsc: "headerSortUp",
				cssDesc: "headerSortDown",
				sortInitialOrder: "asc",
				sortMultisortKey: "shiftKey",
				sortForce: null,
				textExtraction: "simple",
				parsers: {
				
				},
				widgets: {
				},		
				widgetZebra: {
					css: ["even","odd"]
				},
				headers: {},
				widthFixed: true,
				cancelSelection: true,
				sortList: [],
				headerList: [],
				dateFormat: "mm/dd/yyyy",
				debug: false //TODO: set this to false before release.
				
				
			};
			
			var parsers = [];
			var widgets = [];
			
			/* debuging utils */
			function benchmark(label,stamp) {
				log(label + "," + (new Date().getTime() - stamp.getTime()) + "ms");
			}
			
			function log(s) {
				if (typeof console != "undefined" && typeof console.debug != "undefined") {
					console.log(s);
				} else {
					alert(s);
				}
			}
						
			/* parsers utils */
			function buildParserCache(table,$headers) {
				
				if(table.config.debug) { var parsersDebug = ""; }
				
				var list = [], cells = table.tBodies[0].rows[0].cells, l = cells.length;
				
				for (var i=0;i < l; i++) {
					var p = false;
					if( ($headers[i] && $headers[i].sorter)) {
						p = getParserById($headers[i].sorter);
					} else if((table.config.headers[i] && table.config.headers[i].sorter)) {

						p = getParserById(table.config.headers[i].sorter);
					}
					if(!p) {
						p = detectParserForColumn(table.config,cells[i]);
					}

					if(table.config.debug) { parsersDebug += "column:" + i + " parser:" +p.id + "\n"; }

					list.push(p);
				}

				if(table.config.debug) { log(parsersDebug); }

				return list;
			};
			
			function detectParserForColumn(config,node) {
				var l = parsers.length;
				for(var i=1; i < l; i++) {
					if(parsers[i].is($.trim(getElementText(config,node)))) {
						return parsers[i];
					}
				}
				
				// 0 is always the generic parser (text)
				return parsers[0];
			}
			
			function getParserById(name) {
				var l = parsers.length;
				for(var i=0; i < l; i++) {
					if(parsers[i].id.toLowerCase() == name.toLowerCase()) {	
						return parsers[i];
					}
				}
				return false;
			}
			
			/* utils */
			function buildCache(table) {
				
				if(table.config.debug) { var cacheTime = new Date(); }
				
				var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0,
					totalCells = table.tBodies[0].rows[0].cells.length,
					parsers = table.config.parsers, 
					cache = {row: [], normalized: []};
				
					for (var i=0;i < totalRows; ++i) {
					
						/** Add the table data to main data array */
						var c = table.tBodies[0].rows[i],
							cols = [];
						
						
						
						cache.row.push($(c));
						
						for(var j=0; j < totalCells; ++j) {
							cols.push(parsers[j].format(getElementText(table.config,c.cells[j]),table));	
						}
												
						cols.push(i); // add position for rowCache
						cache.normalized.push(cols);
						cols = null;
					};
				
				if(table.config.debug) { benchmark("Building cache for " + totalRows + " rows:", cacheTime); }
				
				return cache;
			};
			
			function getElementText(config,node) {
				
				if(!node) return "";
								
				var t = "";
				
				if(config.textExtraction == "complex") { 
					t = $(node).text();
				} else {
					if(node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
						t = node.childNodes[0].innerHTML;
					} else {
						t = node.innerHTML;
					}
				}
				return t;
			}
			
			function appendToTable(table,cache) {
				
				if(table.config.debug) {var appendTime = new Date()}
				
				var c = cache, 
					r = c.row, 
					n= c.normalized, 
					totalRows = n.length, 
					checkCell = (n[0].length-1), 
					tableBody = $("tbody:first",table).empty();
					rows = [];
				
							
				//for (var i = 0; i < totalRows; ++i) {
				for (var i=0;i < totalRows; ++i) {
						//log(r[n[i][checkCell]]);
					 	rows.push(r[n[i][checkCell]]);
						
				}
				
				if(table.config.appender != null) {
					table.config.appender(table,rows);	
				} else {
					//tableBody.append(rows);
					for(var i=0; i < totalRows; i++) {
						tableBody.append(r[n[i][checkCell]]);
					}
				}
				
				rows = null;
				
				//apply table widgets
				applyWidget(table);
				
				if(table.config.debug) { benchmark("Rebuilt table:", appendTime); }
			
			};
			
			function buildHeaders(table) {
				
				if(table.config.debug) { var time = new Date(); }
				
				var meta = ($.meta) ? true : false, tableHeadersRows = [];
			
				for(var i = 0; i < table.tHead.rows.length; i++) { tableHeadersRows[i]=0; };
				
				$tableHeaders = $(checkCellColSpan(table, tableHeadersRows, 0,table.tHead.rows[0].cells.length));

				if(table.config.debug) { benchmark("Built headers:", time); }
				
				return $tableHeaders;
				
			};
			
		   	function checkCellColSpan(table, headerArr, row, until) {
                var arr = [];
				var cells = table.tHead.rows[row].cells;
				var offset = 0;
				until += headerArr[row];
				
				for(var i=headerArr[row]; i < until; i++) {
					var cell = cells[i];
					if ( cell.colSpan >  1 ) { 
						arr = arr.concat(checkCellColSpan(table, headerArr, row+cell.rowSpan, cell.colSpan));
					} else {
						// check so header is not disable by the meta plugin
						if(!checkHeaderMetadata(cell) && !checkHeaderOptions(table,i)) {
							
							var $cell = $(cell);
							
							cell.count = 0;
							cell.column = i;
							cell.order = formatSortingOrder(table.config.sortInitialOrder);
							
							// add cell to headerList
							table.config.headerList[i] = cell;
							
							if($.meta && $cell.data().sorter) {
								this.sorter = $cell.data().sorter;
								//this.direction = $this.data().direction; 
							}
							$cell.addClass(table.config.cssHeader);
				
							arr.push(cell);
							
						}
						headerArr[row] = i+1;
					}
				}
				return arr;
			};
			
			function checkHeaderMetadata(cell) {
				if(($.meta) && ($(cell).data().sorter === false)) { return true; };
				return false;
			}
			
			function checkHeaderOptions(table,i) {	
				if((table.config.headers[i]) && (table.config.headers[i].sorter === false)) { return true; };
				return false;
			}
			
			function applyWidget(table) {
				var c = table.config.widgets;
				var l = c.length;
				for(var i=0; i < l; i++) {
					
					getWidgetById(c[i]).format(table);
				}
				
			}
			
			function getWidgetById(name) {
				var l = widgets.length;
				for(var i=0; i < l; i++) {
					if(widgets[i].id.toLowerCase() == name.toLowerCase() ) {
						return widgets[i]; 
					}
				}
			};
			
			function formatSortingOrder(v) {
				
				if(typeof(v) != "Number") {
					i = (v.toLowerCase() == "desc") ? 1 : 0;
				} else {
					i = (v == (0 || 1)) ? v : 0;
				}
				return i;
			}
			
			function isValueInArray(v, a) {
				var l = a.length;
				for(var i=0; i < l; i++) {
					if(a[i][0] == v) {
						return true;	
					}
				}
				return false;
			}
				
			function setHeadersCss(table,$headers, list, css) {
				// remove all header information
				$headers.removeClass(css[0]).removeClass(css[1]);
				
				var h = [];
				$headers.each(function(offset) {
						h[this.column] = $(this);					
				});

				var l = list.length; 
				for(var i=0; i < l; i++) {
					h[list[i][0]].addClass(css[list[i][1]]);
				}
			}
			
			function fixColumnWidth(table,$headers) {
				
				$headers.each(function(offset) {
											
				});
			}
			
			function updateHeaderSortCount(table,sortList) {
				var c = table.config, l = sortList.length;
				for(var i=0; i < l; i++) {
					var s = sortList[i], o = c.headerList[s[0]];
					o.count = s[1];
					o.count++;
				}
			}
			
			/* sorting methods */
			function multisort(table,sortList,cache) {
				
				if(table.config.debug) { var sortTime = new Date(); }
				
				var dynamicExp = "var sortWrapper = function(a,b) {", l = sortList.length;
					
				for(var i=0; i < l; i++) {
					
					var c = sortList[i][0];
					var order = sortList[i][1];
					var s = (getCachedSortType(table.config.parsers,c) == "text") ? ((order == 0) ? "sortText" : "sortTextDesc") : ((order == 0) ? "sortNumeric" : "sortNumericDesc");
					
					var e = "e" + i;
					
					dynamicExp += "var " + e + " = " + s + "(a[" + c + "],b[" + c + "]); ";
					dynamicExp += "if(" + e + ") { return " + e + "; } ";
					dynamicExp += "else { ";
				}
					
				for(var i=0; i < l; i++) {
					dynamicExp += "}; ";
				}
				
				dynamicExp += "return 0; ";	
				dynamicExp += "}; ";	
				
				eval(dynamicExp);
				
				cache.normalized.sort(sortWrapper);
				
				if(table.config.debug) { benchmark("Sorting on " + sortList.length + " columns and dir " + order+ " time:", sortTime); }
				
				return cache;
			};
			
			function sortText(a,b) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			};
			
			function sortTextDesc(a,b) {
				return ((b < a) ? -1 : ((b > a) ? 1 : 0));
			};	
			
	 		function sortNumeric(a,b) {
				return a-b;
			};
			
			function sortNumericDesc(a,b) {
				return b-a;
			};
			
			function getCachedSortType(parsers,i) {
				return parsers[i].type;
			};
			
			/* public methods */
		
			this.construct = function(settings) {
				
				
				return this.each(function() {
					
					var $this, $document,$headers, cache, config, shiftDown = 0, sortOrder;
					this.config = {};
					config = $.extend(this.config, $.tablesorter.defaults, settings);
					
					// store common expression for speed					
					$this = $(this);
					
					
					// build headers
					$headers = buildHeaders(this);
					
					// try to auto detect column type, and store in tables config
					this.config.parsers = buildParserCache(this,$headers);
					
					
					// build the cache for the tbody cells
					cache = buildCache(this);
					
					// get the css class names, could be done else where.
					var sortCSS = [config.cssAsc,config.cssDesc];
				
					// apply event handling to headers
					// this is to big, perhaps break it out?
					$headers.click(function(e) {
						// store exp, for speed
						var $cell = $(this);
						// check to see so the header has sorting class active.
	
						// get current column index
						var i = this.column;
						
						// get current column sort order
						this.order = this.count++ % 2;
						
						// user only whants to sort on one column
						if(!e[config.sortMultisortKey]) {
							
							// flush the sort list
							config.sortList = [];
							
							if(config.sortForce != null) {
								sortList.push(config.sortForce);	
							}
							
							// add column to sort list
							config.sortList.push([i,this.order]);
						
						// multi column sorting	
						} else {
							// the user has clicked on an all ready sortet column.
							if(isValueInArray(i,config.sortList)) {	 
								
								// revers the sorting direction for all tables.
								for(var j=0; j < config.sortList.length; j++) {
									var s = config.sortList[j], c = config.headerList[s[0]];
									if(s[0] == i) {
										s[1] = c.order;
									}				
								}	
							} else {
								// add column to sort list array
								config.sortList.push([i,this.order]);
							}
						};
						
						//set css for headers
						setHeadersCss($this[0],$headers,config.sortList,sortCSS);
						
						// sort the table and append it to the dom
						appendToTable($this[0],multisort($this[0],config.sortList,cache));
						
						// stop normal event by returning false
						return false;
					
					// cancel selection	
					}).mousedown(function() {
						if(config.cancelSelection) {
							this.onselectstart = function() {return false};
							//alert(this.onselectstart);
							return false;
						}
					});
					
					// apply easy methods that trigger binded events
					$this.bind("update",function() {
						
						// rebuild the cache map
						cache = buildCache(this);
						
					}).bind("sorton",function(e,list) {
						
						// update and store the sortlist
						var sortList = config.sortList = list;
						
						// update header count index
						updateHeaderSortCount(this,sortList);
						
						//set css for headers
						setHeadersCss(this,$headers,sortList,sortCSS);
						
						// sort the table and append it to the dom
						appendToTable(this,multisort(this,sortList,cache));
						
					}).bind("appendCache",function() {
						appendToTable(this,cache);
					});
					
					// apply widgets
					applyWidget(this);
				});
			};
			
			this.addParser = function(parser) {
				var l = parsers.length, a = true;
				for(var i=0; i < l; i++) {
					if(parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
						a = false;
					}
				}
				if(a) { parsers.push(parser); };
			};
			
			this.addWidget = function(widget) {
				widgets.push(widget);
			};
			
			this.formatFloat = function(s) {
				var i = parseFloat(s);
				return (isNaN(i)) ? 0 : i;
			};
			this.formatInt = function(s) {
				var i = parseInt(s);
				return (isNaN(i)) ? 0 : i;
			};
			
		}
	});
	
	// extend plugin scope
	$.fn.extend({
        tablesorter: $.tablesorter.construct
	});
	
	// add parsers
	$.tablesorter.addParser({
		id: "text",
		is: function(s) {
			return true;
		},
		format: function(s) {
			return $.trim(s.toLowerCase());
		},
		type: "text"
	});
	
	$.tablesorter.addParser({
		id: "integer",
		is: function(s) {
			return s.match(new RegExp(/^\d+$/));
		},
		format: function(s) {
			return $.tablesorter.formatInt(s);
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "currency",
		is: function(s) {
			return /^[£$€?.]/.test(s);
		},
		format: function(s) {
			return $.tablesorter.formatFloat(s.replace(new RegExp(/[^0-9.]/g),""));
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "integer",
		is: function(s) {
			return /^\d+$/.test(s);
		},
		format: function(s) {
			return $.tablesorter.formatFloat(s);
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "floating",
		is: function(s) {
			return s.match(new RegExp(/^(\+|-)?[0-9]+\.[0-9]+((E|e)(\+|-)?[0-9]+)?$/));
		},
		format: function(s) {
			return $.tablesorter.formatFloat(s.replace(new RegExp(/,/),""));
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "ipAddress",
		is: function(s) {
			return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
		},
		format: function(s) {
			var a = s.split(".");
			var r = "";
			for (var i = 0, item; item = a[i]; i++) {
			   if(item.length == 2) {
					r += "0" + item;
			   } else {
					r += item;
			   }
			}
			return $.tablesorter.formatFloat(s);
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "url",
		is: function(s) {
			return /^(https?|ftp|file):\/\/$/.test(s);
		},
		format: function(s) {
			return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));
		},
		type: "text"
	});
	
	$.tablesorter.addParser({
		id: "isoDate",
		is: function(s) {
			return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
		},
		format: function(s) {
			return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(new RegExp(/-/g),"/")).getTime() : "0");
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "usLongDate",
		is: function(s) {
			return /^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/.test(s);
		},
		format: function(s) {
			return $.tablesorter.formatFloat(new Date(s).getTime());
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
		id: "shortDate",
		is: function(s) {
			return /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(s);
		},
		format: function(s,table) {
			var c = table.config;
			s = s.replace(new RegExp(/-/g),"/");
			if(c.dateFormat == "mm/dd/yyyy" || c.dateFormat == "mm-dd-yyyy") {
				/** reformat the string in ISO format */
				s = s.replace(new RegExp(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/), "$3/$1/$2");
			} else if(c.dateFormat == "dd/mm/yyyy" || c.dateFormat == "dd-mm-yyyy") {
				/** reformat the string in ISO format */
				s = s.replace(new RegExp(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/), "$3/$2/$1");
			} else if(c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
				s = s.replace(new RegExp(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2})/), "$1/$2/$3");	
			}
			return $.tableSorter.utils.formatFloat((new Date(s)).getTime());
		},
		type: "numeric"
	});
	
	$.tablesorter.addParser({
	    id: "time",
	    is: function(s) {
	        return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
	    },
	    format: function(s) {
	        return $.tableSorter.utils.formatFloat((new Date("2000/01/01 " + s)).getTime());
	    },
	  type: "numeric"
	});
	
	// add widgets
	$.tablesorter.addWidget({
		id: "zebra",
		format: function(table) {
			$("> tbody:first/tr:visible:even",table).removeClass(table.config.widgetZebra.css[1]).addClass(table.config.widgetZebra.css[0]);
			$("> tbody:first/tr:visible:odd",table).removeClass(table.config.widgetZebra.css[0]).addClass(table.config.widgetZebra.css[1]);
		}
	});
	
})(jQuery);