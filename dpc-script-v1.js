var j = jQuery.noConflict();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function daysInMonth(month, year) {
    var lastday = new Date(year, parseInt(month)+1, 0); 
    return lastday.getDate();
}

j(document).ready(function() {
    // date period component config
	var options = {
		calendarType: 'calendar', // set standard or fiscal calendar, defaults to calendar ('calendar', 'fiscal')
        firstDay: 0, // set first day of week, defaults to Sunday = 0 (Monday = 1, etc)
    };

    // define variables for start and end dates and period selected
	var start_date = new Date();
	var end_date = new Date();
	var period, fs_period;

	// get current date
	var today = new Date();
	var current_year = today.getFullYear();
	var current_month = today.getMonth();
	
	// tabs inner html
    var tabs = {
      
        daterange: '<ul id="df-daterange" class="middle"><li class="df-radio-sel"><input id="df-daterange-val" type="radio" name="df-radio" value="daterange" class="df-radio df-hide" /><div class="df-field"><label>Start</label><input class="text" type="text" name= "df-from" module="calendar"><span class= "df-note">DD MMM YYYY</span></div><div class="df-option"><input type="checkbox" name="df-nofrom" id= "df-nofrom"><label class="df-nofrom-label" for="df-nofrom">No Start Date</label></div><div class="df-field"><label>End</label><input class="text" type="text" name= "df-to" module="calendar"><span class= "df-note">DD MMM YYYY</span></div><div class="df-option"><input type="checkbox" name="df-noto" id="df-noto"><label class="df-noto-label" for="df-noto">No End Date</label></div></li></ul>',

        days: '<ul id="df-days" class="middle"> <li class="df-radio-sel"> <input id="df-today-val" type="radio" name="df-radio" value="today" class="df-radio" /> <label class="df-display" for="df-today-val">Today</label> </li> <li class="df-radio-sel"> <input id="df-yesterday-val" type="radio" name="df-radio" value="yesterday" class="df-radio" /> <label class="df-display" for="df-yesterday-val">Yesterday</label> </li> <li class="df-radio-sel"> <input id="df-lastndays-val" type="radio" name="df-radio" value="lastndays" class="df-radio" /> <label class="df-display" for="df-lastndays-val">Previous <input class="text" type="text" name="df-last" /> Days</label> <p class="df-prev-today"><input id="df-includetoday" type="checkbox" class="df-checkbox" /><label for="df-includetoday"> Include today\'s data</label></p> </li> </ul>',

        weeks: '<ul id="df-weeks" class="middle"><li class="df-radio-sel"><input id="df-selectweek-val" type="radio" name="df-radio" value="selectweek" class="df-radio" /><label class="df-display" for="df-selectweek-val"><span name="df-wtype" class="df-type-cap"></span> week</label><div class="df-weekbox"><div class="week-picker"></div></div></li><li class="df-radio-sel"><input id="df-weektodate-val" type="radio" name="df-radio" value="weektodate" class="df-radio" /><label class="df-display" for="df-weektodate-val">Current <span name="df-wctype" class="df-type-nocap"></span> week to date</label></li><li class="df-radio-sel"><input id="df-previousweek-val" type="radio" name="df-radio" value="previousweek" class="df-radio" /><label class="df-display" for="df-previousweek-val">Previous <select name="df-pweek"></select> <span name="df-wptype" class="df-type-nocap"></span> week(s)</label></li></ul>',

        months: '<ul id="df-months" class="middle"><li class="df-radio-sel"><input id="df-selectmonth-val" type="radio" name="df-radio" value="selectmonth" class="df-radio" /><label class="df-display" for="df-selectmonth-val"><select name="df-month"></select><select name="df-myears"></select></label></li><li class="df-radio-sel"><input id="df-monthtodate-val" type="radio" name="df-radio" value="monthtodate" class="df-radio" /><label class="df-display" for="df-monthtodate-val">Current month to date</label></li><li class="df-radio-sel"><input id="df-previousmonth-val" type="radio" name="df-radio" value="previousmonth" class="df-radio" /><label class="df-display" for="df-previousmonth-val"><span>Previous</span> <select name="df-pmonth"></select> <span>month(s)</span></label></li></ul>',

        periods: '<ul id="df-periods" class="middle"><li class="df-radio-sel"><input id="df-selectperiod-val" type="radio" name="df-radio" value="selectperiod" class="df-radio" /><span class="df-display">Fiscal <select name="df-period"></select><select name="df-pyears"></select></span></li><li class="df-radio-sel"><input id="df-periodtodate-val" type="radio" name="df-radio" value="periodtodate" class="df-radio" /><span class="df-display">Current fiscal period to date</span></li><li class="df-radio-sel"><input id="df-previousperiod-val" type="radio" name="df-radio" value="previousperiod" class="df-radio" /><span class="df-display"><span>Previous</span> <select name="df-pperiod"></select><span> fiscal period(s)</span></span></li></ul>',

        quarters: '<ul id="df-quarters" class="middle"><li class="df-radio-sel"><input id="df-selectqtr-val" type="radio" name="df-radio" value="selectqtr" class="df-radio" /><label class="df-display" for="df-selectqtr-val">Calendar <select name="df-cqtr"><option value="1"> Q1 </option><option value="2"> Q2 </option><option value="3"> Q3 </option><option value="4"> Q4 </option></select> <select name="df-cyear"></select></label></li><li class="df-radio-sel"><input id="df-selectfisqtr-val" type="radio" name="df-radio" value="selectfisqtr" class="df-radio" /><label class="df-display" for="df-selectfisqtr-val"><span class="df-customfiscaldisplay">Fiscal</span> <select name="df-fqtr"><option value="1"> Q1 </option><option value="2"> Q2 </option><option value="3"> Q3 </option><option value="4"> Q4 </option></select> <select name="df-fyear"></select></label></li><li class="df-radio-sel"><input id="df-currentqtrtodate-val" type="radio" name="df-radio" value="currentqtrtodate" class="df-radio" /><label class="df-display" for="df-currentqtrtodate-val">Current <span name="df-ctype" class="df-type-nocap"></span> quarter to date</label></li><li class="df-radio-sel"><input id="df-prevqtr-val" type="radio" name="df-radio" value="prevqtr" class="df-radio" /><label class= "df-display" for="df-prevqtr-val">Previous <select name="df-pqtr"></select> <span name="df-ptype" class="df-type-nocap"></span> quarter(s)</label></li></ul>',

        years: '<ul id="df-years" class="middle"><li class="df-radio-sel"><input id="df-selectyear-val" type="radio" name="df-radio" value="selectyear" class="df-radio" /><label class="df-display" for="df-selectyear-val">Calendar year <select name="df-oneyear"></select></label></li><li class="df-radio-sel"><input id="df-selectfisyear-val" type="radio" name="df-radio" value="selectfisyear" class="df-radio" /><label class="df-display" for="df-selectfisyear-val"><span class="df-customfiscaldisplay">Fiscal</span> year <select name= "df-fisoneyear"></select></label></li><li class="df-radio-sel"><input id="df-currentyrtodate-val" type="radio" name="df-radio" value="currentyrtodate" class="df-radio" /><label class="df-display" for="df-currentyrtodate-val">Current <span name="df-yeartype" class="df-type-nocap"></span> year to date</label></li><li class="df-radio-sel"><input id="df-prevyr-val" type="radio" name="df-radio" value="prevyr" class="df-radio" /><label class= "df-display" for="df-prevyr-val">Previous <select name="df-pryear"></select> <span name="df-ptype" class="df-type-nocap"></span> year(s)</label></li></ul>'
    };

	// default settings
	j(".df-module, .df-panel-contain").hide();

    j("#rbr-global-date-filter").click(function(event) {
        j(".df-module").toggle();
    });
	
	j("#df-period").val("alldates");
	
	// close pop-up and clear variables on All dates tab click
	j("#df-a-top").click(function(event) {
		start_date = null;
		end_date = null;
		period = "alldates";
		j("#rbr-global-date-filter").html("All dates");
		j(".df-module").removeClass(function(index, css) {
			return (css.match(/(^|\s)df-active-\S+/g) || []).join(' ');
        });
	    j(".df-module").addClass("df-active-nofilter");
		j(".df-module, .df-panel-contain").hide();
	});
	
	// close pop-up on Cancel button click
	j(".df-cancel").click(function(event) {
		j(".df-module").hide();
	});
	
	j(".df-tab:not(#df-a-top)").click(function(event) {
		// move between tabs
	    var tab_id = period = j(this).attr("tab"); 
		j(".df-module").removeClass(function(index, css) {
			return (css.match(/(^|\s)df-active-\S+/g) || []).join(' ');
        });
		j(".df-module").addClass("df-active-"+tab_id);
        j(".df-panel-contain").html(eval("tabs."+tab_id));
		j(".df-panel-contain").show();

		// set calendar type labels
		var calendar_type = "calendar";//j("select[name='df-type']").val(); 
		j(".df-type-cap").html(capitalizeFirstLetter(calendar_type));
		j(".df-type-nocap").html(calendar_type);
		j("ul#df-quarters li, ul#df-years li").eq(calendar_type=='fiscal'?0:1).css("display","none");
		j("select[name='df-type']").on('change', function() {
			calendar_type = j("select[name='df-type']").val(); 
			j(".df-type-cap").html(capitalizeFirstLetter(calendar_type));
			j(".df-type-nocap").html(calendar_type);
		    j("ul#df-quarters li, ul#df-years li").eq(calendar_type=='fiscal'?0:1).css("display","none");
			j("ul#df-quarters li, ul#df-years li").eq(calendar_type=='fiscal'?1:0).css("display","block");
		});
		
		// set period type
		j("#df-period").val(tab_id);
    	
		/* Date range tab */
		if(tab_id == "daterange") {
			// calendar date range selector	
			j("input[type='text'][name='df-from']").datepicker({firstDay: options.firstDay, dateFormat: "dd M yy", altField: "#df-start-date", altFormat: "yy-mm-dd", changeMonth: true, changeYear: true});
			j("input[type='text'][name='df-to']").datepicker({firstDay: options.firstDay, dateFormat: "dd M yy", altField: "#df-end-date", altFormat: "yy-mm-dd", changeMonth: true, changeYear: true});			
			// "no start/end date" checkboxes
			j("#df-nofrom, input[type='text'][name='df-from']").on('input change', function(event) { 
				start_date = new Date(j("input[type='text'][name='df-from']").val());
				if(j("#df-nofrom").prop('checked')) {
				    start_date = null;
					j("input[type='text'][name='df-from']").val("");
					j("input[type='text'][name='df-from']").prop("disabled", true);
				}
				else j("input[type='text'][name='df-from']").prop("disabled", false);
			});
			j("#df-noto, input[type='text'][name='df-to']").on('input change', function(event) {
				end_date = new Date(j("input[type='text'][name='df-to']").val());
				if(j("#df-noto").prop('checked')) {
					end_date = null;
					j("input[type='text'][name='df-to']").val("");
					j("input[type='text'][name='df-to']").prop("disabled", true);
				}
				else j("input[type='text'][name='df-to']").prop("disabled", false);
			});
			fs_period = "Date range";
		}
	
		/* Days tab */
		if(tab_id=="days") {
			// today/yesterday
			j("input[type='radio']").on('input change', function(event) {
				j("#df-includetoday").prop('checked', false)
				var rctl = j(this);
				switch (rctl.prop('id')) {
					case 'df-today-val':
						if(rctl.prop('checked')) {
							start_date = end_date = today;
							fs_period = "Today";
						}
						break;
					case 'df-yesterday-val':
						if(rctl.prop('checked')) { 
							start_date = end_date = addDays(today, -1);
							fs_period = "Yesterday";
						}
						break;
				}
			});
			// last n days
			j("input[name='df-last']").focus(function() {
				j("input[type='radio']#df-lastndays-val").prop("checked", true);
			});
			j("input[name='df-last'], input#df-includetoday").on('input change', function() {
			    var pdays = j("input[name='df-last']").val();
				start_date = addDays(today, -pdays);
				fs_period = "Last " + pdays + " day(s) ";
				if(!j("#df-includetoday").prop('checked')) {
					end_date = addDays(today, -1);
					fs_period += "excluding ";
				}
				else {
					end_date = today;
					fs_period += "including ";
				}
				fs_period += "today";
			});
		}
		
		/* Weeks tab */
		if(tab_id=="weeks") {
			// calendar weeks selector
			j(function() {
				var selectCurrentWeek = function() {
					window.setTimeout(function () {
						j('.week-picker').find('.ui-datepicker-current-day a').addClass('ui-state-active')
					}, 1);
				}
				
				j('.week-picker').datepicker( {
				    showWeek: true,
					firstDay: options.firstDay, 
					showOtherMonths: true,
					selectOtherMonths: true,
					changeMonth: true,
                    changeYear: true,
					onSelect: function(dateText, inst) { 
					    j("input[type='radio']#df-selectweek-val").prop("checked", true);					
						var date = j(this).datepicker('getDate');
						start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
						end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);						
						selectCurrentWeek();
						fs_period = capitalizeFirstLetter(options.calendarType) + " week";
					},
					beforeShowDay: function(date) {
						var cssClass = '';
						if(date >= start_date && date <= end_date)
							cssClass = 'ui-datepicker-current-day';
						return [true, cssClass];
					},
					onChangeMonthYear: function(year, month, inst) {
						selectCurrentWeek();
					}
				});
				
				j('.week-picker .ui-datepicker-calendar tr').on('mousemove', function() { j(this).find('td a').addClass('ui-state-hover'); });
				j('.week-picker .ui-datepicker-calendar tr').on('mouseleave', function() { j(this).find('td a').removeClass('ui-state-hover'); });
			});

			// WTD
			j("#df-weektodate-val").on('input change', function (event) {
				if(j(this).prop('checked')) {
					start_date = addDays(today, -today.getDay());	
					end_date = today;
					fs_period = "Current " + options.calendarType + " week to date";
				}
			});
			
			// populate previous weeks select (1-99)
			var prev_week_select = j("select[name='df-pweek']");
			for(var i=1; i<100; i++) {
				prev_week_select.append('<option value="' + i + '">' + i + '</option>');
			}
			
			// previous n weeks
			j("input[type='radio']#df-previousweek-val, select[name='df-pweek']").on('focus input change', function() {
			    j("input[type='radio']#df-previousweek-val").prop("checked", true);		    
				var pweeks = j("select[name='df-pweek']").val();
				end_date = addDays(today, -today.getDay() - 1);
				start_date = addDays(end_date, -7 * pweeks + 1);
				fs_period = "Previous " + pweeks + " " + options.calendarType + " weeks(s) ";
			});			
		}
		
		/* Months tab */
		if(tab_id=="months") {
			// populate months select and set current month by default
			var month_select = j("select[name='df-month']");
			var month_arr = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
			for(var i=0; i<12; i++) {
				month_select.append('<option value="' + i + '">' + month_arr[i] + '</option>');
			}
			month_select.val(current_month);
			
			// populate months tab year select and set current year by default
			var myear_select = j("select[name='df-myears']");
			for(var i=current_year; i>=current_year-16; i--) {
				myear_select.append('<option value="' + i + '">' + i + '</option>');
			}
					
			// populate previous months select (1-99)
			var prev_month_select = j("select[name='df-pmonth']");
			for(var i=1; i<100; i++) {
				prev_month_select.append('<option value="' + i + '">' + i + '</option>');
			}
			
			// select month and year
			j("input[type='radio']#df-selectmonth-val, select[name='df-month'], select[name='df-myears']").on('input change', function() {
				j("input[type='radio']#df-selectmonth-val").prop("checked", true);						
			    var mmonth = j("select[name='df-month']").val();
				var myear = j("select[name='df-myears']").val(); 
				start_date = new Date(myear, mmonth, 1);			
				end_date = new Date(myear, mmonth, daysInMonth(mmonth, myear));
				fs_period = month_arr[mmonth] + " " + myear;
			});
			
			// MTD
			j("#df-monthtodate-val").on('input change', function (event) {
				if(j(this).prop('checked')) {
					end_date = today;
					start_date = new Date(current_year, current_month, 1);	
					fs_period = "Current " + options.calendarType + " month to date";
				}
			});
			
			// previous n months
			j("input[type='radio']#df-previousmonth-val, select[name='df-pmonth']").on('focus input change', function() {
			    j("input[type='radio']#df-previousmonth-val").prop("checked", true);
				var pmonths = j("select[name='df-pmonth']").val();	
				start_date = new Date(current_year, current_month - pmonths, 1);			
				end_date = new Date(current_year, current_month - 1, daysInMonth(current_month - 1, current_year));
				fs_period = "Previous " + pmonths + " " + options.calendarType + " month(s)";
			});
		}
		
		/* Quarters tab */
		if(tab_id=="quarters") {
			// populate quarters tab year select and set current year by default
			var cqyear_select = j("select[name='df-cyear']");
			var fqyear_select = j("select[name='df-fyear']");
			for(var i=current_year; i>=current_year-16; i--) {
				cqyear_select.append('<option value="' + i + '">' + i + '</option>');
				fqyear_select.append('<option value="' + i + '">FY' + i + '</option>');
			}
			
			// populate previous quarters select (1-99)
			var prev_quarter_select = j("select[name='df-pqtr']");
			for(var i=1; i<100; i++) {
				prev_quarter_select.append('<option value="' + i + '">' + i + '</option>');
			}	

			// select quarter and year
			j("input[type='radio']#df-selectqtr-val, select[name='df-cqtr'], select[name='df-cyear']").on('input change', function() {
				j("input[type='radio']#df-selectqtr-val").prop("checked", true);
			    var quarter = j("select[name='df-cqtr']").val();
				var qyear = j("select[name='df-cyear']").val(); 
				var sqm = (quarter - 1) * 3;
				var eqm = sqm + 2;
				start_date = new Date(qyear, sqm, 1);			
				end_date = new Date(qyear, eqm, daysInMonth(eqm, qyear));
				fs_period = capitalizeFirstLetter(options.calendarType) + " Q" + quarter + " " + qyear;
			});
			
			// QTD
			j("#df-currentqtrtodate-val").on('input change', function (event) {
				if(j(this).prop('checked')) {
					end_date = today;
					start_date = new Date(current_year, Math.floor(current_month/3)*3, 1);	
					fs_period = "Current " + options.calendarType + " quarter to date";
				}
			});
			
			// previous n quarters
			j("input[type='radio']#df-prevqtr-val, select[name='df-pqtr']").on('focus input change', function() {
			    j("input[type='radio']#df-prevqtr-val").prop("checked", true);   
				var lastpqmonth = Math.floor(current_month/3)*3-1;
				var pquarters = j("select[name='df-pqtr']").val();	
				end_date = new Date(current_year, lastpqmonth, daysInMonth(lastpqmonth, current_year));	
				start_date = new Date(current_year, lastpqmonth - pquarters*3 + 1, 1);			
				fs_period = "Previous " + pquarters + " " + options.calendarType + " quarter(s)";
			});
		}
		
		/* Years tab */
		if(tab_id=="years") {
			// populate years tab year select and set current year by default
			var cyear_select = j("select[name='df-oneyear']");
			var fyear_select = j("select[name='df-fisoneyear']");
			for(var i=current_year; i>=current_year-16; i--) {
				cyear_select.append('<option value="' + i + '">' + i + '</option>');
				fyear_select.append('<option value="' + i + '">FY ' + i + '</option>');
			}
			
			// populate previous years select (1-99)
			var prev_year_select = j("select[name='df-pryear']");
			for(var i=1; i<100; i++) {
				prev_year_select.append('<option value="' + i + '">' + i + '</option>');
			}		
			
			// select year
			j("input[type='radio']#df-selectyear-val, select[name='df-oneyear']").on('input change', function() {
				j("input[type='radio']#df-selectyear-val").prop("checked", true);			
			    var yyear = j("select[name='df-oneyear']").val();
				start_date = new Date(yyear, 0, 1);			
			    end_date = new Date(yyear, 11, 31);
				fs_period = capitalizeFirstLetter(options.calendarType) + " year " + yyear;
			});
			
			// YTD
			j("#df-currentyrtodate-val").on('input change', function (event) {
				if(j(this).prop('checked')) {
					end_date = today;  
					start_date = new Date(current_year, 0, 1);	
					fs_period = "Current " + options.calendarType + " year to date";
				}
			});
			
			// previous n years
			j("input[type='radio']#df-prevyr-val, select[name='df-pryear']").on('focus input change', function() {
			    j("input[type='radio']#df-prevyr-val").prop("checked", true);   
				var pyears = j("select[name='df-pryear']").val();	
				start_date = new Date(current_year - pyears, 0, 1);			
				end_date = new Date(current_year - 1, 11, 31);
				fs_period = "Previous " + pyears + " " + options.calendarType + " year(s)";
			});
		}
	});	
	
	function createJSON() {
		jsonObj = [];
		item = {}
		item["current_start_date"] = j.datepicker.formatDate("yy-mm-dd", start_date);
		item["current_end_date"] = j.datepicker.formatDate("yy-mm-dd", end_date);
        item["current_period"] = period;
		jsonObj.push(item);
		return jsonObj;
	}
	
	function createFilterSummaryString() {
		var str = "";
		if(start_date == null && end_date == null)	str = "All dates";
		else {
			if (start_date == end_date) str += j.datepicker.formatDate("dd M yy", start_date);
			else {
				if(start_date == null) {
					if(period == "daterange") str += "No Start Date";
				}		
				else str += j.datepicker.formatDate("dd M yy", start_date);
				str += "-";
				if(end_date == null) {
					if(period == "daterange") str += "No End Date";
				}
				else str += j.datepicker.formatDate("dd M yy", end_date);
			}
			str += " " + fs_period;
		}
		return str;
	}
	
	j(".df-confirm").click(function (event) {
		if(start_date == null && end_date == null) {
			str = "All dates";
			j(':input')
				 .not(':button, :submit, :reset, :hidden')
				 .val('')
				 .removeAttr('checked')
				 .removeAttr('selected')
				 .removeAttr('disabled');
			j(".df-module").removeClass(function(index, css) {
				return (css.match(/(^|\s)df-active-\S+/g) || []).join(' ');
			});
			j(".df-module").addClass("df-active-nofilter");
			j(".df-module, .df-panel-contain").hide();
		}
		var json = createJSON();
		j(".df-json").val(JSON.stringify(json));
		var fsum = createFilterSummaryString();
		j("#rbr-global-date-filter").html(fsum);
		j(".df-module").hide();
	});		
});