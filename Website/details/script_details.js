//Standard initialization function
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

//Events launched after page as finished loading
window.addEventListener('load', function() {
	setTimeout(function(){flag_loader("../../data/final_flags.csv")}, 100);
	setTimeout(function(){document.getElementById("js_flag_scroll").style.opacity = "1"}, 3700);
});

// switch to an other tab of the website
const change_tab = function(name) {
	if (name === "HISTORY") {
		window.open("../../index.html", '_self');
	} else if (name === "MAP") {
		window.open("../visualizations/index_visu.html", '_self');
	}
}

// variable for competition checkboxes and flag buttons management
let disabled_checkboxes = new Set();
let currBtnTeamId = null;

// variables for games data loading and D3.js svg bar plots and their title
let games;
let data = null;
let data1 = null;
let data2 = null;
let graph_name;

// variables used for the two teams comparison case
let currBtnTeamId2 = null;
let temp;

// holds the number of country selected
let target_countries = new Set();
let iterator;

// function triggered when modifying the first team in the two teams comparison section
function changeVS1() {
	iterator = target_countries.values();
	temp = iterator.next().value;
	if (document.getElementById("search_bar").value !== "") {
		document.getElementById("search_bar").value = "";
		input_listener();
	}
	document.getElementById(temp).click();
}

// function triggered when modifying the second team in the two teams comparison section
function changeVS2() {
	iterator = target_countries.values();
	temp = iterator.next().value;
	temp = iterator.next().value;
	if (document.getElementById("search_bar").value !== "") {
		document.getElementById("search_bar").value = "";
		input_listener();
	}
	document.getElementById(temp).click();
}

// function triggered when selection a second team for the two teams comparison feature
function changeVS() {
	let i;

	// Resetting radio buttons and checkboxes
	disabled_checkboxes.clear();
	for(i = 0; i < measures.length; i++) {
		currBtnId = measures[i] + " button";
		currBtn = document.getElementById(currBtnId);
		currBtn.checked = false;
		currBtn.disabled = false;
	}
	for(i = 0; i < competitions.length; i++) {
		currBtnId = competitions[i] + " button";
		currBtn = document.getElementById(currBtnId);
		currBtn.checked = false;
		currBtn.disabled = false;
	}

	// getting the identifier of the two selected flags
	iterator = target_countries.values();
	currBtnTeamId = iterator.next().value;
	currBtnTeamId2 = iterator.next().value;

	// setting header presentation of the displayed screen
	document.getElementById("nameCountry1").innerHTML = currBtnTeamId;
	document.getElementById("nameCountry2").innerHTML = currBtnTeamId2;

	for (i=0; i<total_flag_number; i++) {
		if (flags[i]['Country'] === currBtnTeamId) {
			document.getElementById("flagVS1").innerHTML = "<img src=\""+flags[i]['ImageURL']+"\">";
			break;
		}
	}
	for (i=0; i<total_flag_number; i++) {
		if (flags[i]['Country'] === currBtnTeamId2) {
			document.getElementById("flagVS2").innerHTML = "<img src=\""+flags[i]['ImageURL']+"\">";
			break;
		}
	}

	document.getElementById("dataBoard").style.display = "none";
	document.getElementById("dataTeam").style.display = "none";
	document.getElementById("dataVS").style.display = "block";

	document.getElementById("flagTeam").style.pointerEvents = "none";
	document.getElementById("flagVS1").style.pointerEvents = "auto";
	document.getElementById("flagVS2").style.pointerEvents = "auto";
}

// function triggered when removing a team for the selection and going back to one team analysis feature
function cancelVS() {
	currBtnTeamId = null;
	currBtnTeamId2 = null;
	document.getElementById("flagVS1").style.pointerEvents = "none";
	document.getElementById("flagVS2").style.pointerEvents = "none";
	document.getElementById("flagVS1").innerHTML = "";
	document.getElementById("flagVS2").innerHTML = "";
	document.getElementById("nameCountry1").innerHTML = "";
	document.getElementById("nameCountry2").innerHTML = "";
	document.getElementById("tableTwoTeams").innerHTML = "";
	set_team();
}

// function triggered when a country is selected
function set_team() {
	let i;

	// if we have now selected two countries we enter into teams comparison feature
	if (target_countries.size === 2) {
		changeVS();

	// else we are entering into one team analysis section
	} else {

		// Removing existing D3.js bar plots
		if (document.getElementById("bar_plot_graphic_team") != null) {
			d3.select("#bar_plot_graphic_team").remove();
		}

		// Resetting radio buttons and checkboxes, and transforming radio button into checkboxes for the single team bar plot section
		Array.from(document.getElementById("measure_container").getElementsByTagName('div')[0].getElementsByTagName('label')).forEach((item, i) => {
			item.getElementsByTagName('input')[0].type="checkbox";
			item.getElementsByTagName('input')[0].classList = [];
			item.getElementsByTagName('input')[0].classList.add("option-input");
			item.getElementsByTagName('input')[0].classList.add("checkbox");
		});
		if (currBtnTeamId == null) {
			disabled_checkboxes.clear();
			for(i = 0; i < measures.length; i++) {
				currBtnId = measures[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.checked = false;
				currBtn.disabled = false;
			}
			for(i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.checked = false;
				currBtn.disabled = false;
			}
		}

		// getting value of selected country
		iterator = target_countries.values();
		currBtnTeamId = iterator.next().value;

		document.getElementById("dataBoard").style.display = "none";
		document.getElementById("dataTeam").style.display = "block";
		document.getElementById("dataVS").style.display = "none";

		document.getElementById("generate_container").style.visibility = "hidden";

		// seeting header presentation of the displayed screen
		document.getElementById("flagTeam").style.pointerEvents = "auto";
		document.getElementById("graphTitleOneTeam").innerHTML = currBtnTeamId;

		for (i=0; i<total_flag_number; i++) {
			if (flags[i]['Country'] === currBtnTeamId) {
				document.getElementById("flagTeam").innerHTML = "<img src=\""+flags[i]['ImageURL']+"\">";
				break;
			}
		}
	}
}

// function triggered when entering world mode which is the section with bar plots of every team and which focused exclusively on one criterion at a time
const world_mode = function() {
	let i;

	document.getElementById("flagTeam").innerHTML = "";
	document.getElementById("graphTitleOneTeam").innerHTML = "";

	// Removing existing bar plot
	if (document.getElementById("bar_plot_graphic") != null) {
		d3.select("#bar_plot_graphic").remove();
	}

	// Resetting radio buttons and checkboxes, and transforming checkboxes button into radios for the world bar plot section
	Array.from(document.getElementById("measure_container").getElementsByTagName('div')[0].getElementsByTagName('label')).forEach((item, i) => { /*Modif Vincent*/
		item.getElementsByTagName('input')[0].type="radio";
		item.getElementsByTagName('input')[0].classList = [];
		item.getElementsByTagName('input')[0].classList.add("option-input");
		item.getElementsByTagName('input')[0].classList.add("radio");
	});
	disabled_checkboxes.clear();
	let currBtnId;
	let currBtn;
	for (i = 0; i < measures.length; i++) {
		currBtnId = measures[i] + " button";
		currBtn = document.getElementById(currBtnId);
		currBtn.checked = false;
		currBtn.disabled = false;
	}
	for(i = 0; i < competitions.length; i++) {
		currBtnId = competitions[i] + " button";
		currBtn = document.getElementById(currBtnId);
		currBtn.checked = false;
		currBtn.disabled = false;
	}

	currBtnTeamId = null;
	currBtnTeamId2 = null;
	data = null;
	document.getElementById("dataTeam").style.display = "none";
	document.getElementById("dataBoard").style.display = "block";
	document.getElementById("dataVS").style.display = "none";

	document.getElementById("generate_container").style.visibility = "visible";
}

// data loader for games stats
const data_loader = function(path) {
	d3.csv(path).then(function(dataset) {

		//Assigning the loaded data to the local database
		games = dataset;
	});
};

// launch the corresponding data parsing function according to the situation we are
const load_data = function() {

	// No country selected
	if (currBtnTeamId == null) {
		load_data_world();

	// one country selected
	} else if (currBtnTeamId2 == null) {
		load_data_one_country()

	// two countries selected
	} else {
		load_data_two_countries()
	}
}

// data parsing for two teams comparison section
const load_data_two_countries = function() {

	// resetting previous data display
	document.getElementById("tableTwoTeams").innerHTML = "";

	// Removing existing D3.js bar plots
	if (document.getElementById("bar_plot_graphic_team") != null) {
		d3.select("#bar_plot_graphic_team").remove();
	}
	if (document.getElementById("bar_plot_graphic") != null) {
		d3.select("#bar_plot_graphic").remove();
	}

	// retrieving data for the two selected nations
	data1 = get_one_country_data(games, currBtnTeamId);
	data2 = get_one_country_data(games, currBtnTeamId2);

	if (data1.length === 0 || data2.length === 0 || data1.length !== data2.length) {
		data1 = null;
		data2 = null;
		return;
	}

	let i;
	let x;
	let y;
	let z;
	let table = document.getElementById("tableTwoTeams");

	// building the stats table for comparison
	table.innerHTML= "";
	for (i=0; i<data1.length; i++) {
		row = document.createElement('tr');
		table.appendChild(row);
  	x = row.insertCell(0);
  	x.innerHTML = data1[i]['value'];
		y = row.insertCell(1);
		y.style.width="30vw"
		y.style.height="5vh"
  	y.innerHTML = data1[i]['name'];
		z = row.insertCell(2);
  	z.innerHTML = data2[i]['value'];
		if (data1[i]['value'] > data2[i]['value']) {
			x.style.backgroundColor="rgba(255,0,0,0.25)";
			z.style.backgroundColor="rgba(0,0,255,0.25)";
		} else if (data1[i]['value'] < data2[i]['value']) {
			x.style.backgroundColor="rgba(0,0,255,0.25)";
			z.style.backgroundColor="rgba(255,0,0,0.25)";
		} else {
			x.style.backgroundColor="rgba(255,255,0,0.25)";
			z.style.backgroundColor="rgba(255,255,0,0.25)";
		}
	}
}

// data parsing for one team comparison section
const get_one_country_data = function(data_i, chosen_team) {
	let retrieved_data = [];
	let measure_set = new Set();
	let competition_set = new Set();

	// getting measure parameters
	measures.forEach((item, i) => {
		if (document.getElementById(measures[i] + " button").checked) {
			measure_set.add(measures[i]);
		}
	});

	// getting competition parameters
	competitions.forEach((item, i) => {
		if (document.getElementById(competitions[i] + " button").checked) {
			competition_set.add(competitions[i]);
		}
	});

	// Do nothing if the user didn't select any criterion nor competition
	if (measure_set.size === 0 || competition_set.size === 0) {
		return retrieved_data;
	}

	// handle a small issue with the speciall competition checkbox "All" which checks and uncheck automatically every other competition checkboxes
	if (competition_set.has("All")) {
		competitions.forEach((item, i) => {
			if (i !== 0) {
				competition_set.add(competitions[i]);
			}
		});
	}

	let team = chosen_team;

	let year;
	let start_year = document.getElementById("slider_text").textContent.substring(0, 4);
	let end_year = document.getElementById("slider_text").textContent.substring(7, 11);

	document.getElementById("graphTitleOneTeam").innerHTML = currBtnTeamId +
		" team statistics between " +
		start_year +
		" and " +
		end_year;

	let counter;
	let counter_match;
	let counter_loc;
	let counter_loc_match;

	let num;
	let roundedString;
	let rounded;
	let num_loc;
	let roundedString_loc;
	let rounded_loc;
	let num_factor;
	let roundedString_factor;
	let rounded_factor;

	let valid_years;
	let found;
	let i;
	let j;

	let wc_winners = [{"country": "Brazil", "wins": [1958, 1962, 1970, 1994, 2002]},
		{"country": "Germany", "wins": [1954, 1974, 1990, 2014]},
		{"country": "Italy", "wins": [1934, 1938, 1982, 2006]},
		{"country": "France", "wins": [1998, 2018]},
		{"country": "Argentina", "wins": [1978, 1986]},
		{"country": "Uruguay", "wins": [1930, 1950]},
		{"country": "Spain", "wins": [2010]},
		{"country": "England", "wins": [1966]}];

	// executing main data retrieving computation where all the selected measures have to be handled for each row of the dataset for the one team analysis feature
	measure_set.forEach(measure => {
			counter = 0;
			counter_match = 0;
			counter_loc = 0;
			counter_loc_match = 0;

			valid_years = new Set();

			games.forEach(row => {
				year = row.date.substring(0, 4);

				if ((row.away_team === team || row.home_team === team) && (competition_set.has(row.tournament)) && (year >= start_year) && (year <= end_year)) {
					if (measure === "Matches Played") {
						counter++;
					} else if (measure === "Wins") {
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.away_score) < parseInt(row.home_score))) {
							counter++;
						}
					} else if (measure === "Draws") {
						if (parseInt(row.away_score) === parseInt(row.home_score)) {
							counter++;
						}
					} else if (measure === "Losses") {
						if ((row.away_team === team && parseInt(row.away_score) < parseInt(row.home_score)) || (row.home_team === team && parseInt(row.away_score) > parseInt(row.home_score))) {
							counter++;
						}
					} else if (measure === "Goals Scored") {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
					} else if (measure === "Goals Conceded") {
						if (row.home_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
					} else if (measure === "Ratio Win Per Match") {
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (measure === "Ratio Draw Per Match") {
						if (parseInt(row.home_score) === parseInt(row.away_score)) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (measure === "Ratio Loss Per Match") {
						if ((row.away_team === team && parseInt(row.away_score) < parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) < parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (measure === "Ratio Goal Scored Per Match") {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
						counter_match++;
					} else if (measure === "Ratio Goal Scored Per Year") {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
						valid_years.add(year);
					} else if (measure === "Ratio Goal Conceded Per Match") {
						if (row.away_team === team) {
							counter += parseInt(row.home_score);
						} else {
							counter += parseInt(row.away_score);
						}
						counter_match++;
					} else if (measure === "Ratio Goal Conceded Per Year") {
						if (row.away_team === team) {
							counter += parseInt(row.home_score);
						} else {
							counter += parseInt(row.away_score);
						}
						valid_years.add(year);
					} else if (measure === "Home Wins") {
						if (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Home Draws") {
						if (row.home_team === team && parseInt(row.home_score) === parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Home Losses") {
						if (row.home_team === team && parseInt(row.home_score) < parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Away Wins") {
						if (row.away_team === team && parseInt(row.home_score) < parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Away Draws") {
						if (row.away_team === team && parseInt(row.home_score) === parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Away Losses") {
						if (row.away_team === team && parseInt(row.home_score) > parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Performance Factor Home Matches") {
						// Ratio win per match playing home
						if (row.home_team === team && row.neutral === "False") {
							if (parseInt(row.home_score) > parseInt(row.away_score)) {
								counter_loc++;
								counter_loc_match++;
							} else {
								counter_loc_match++;
							}
						}

						// Ratio win per match
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}

					} else if (measure === "Performance Factor Away Matches") {
						// Ratio win per match playing away
						if (row.away_team === team && row.neutral === "False") {
							if (parseInt(row.home_score) < parseInt(row.away_score)) {
								counter_loc++;
								counter_loc_match++;
							} else {
								counter_loc_match++;
							}
						} else if (measure === "Tournament Matches Played") {
							if (row.tournament !== "Friendly") {
								counter++;
							}
						} else if (measure === "Major Tournaments Played") {
							if (row.tournament === "FIFA World Cup" || row.tournament === "UEFA Euro" ||
								row.tournament === "Copa América" || row.tournament === "African Cup of Nations" ||
								row.tournament === "Gold Cup" || row.tournament === "AFC Asian Cup" || row.tournament === "Oceania Nations Cup") {
								valid_years.add(year);
							}
						} else if (measure === "World Cup Tournaments Won") {
							if (found === 0) {
								for (let i=0; i < wc_winners.length; i++) {
									if (team === wc_winners[i]["country"]) {
										found = 1;
										for (let j=0; j < wc_winners[i]["wins"].length; j++) {
											if (wc_winners[i]["wins"][j] >= start_year && wc_winners[i]["wins"][j] <= end_year) {
												counter++;
											}
										}
										break;
									}
								}
							}
						}

						// Ratio win per match
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}

					} else if (measure === "Friendly Home Matches Played") {
						if (row.tournament === "Friendly" && row.home_team === team && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Friendly Away Matches Played") {
						if (row.tournament === "Friendly" && row.away_team === team && row.neutral === "False") {
							counter++;
						}
					} else if (measure === "Friendly Neutral Matches Played") {
						if (row.tournament === "Friendly" && row.neutral === "True") {
							counter++;
						}
					} else if (measure === "Tournament Matches Played") {
						if (row.tournament !== "Friendly") {
							counter++;
						}
					} else if (measure === "Major Tournaments Played") {
						if (row.tournament === "FIFA World Cup" || row.tournament === "UEFA Euro" || row.tournament === "Copa América" || row.tournament === "African Cup of Nations" ||								row.tournament === "Oceania Nations Cup") {
							valid_years.add(year);
						}
					} else if (measure === "World Cup Tournaments Won") {
						for (i=0; i < wc_winners.length; i++) {
							if (team === wc_winners[i]["country"]) {

								for (j=0; j < (wc_winners[i]["wins"]).length; j++) {
									if (parseInt(year) === (wc_winners[i]["wins"])[j]) {

										valid_years.add(year);
									}
								}
							}
						}
					}
				}

			});

			if (measure === "Major Tournaments Played") {
				retrieved_data.push({"name": measure, "value": valid_years.size});

			} else if (measure === "Ratio Win Per Match" || measure === "Ratio Draw Per Match" || measure === "Ratio Loss Per Match") {
				if (counter_match === 0) {
					retrieved_data.push({"name": measure, "value": 0});
				} else {
					num = Number(counter/counter_match);
					roundedString = num.toFixed(2);
					rounded = Number(roundedString);

					retrieved_data.push({"name": measure, "value": rounded});
				}

			} else if (measure === "Performance Factor Home Matches" || measure === "Performance Factor Away Matches") {
				if (counter_match === 0 || counter_loc_match === 0) {
					retrieved_data.push({"name": measure, "value": 0});
				} else {
					num_loc = Number(counter_loc/counter_loc_match);
					roundedString_loc = num_loc.toFixed(2);
					rounded_loc = Number(roundedString_loc);

					num = Number(counter/counter_match);
					roundedString = num.toFixed(2);
					rounded = Number(roundedString);

					num_factor = Number(rounded_loc/rounded);
					roundedString_factor = num_factor.toFixed(2);
					rounded_factor = Number(roundedString_factor);

					retrieved_data.push({"name": measure, "value": rounded_factor});
				}

			}	else if (measure === "Ratio Goal Scored Per Match" || measure === "Ratio Goal Conceded Per Match") {
				if (counter_match === 0) {
					retrieved_data.push({"name": measure, "value": 0});
				} else {
					num = Number(counter/counter_match);
					roundedString = num.toFixed(2);
					rounded = Number(roundedString);

					retrieved_data.push({"name": measure, "value": rounded});
				}

			} else if (measure === "Ratio Goal Scored Per Year" || measure === "Ratio Goal Conceded Per Year") {
				if (valid_years.size === 0) {
					retrieved_data.push({"name": measure, "value": 0});
				} else {
					num = Number(counter/valid_years.size);
					roundedString = num.toFixed(2);
					rounded = Number(roundedString);

					retrieved_data.push({"name": measure, "value": rounded});
				}

			} else if (measure === "World Cup Tournaments Won") {
				retrieved_data.push({"name": measure, "value": valid_years.size});

			} else {
				retrieved_data.push({"name": measure, "value": counter});

			}

	});

	return retrieved_data;
}

// bar plot creation for one country comparison section
const load_data_one_country = function() {

	// removing existing bar plots
	if (document.getElementById("bar_plot_graphic_team") != null) {
		d3.select("#bar_plot_graphic_team").remove();
	}
	if (document.getElementById("bar_plot_graphic") != null) {
		d3.select("#bar_plot_graphic").remove();
	}

	// retrieving collected data
	data = get_one_country_data(games, currBtnTeamId);

	// do nothing if there is no data corresponding to the selected filters
	if (data.length === 0) {
		document.getElementById("graphTitleOneTeam").innerHTML = currBtnTeamId;
		data = null;
		return;
	}

	// sort bars based on value
	data = data.sort(function (a, b) {
		return d3.ascending(a.value, b.value);
	})

	//set up svg with margins
	const margin = {
		top: 0,
		right: 35,
		bottom: 0,
		left: 225
	};

	const width = 850 - margin.left - margin.right,
		height = 30 * data.length - margin.top - margin.bottom;

	const svg = d3.select("#graphicTeam").append("svg")
		.attr("id", "bar_plot_graphic_team")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	const x = d3.scaleLinear()
		.range([0, width])
		.domain([0, d3.max(data, function (d) {
			return d.value;
		})]);

	const y = d3.scaleBand()
		.rangeRound([height, 0])
		.padding(0.2)
		.domain(data.map(function (d) {
			return d.name;
		}));

	// make y axis to show bar names
	const yAxis = d3.axisLeft(y)
		.tickSize(0);

	const gy = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	const bars = svg.selectAll(".bar")
		.data(data)
		.enter()
		.append("g");

	// apply gradient on bars
	const gradient = svg
		.append("linearGradient")
		.attr("x1", 0)
		.attr("x2", 1850)
		.attr("y1", "0")
		.attr("y2", "0")
		.attr("id", "gradient")
		.attr("gradientUnits", "userSpaceOnUse");

	gradient
		.append("stop")
		.attr("offset", "0")
		.attr("stop-color", "rgb(245,254,169)")

	gradient
		.append("stop")
		.attr("offset", "0.35")
		.attr("stop-color", "rgb(147,21,40)")

	// append rects
	bars.append("rect")
		.attr("class", "bar")
		.attr("y", function (d) {
			return y(d.name);
		})
		.attr("height", 20)
		.attr("x", 0)
		.attr("width", function (d) {
			return 0;
		})
		.attr("fill", "url(#gradient)");

	// add a value label to the right of each bar
	bars.append("text")
		.attr("class", "label")
		.attr("fill", "#111")
		.attr("font-weight", "lighter")
		.attr("opacity", "0")
		.attr("y", function (d) {
			return y(d.name) + y.bandwidth() / 2 + 4;
		})
		.attr("x", function (d) {
			return x(d.value) + 3;
		})
		.text(function (d) {
			return d.value;
		});

	// add animations on plot
	svg.selectAll("rect")
		.transition()
		.duration(2500)
		.attr("x", function(d) { return x(d.Value); })
		.attr("width", function(d) { return x(d.value); })
		.delay(function(d,i) {
			return(0);
		});

	svg.selectAll("text")
		.transition()
		.duration(1000)
		.attr("opacity", function(d) { return 1; })
		.delay(function(d,i) {
			return(0);
		});

	bars.selectAll("text")
		.transition()
		.duration(3500)
		.attr("opacity", function(d) { return 1; })
		.delay(function(d,i) {
			return(0);
		});
}

// parsing games stats information for world data feature
const get_world_data = function(data_i) {
	let retrieved_data = [];
	let competition_set = new Set();

	// getting competition parameters onlu since criterions are now radio button because we only manage one criterion at a time
	competitions.forEach((item, i) => {
		if (document.getElementById(competitions[i] + " button").checked) {
			competition_set.add(competitions[i]);
		}
	});

	// Do nothing if no competition is selected
	if (competition_set.size === 0) {
		return retrieved_data;
	}

	// add all the existing teams to a set
	let teams = new Set();
	data_i.forEach(row => {
		teams.add(row.away_team);
		teams.add(row.home_team);
	});

	let year;
	let start_year = document.getElementById("slider_text").textContent.substring(0, 4);
	let end_year = document.getElementById("slider_text").textContent.substring(7, 11);

	let counter;
	let counter_match;
	let counter_loc;
	let counter_loc_match;

	let num;
	let roundedString;
	let rounded;
	let num_loc;
	let roundedString_loc;
	let rounded_loc;
	let num_factor;
	let roundedString_factor;
	let rounded_factor;

	let valid_years;
	let str;
	let i;
	let j;

	let wc_winners = [{"country": "Brazil", "wins": [1958, 1962, 1970, 1994, 2002]}, {"country": "Germany", "wins": [1954, 1974, 1990, 2014]},
		{"country": "Italy", "wins": [1934, 1938, 1982, 2006]},
		{"country": "France", "wins": [1998, 2018]},
		{"country": "Argentina", "wins": [1978, 1986]},
		{"country": "Uruguay", "wins": [1930, 1950]},
		{"country": "Spain", "wins": [2010]},
		{"country": "England", "wins": [1966]}];

	Array.from(document.getElementById("measure_container").getElementsByTagName('div')[0].getElementsByTagName('label')).forEach((item, i) => {
			if ((item.getElementsByTagName('input')[0].checked) === true) {
				str = item.getElementsByTagName('input')[0].id
				graph_name = str.substring(0, str.length - 7) + " between " + start_year + " and " + end_year;
			}
	});

	// executing the main computation for the world data collection where only one criterion at a time can be checked
	teams.forEach(team => {
		counter = 0;
		counter_match = 0;
		counter_loc = 0;
		counter_loc_match = 0;
		valid_years = new Set();
		games.forEach(row => {
				year = row.date.substring(0, 4);

				if ((row.away_team === team || row.home_team === team) && (competition_set.has(row.tournament)) && (year >= start_year) && (year <= end_year)) {
					if (document.getElementById("Matches Played button").checked) {
						counter++;
					} else if (document.getElementById("Wins button").checked) {
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
						}
					} else if (document.getElementById("Draws button").checked) {
						if (parseInt(row.home_score) === parseInt(row.away_score)) {
							counter++;
						}
					} else if (document.getElementById("Losses button").checked) {
						if ((row.away_team === team && parseInt(row.away_score) < parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) < parseInt(row.away_score))) {
							counter++;
						}
					} else if (document.getElementById("Goals Scored button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
					} else if (document.getElementById("Goals Conceded button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.home_score);
						} else {
							counter += parseInt(row.away_score);
						}
					} else if (document.getElementById("Ratio Win Per Match button").checked) {
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (document.getElementById("Ratio Draw Per Match button").checked) {
						if (parseInt(row.home_score) === parseInt(row.away_score)) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (document.getElementById("Ratio Loss Per Match button").checked) {
						if ((row.away_team === team && parseInt(row.away_score) < parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) < parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}
					} else if (document.getElementById("Ratio Goal Scored Per Match button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
						counter_match++;
					} else if (document.getElementById("Ratio Goal Scored Per Year button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.away_score);
						} else {
							counter += parseInt(row.home_score);
						}
						valid_years.add(year);
					} else if (document.getElementById("Ratio Goal Conceded Per Match button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.home_score);
						} else {
							counter += parseInt(row.away_score);
						}
						counter_match++;
					} else if (document.getElementById("Ratio Goal Conceded Per Year button").checked) {
						if (row.away_team === team) {
							counter += parseInt(row.home_score);
						} else {
							counter += parseInt(row.away_score);
						}
						valid_years.add(year);
					} else if (document.getElementById("Home Wins button").checked) {
						if (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Home Draws button").checked) {
						if (row.home_team === team && parseInt(row.home_score) === parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Home Losses button").checked) {
						if (row.home_team === team && parseInt(row.home_score) < parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Away Wins button").checked) {
						if (row.away_team === team && parseInt(row.home_score) < parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Away Draws button").checked) {
						if (row.away_team === team && parseInt(row.home_score) === parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Away Losses button").checked) {
						if (row.away_team === team && parseInt(row.home_score) > parseInt(row.away_score) && row.neutral === "False") {
							counter++;
						}
					} else if (document.getElementById("Performance Factor Home Matches button").checked) {
						// Ratio win per match playing home
						if (row.home_team === team && row.neutral === "False") {
							if (parseInt(row.home_score) > parseInt(row.away_score)) {
								counter_loc++;
								counter_loc_match++;
							} else {
								counter_loc_match++;
							}
						}

						// Ratio win per match
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}

					} else if (document.getElementById("Performance Factor Away Matches button").checked) {
						// Ratio win per match playing away
						if (row.away_team === team && row.neutral === "False") {
							if (parseInt(row.home_score) < parseInt(row.away_score)) {
								counter_loc++;
								counter_loc_match++;
							} else {
								counter_loc_match++;
							}
						}

						// Ratio win per match
						if ((row.away_team === team && parseInt(row.away_score) > parseInt(row.home_score)) || (row.home_team === team && parseInt(row.home_score) > parseInt(row.away_score))) {
							counter++;
							counter_match++;
						} else {
							counter_match++;
						}

					} else if (document.getElementById("Friendly Home Matches Played button").checked) {
						if ((row.home_team === team) && (row.tournament === "Friendly") && (row.neutral === "False")) {
							counter++;
						}
					} else if (document.getElementById("Friendly Away Matches Played button").checked) {
						if ((row.away_team === team) && (row.tournament === "Friendly") && (row.neutral === "False")) {
							counter++;
						}
					} else if (document.getElementById("Friendly Neutral Matches Played button").checked) {
						if ((row.tournament === "Friendly") && (row.neutral === "True")) {
							counter++;
						}
					} else if (document.getElementById("Tournament Matches Played button").checked) {
						if (row.tournament !== "Friendly") {
							counter++;
						}
					} else if (document.getElementById("Major Tournaments Played button").checked) {
						if (row.tournament === "FIFA World Cup" || row.tournament === "UEFA Euro" || row.tournament === "Copa América" || row.tournament === "African Cup of Nations" ||
																																																															row.tournament === "Gold Cup" ||
																																																															row.tournament === "AFC Asian Cup" ||
																																																															row.tournament === "Oceania Nations Cup") {
							valid_years.add(year);
						}
					} else if (document.getElementById("World Cup Tournaments Won button").checked) {
						for (i=0; i < wc_winners.length; i++) {
							if (team === wc_winners[i]["country"]) {

								for (j=0; j < (wc_winners[i]["wins"]).length; j++) {
									if (parseInt(year) === (wc_winners[i]["wins"])[j]) {

										valid_years.add(year);
									}
								}
							}
						}
					}
				}
		})

		if (document.getElementById("Major Tournaments Played button").checked) {
			retrieved_data.push({"name": team, "value": valid_years.size});

		} else if (document.getElementById("Ratio Win Per Match button").checked || document.getElementById("Ratio Draw Per Match button").checked || document.getElementById("Ratio Loss Per Match button").checked) {
			if (counter_match === 0) {
				retrieved_data.push({"name": team, "value": 0});
			} else {
				num = Number(counter/counter_match);
				roundedString = num.toFixed(2);
				rounded = Number(roundedString);

				retrieved_data.push({"name": team, "value": rounded});
			}

		} else if (document.getElementById("Performance Factor Home Matches button").checked || document.getElementById("Performance Factor Away Matches button").checked) {
			if (counter_match === 0 || counter_loc_match === 0) {
				retrieved_data.push({"name": team, "value": 0});
			} else {
				num_loc = Number(counter_loc/counter_loc_match);
				roundedString_loc = num_loc.toFixed(2);
				rounded_loc = Number(roundedString_loc);

				num = Number(counter/counter_match);
				roundedString = num.toFixed(2);
				rounded = Number(roundedString);

				num_factor = Number(rounded_loc/rounded);
				roundedString_factor = num_factor.toFixed(2);
				rounded_factor = Number(roundedString_factor);

				retrieved_data.push({"name": team, "value": rounded_factor});
			}

		}	else if (document.getElementById("Ratio Goal Scored Per Match button").checked || document.getElementById("Ratio Goal Conceded Per Match button").checked) {
			if (counter_match === 0) {
				retrieved_data.push({"name": team, "value": 0});
			} else {
				num = Number(counter/counter_match);
				roundedString = num.toFixed(2);
				rounded = Number(roundedString);

				retrieved_data.push({"name": team, "value": rounded});
			}

		} else if (document.getElementById("Ratio Goal Scored Per Year button").checked || document.getElementById("Ratio Goal Conceded Per Year button").checked) {
			if (valid_years.size === 0) {
				retrieved_data.push({"name": team, "value": 0});
			} else {
				num = Number(counter/valid_years.size);
				roundedString = num.toFixed(2);
				rounded = Number(roundedString);

				retrieved_data.push({"name": team, "value": rounded});
			}

		} else if (document.getElementById("World Cup Tournaments Won button").checked) {
			retrieved_data.push({"name": team, "value": valid_years.size});

		} else {
			retrieved_data.push({"name": team, "value": counter});

		}
	});

	return retrieved_data;
}

// bar plot creation for world data feature
const load_data_world = function() {

	// removing existing D3.js plots
	if (document.getElementById("bar_plot_graphic") != null) {
		d3.select("#bar_plot_graphic").remove();
	}
	if (document.getElementById("bar_plot_graphic_team") != null) {
		d3.select("#bar_plot_graphic_team").remove();
	}

	graph_name = "";

	// collecting data
	data = get_world_data(games);

	// Do nothing is no games matches the request
	if (data.length === 0) {
		alert("Please select a criterion and a competition");
		data = null;
		return;
	}

	// sort bars based on value
	data = data.sort(function (a, b) {
		return d3.ascending(a.value, b.value);
	})

	// set up svg using margins
	const margin = {
		top: 20,
		right: 35,
		bottom: 0,
		left: 200
	};

	const width = 850 - margin.left - margin.right,
		height = 5000 - margin.top - margin.bottom;

	const svg = d3.select("#graphic").append("svg")
		.attr("id", "bar_plot_graphic")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("text")
		.attr("x", (width / 2))
		.attr("y", 0 - (margin.top - 40 / 2))
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("font-weight", "light")
		.style("fill", "#111")
		.text(graph_name);

	const x = d3.scaleLinear()
		.range([0, width])
		.domain([0, d3.max(data, function (d) {
			return d.value;
		})]);

	const y = d3.scaleBand()
		.rangeRound([height, 0])
		.padding(0.2)
		.domain(data.map(function (d) {
			return d.name;
		}));

	// make y axis to show bar names
	const yAxis = d3.axisLeft(y)
		.tickSize(0);

	const gy = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	const bars = svg.selectAll(".bar")
		.data(data)
		.enter()
		.append("g");

	// apply gradient on bars
	const gradient = svg
		.append("linearGradient")
		.attr("x1", 0)
		.attr("x2", 1850)
		.attr("y1", "0")
		.attr("y2", "0")
		.attr("id", "gradient")
		.attr("gradientUnits", "userSpaceOnUse");

	gradient
		.append("stop")
		.attr("offset", "0")
		.attr("stop-color", "rgb(245,254,169)")

	gradient
		.append("stop")
		.attr("offset", "0.35")
		.attr("stop-color", "rgb(147,21,40)")

	// append rects
	bars.append("rect")
		.attr("class", "bar")
		.attr("y", function (d) {
			return y(d.name);
		})
		.attr("height", y.bandwidth())
		.attr("x", 0)
		.attr("width", function (d) {
			return 0;
		})
		.attr("fill", "url(#gradient)");

	// add a value label to the right of each bar
	bars.append("text")
		.attr("class", "label")
		.attr("fill", "#111")
		.attr("font-weight", "light")
		.attr("opacity", "0")
		.attr("y", function (d) {
			return y(d.name) + y.bandwidth() / 2 + 4;
		})
		.attr("x", function (d) {
			return x(d.value) + 3;
		})
		.text(function (d) {
			return d.value;
		});

	// add animations to the plot
	svg.selectAll("rect")
		.transition()
		.duration(2500)
		.attr("x", function(d) { return x(d.Value); })
		.attr("width", function(d) { return x(d.value); })
		.delay(function(d,i) {
			return(0);
		});

	svg.selectAll("text")
		.transition()
		.duration(1000)
		.attr("opacity", function(d) { return 1; })
		.delay(function(d,i) {
			return(0);
		});

	bars.selectAll("text")
		.transition()
		.duration(3500)
		.attr("opacity", function(d) { return 1; })
		.delay(function(d,i) {
			return(0);
		});
}

//Flag database
let flags;
let flags_input = [];
let flag_number;

//Flag loading function
const flag_loader= function(path){
	d3.csv(path).then(function(data) {

		//Assigning the loaded data to the local database
		flags=data;
		total_flag_number = 215;

		//Filling the flags without filtration
		flag_number = flags.length;
		assign_flags(flags, flag_number);
	});
};

//Load the flags with input filter
function input_listener() {
	let input =  document.getElementById("search_bar").value.toLowerCase();

	flags_input = [];
	flags.forEach(row => {
		if(row.Country.substring(0, input.length).toLowerCase()===input) {
			flags_input.push(row);
		}
	});
	flag_number = flags_input.length;

	//Loading the flags
	assign_flags(flags_input, flag_number)
}

// create the flag slider
const assign_flags= function(flags, flag_number) {

	//Reference to the flag container
	let scrollmenu = document.getElementById("js_flag_scroll");
	scrollmenu.classList.add("flag-slider");

	//Delete all children
	scrollmenu.innerHTML = '';
	let cnt = 0;
	while (cnt < flag_number) {
		const wrapper = document.createElement("div");
		wrapper.classList.add('wrapper');

		// top flag
		const square = document.createElement("div");
		square.classList.add('square');
		square.innerHTML = "<img src=\"" + flags[cnt]['ImageURL'] + "\">";
		const button_style = document.createElement("div");
		button_style.classList.add('button-style');
		button_style.innerHTML = flags[cnt]['Country'].substring(0, 3).toUpperCase();
		button_style.id=flags[cnt]['Country'];
		button_style.clicked=target_countries.has(flags[cnt]['Country']);
		if(button_style.clicked) {
			button_style.style.opacity=0;
			button_style.style.background="none";
			button_style.style.border="none";
		}

		button_style.addEventListener('click',function(e){

			let flag=e.target;
			flag.clicked=(!flag.clicked) && target_countries.size<2;
			if (target_countries.size === 2 && !target_countries.has(flag.id)) {
				alert("You cannot select more than two countries at the same time");
			}

			if (flag.clicked){

				//Adding country among the targetted countries when clicked
				target_countries.add(flag.id);
				flag.style.opacity=0;
				flag.style.background="none";
				flag.style.border="none";

				// Reseting the search bar results
				if (document.getElementById("search_bar").value !== "") {
					document.getElementById("search_bar").value = "";
					input_listener();
				}

				set_team();
			} else {

				//Removing the country from the targetted ones
				target_countries.delete(flag.id);
				flag.style="resetStyle";

				// resetting search bar results
				if (document.getElementById("search_bar").value !== "") {
					document.getElementById("search_bar").value = "";
					input_listener();
				}

				// execute the corresponding function according to the number of flags that is now actually selected
				if (target_countries.size === 0) {
					world_mode()
				} else {
					cancelVS();
				}
			}

	  });

		cnt++;

		// bottom flag
		const square2 = document.createElement("div");
		square2.classList.add('square');
		if (cnt < flag_number) square2.innerHTML = "<img src=\"" + flags[cnt]['ImageURL'] + "\">";
		const button_style2 = document.createElement("div");
		button_style2.classList.add('button-style');
		if (cnt < flag_number) {
			button_style2.innerHTML = flags[cnt]['Country'].substring(0, 3).toUpperCase();
			button_style2.id = flags[cnt]['Country'];
			button_style2.clicked=target_countries.has(flags[cnt]['Country']);
			if(button_style2.clicked){
				button_style2.style.opacity=0;
				button_style2.style.background="none";
				button_style2.style.border="none";
			}

			button_style2.addEventListener('click',function(e){

				let flag=e.target;
				flag.clicked=(!flag.clicked) && target_countries.size<2;
				if (target_countries.size === 2 && !target_countries.has(flag.id)) {
					alert("You cannot select more than two countries at the same time");
				}

				if (flag.clicked){

					//Adding country to targetted countries
					target_countries.add(flag.id);
					flag.style.opacity=0;
					flag.style.background="none";
					flag.style.border="none";

					// resetting search bar results
					if (document.getElementById("search_bar").value !== "") {
						document.getElementById("search_bar").value = "";
						input_listener();
					}

					set_team();
				} else {

					//Removing country from targetted countries
					target_countries.delete(flag.id);
					flag.style="resetStyle";

					// resetting search bar results
					if (document.getElementById("search_bar").value !== "") {
						document.getElementById("search_bar").value = "";
						input_listener();
					}

					// execute corresponding function according to the number of flags that is now actually selected
					if (target_countries.size === 0) {
						world_mode();
					} else {
						cancelVS();
					}
				}

			});
		};

		cnt++;

		// create a column of flags for the flag slider
		square.appendChild(button_style);
		if (cnt <= flag_number) square2.appendChild(button_style2);
		wrapper.appendChild(square);
		wrapper.appendChild(square2);
		scrollmenu.appendChild(wrapper);
	}
};

//List of criterions/measures
measures=["Matches Played", "Wins", "Draws", "Losses", "Goals Scored", "Goals Conceded",
	"Ratio Win Per Match", "Ratio Draw Per Match", "Ratio Loss Per Match",
	"Ratio Goal Scored Per Match", "Ratio Goal Scored Per Year", "Ratio Goal Conceded Per Match", "Ratio Goal Conceded Per Year",
	"Home Wins", "Home Draws", "Home Losses", "Away Wins", "Away Draws", "Away Losses",
	"Performance Factor Home Matches", "Performance Factor Away Matches",
	"Friendly Home Matches Played", "Friendly Away Matches Played", "Friendly Neutral Matches Played",
	"Tournament Matches Played", "Major Tournaments Played", "World Cup Tournaments Won"];

//List of competitions
competitions=['All', 'Friendly',
	'FIFA World Cup', 'UEFA Euro', 'Copa América', 'African Cup of Nations', 'Gold Cup', 'AFC Asian Cup', 'Oceania Nations Cup',
	'FIFA World Cup qualification', 'UEFA Euro qualification', 'Copa América qualification', 'African Cup of Nations qualification',
	'Gold Cup qualification', 'AFC Asian Cup qualification',	'Oceania Nations Cup qualification',
	'ABCS Tournament', 'AFC Challenge Cup', 'AFC Challenge Cup qualification',
	'AFF Championship', 'AFF Championship qualification',
	'African Nations Championship', 'African Nations Championship qualification',
	'Amílcar Cabral Cup',	'Atlantic Cup', 'Balkan Cup', 'Baltic Cup',
	'Brazil Independence Cup', 'British Championship',
	'CCCF Championship', 'CECAFA Cup', 'CFU Caribbean Cup',
	'CFU Caribbean Cup qualification', 'CONCACAF Championship',
	'CONCACAF Championship qualification', 'CONCACAF Nations League',
	'CONCACAF Nations League qualification', 'COSAFA Cup',
	'Confederations Cup', 'Copa Artigas', "Copa Bernardo O'Higgins",
	'Copa Carlos Dittborn', 'Copa Chevallier Boutell', 'Copa Félix Bogado',
	'Copa Juan Pinto Durán', 'Copa Lipton', 'Copa Newton',
	'Copa Oswaldo Cruz', 'Copa Paz del Chaco',
	'Copa Premio Honor Argentino', 'Copa Premio Honor Uruguayo',
	'Copa Ramón Castilla', 'Copa Rio Branco', 'Copa Roca',
	'Copa del Pacífico', 'Cyprus International Tournament',
	'Dragon Cup', 'Dunhill Cup', 'Dynasty Cup', 'EAFF Championship',
	'GaNEFo', 'Gulf Cup', 'Indonesia Tournament', 'Intercontinental Cup',
	'International Cup', 'Island Games',
	'Jordan International Tournament', 'King Hassan II Tournament',
	"King's Cup", 'Kirin Cup', 'Korea Cup', 'Lunar New Year Cup',
	'Malta International Tournament', 'Merdeka Tournament',
	'Merlion Cup', 'Millennium Cup', 'Mundialito', 'NAFU Championship',
	'Nations Cup', 'Nehru Cup', 'Nile Basin Tournament',
	'Nordic Championship', 'OSN Cup', 'Pacific Games',
	'Pan American Championship', "Prime Minister's Cup", 'Rous Cup',
	'SAFF Cup', 'SKN Football Festival', 'Simba Tournament',
	'South Pacific Games', 'Tournoi de France', 'UAFA Cup',
	'UAFA Cup qualification', 'UDEAC Cup', 'UEFA Nations League',
	'UNCAF Cup', 'UNIFFAC Cup', 'USA Cup',
	'United Arab Emirates Friendship Tournament', 'VFF Cup',
	'Vietnam Independence Cup', 'WAFF Championship',
	'West African Cup', 'Windward Islands Tournament'];

//Criterion loader to create the side menus
const criterion_loader = function() {

	//Reference to the criterion containers
	const measure_ref=document.getElementById("measure_container");
	const competition_ref=document.getElementById("competition_container");

	const content_meas = document.createElement("div");
	content_meas.classList.add("content");

	//Loading all measure criterions
	measures.forEach((item, i) => {

		// creating separating lines in the menus
		if(i===6 || i===13 || i===19 || i === 21 || i === 24){
			const small = document.createElement("small");
			small.innerHTML = '<hr>';
			content_meas.appendChild(small);
		}

		// creating radio button for measures menu
		const label = document.createElement("label");
		const input = document.createElement('input');
		input.type = "radio"; //checkbox or radio
		input.classList.add("option-input");
		input.classList.add("radio"); //checkbox or radio
		input.name = "example" //only for radios
		input.id= measures[i]+" button";
		label.appendChild(input);
		const small = document.createElement("small");
		small.innerHTML = item;
		label.appendChild(small);
		content_meas.appendChild(label);
	});

	measure_ref.appendChild(content_meas);
	const content_comp = document.createElement("div");
	content_comp.classList.add("content");

	//Loading all competition criterions with separating section lines
	competitions.forEach((item, i) => {
		if(i===1 || i===2 || i===9 || i===16){
			const small = document.createElement("small");
			small.innerHTML = '<hr>';
			content_comp.appendChild(small);
		}

		// creating the checkboxes for competitions menu
		const label = document.createElement("label");
		const input = document.createElement('input');
		input.type = "checkbox"; //checkbox or radio
		input.classList.add("option-input");
		input.classList.add("checkbox"); //checkbox or radio
		input.id= competitions[i]+" button";
		label.appendChild(input);
		const small = document.createElement("small");
		small.innerHTML = item;
		label.appendChild(small);
		content_comp.appendChild(label);
	});

	competition_ref.appendChild(content_comp);
};

// triggered when the document is ready
whenDocumentLoaded(() => {
	let i;

  // load the flag database
	data_loader("../../data/final_results.csv"); /* Ajout Vincent */

	// create the criterions side menus
	criterion_loader();

	// get all the checkboxes or radios on the page
	var checkboxes = document.querySelectorAll('input[type=checkbox]');
	var radios = document.querySelectorAll('input[type=radio]');

	// add a change event listener to all of them to record any change and immediately draw a plot in response to this change
	for(i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener('change', function(){
			if (currBtnTeamId != null) {
				for (var i = 0; i < radios.length; i++) {
					if (radios[i].checked) {
						load_data();
						break;
					}
				}
			}
		});
	}

	for(i = 0; i < radios.length; i++) {
		radios[i].addEventListener('change', function(){
			if (currBtnTeamId != null) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						load_data();
						break;
					}
				}
			}
		});
	}

	// we disable the friendly checkbox when choosing this criterion
	document.getElementById("Tournament Matches Played button").onclick = function() {
		if (currBtnTeamId == null) {
			let i;
			disabled_checkboxes.clear();
			for(i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.checked = false;
				currBtn.disabled = false;
			}
			for(i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				if (currBtnId === "Friendly button") {
					currBtn.disabled = true;
					disabled_checkboxes.add(currBtnId);
				}
			}
		}
	};

	// we only keep the checkboxes of the seven major competitions when choosing this criterion
	document.getElementById("Major Tournaments Played button").onclick = function() {
		let currBtnId;
		let currBtn;
		if (currBtnTeamId == null) {
			let i;
			disabled_checkboxes.clear();
			for (i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.checked = false;
				currBtn.disabled = false;
			}
			for (i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				if (currBtnId !== "All button" && currBtnId !== "FIFA World Cup button" && currBtnId !== "UEFA Euro button" &&
					currBtnId !== "Copa América button" &&
					currBtnId !== "African Cup of Nations button" &&
					currBtnId !== "Gold Cup button" &&
					currBtnId !== "AFC Asian Cup button" &&
					currBtnId !== "Oceania Nations Cup button") {
					currBtn.disabled = true;
					disabled_checkboxes.add(currBtnId);
				}
			}
		}
	};

	// we only keep the checkboxes of the FIFA World Cup competition when choosing this criterion
	document.getElementById("World Cup Tournaments Won button").onclick = function() {
		if (currBtnTeamId == null) {
			let i;
			disabled_checkboxes.clear();
			for(i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.checked = false;
				currBtn.disabled = false;
			}
			for(i = 0; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				currBtn.disabled = true;
				if (currBtnId !== "FIFA World Cup button" && currBtnId !== "All button") {
					disabled_checkboxes.add(currBtnId);
				} else {
					currBtn.checked = true;
				}
			}
		}
	};

	// "All" is a special checkbox having an impact on all the checkboxes of its menu by switching automatically their value to "checked" or "unchecked"
	document.getElementById("All button").onclick = function() {
		let i;
		let currBtn;
		let currBtnId;
		if (this.checked) {
			for (i = 1; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				if (!disabled_checkboxes.has(currBtnId)) {
					currBtn.checked = currBtnTeamId == null;
					currBtn.disabled = true;
				}
			}
		} else {
			for (i = 1; i < competitions.length; i++) {
				currBtnId = competitions[i] + " button";
				currBtn = document.getElementById(currBtnId);
				if (!disabled_checkboxes.has(currBtnId)) {
					currBtn.checked = false;
					currBtn.disabled = false;
				}
			}
		}
	};

	// functions grouping several onClick event doing the same thing
	function enableDisabledButtons(elem_str) {
		document.getElementById(elem_str).onclick = function () {
			if (currBtnTeamId == null) {
				disabled_checkboxes.clear();
				for (var i = 0; i < competitions.length; i++) {
					currBtnId = competitions[i] + " button";
					currBtn = document.getElementById(currBtnId);
					currBtn.checked = false;
					currBtn.disabled = false;
				}
			}
		};
	}

	function disableCompetitions(elem_str) {
		document.getElementById(elem_str).onclick = function () {
			if (currBtnTeamId == null) {
				let i;
				disabled_checkboxes.clear();
				for (i = 0; i < competitions.length; i++) {
					currBtnId = competitions[i] + " button";
					currBtn = document.getElementById(currBtnId);
					currBtn.checked = false;
					currBtn.disabled = false;
				}
				for (i = 0; i < competitions.length; i++) {
					currBtnId = competitions[i] + " button";
					currBtn = document.getElementById(currBtnId);
					currBtn.disabled = true;
					if (currBtnId !== "Friendly button" && currBtnId !== "All button") {
						disabled_checkboxes.add(currBtnId);
					} else {
						currBtn.checked = true;
					}
				}
			}
		};
	}

	disableCompetitions("Friendly Home Matches Played button");
	disableCompetitions("Friendly Away Matches Played button");
	disableCompetitions("Friendly Neutral Matches Played button");
	enableDisabledButtons("Matches Played button");
	enableDisabledButtons("Wins button");
	enableDisabledButtons("Draws button");
	enableDisabledButtons("Losses button");
	enableDisabledButtons("Goals Scored button");
	enableDisabledButtons("Goals Conceded button");
	enableDisabledButtons("Ratio Win Per Match button");
	enableDisabledButtons("Ratio Draw Per Match button");
	enableDisabledButtons("Ratio Loss Per Match button");
	enableDisabledButtons("Ratio Goal Scored Per Match button");
	enableDisabledButtons("Ratio Goal Scored Per Year button");
	enableDisabledButtons("Ratio Goal Conceded Per Match button");
	enableDisabledButtons("Ratio Goal Conceded Per Year button");
	enableDisabledButtons("Home Wins button");
	enableDisabledButtons("Home Draws button");
	enableDisabledButtons("Home Losses button");
	enableDisabledButtons("Away Wins button");
	enableDisabledButtons("Away Draws button");
	enableDisabledButtons("Away Losses button");
	enableDisabledButtons("Performance Factor Home Matches button");
	enableDisabledButtons("Performance Factor Away Matches button");
});
