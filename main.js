// 0 = Search | 1 = spinner | 2 = search
var page = 0;
var pageDOM = document.getElementById("search");

var search = document.getElementById("search");
var spinner = document.getElementById("spinner");
var statsPage = document.getElementById("stats");

var mode = 'solo';
var region = 'EU';

var users = {};

var Time;

/**
 * Changes the active view
 *
 * @param DOM - What to change to
 */
function changePage (targetDom)
{
	// Hide Old Dom
	hideDOM(pageDOM);

	// Show new Dom
	setTimeout(() => {
		if (targetDom.id == 'spinner')
			targetDom.style.display = "flex";
		else
			targetDom.style.display = "block";
		showDOM(targetDom);
	}, 250);

	//showDOM(targetDom);
	pageDOM = targetDom;
}

function hideDOM (dom)
{
	pageDOM.style.marginTop = "25px";
	pageDOM.style.opacity = 0;
	pageDOM.style.pointerEvents = "none";
	setTimeout(function(dom){
		dom.style.display = "none";
	}, 250,pageDOM);
}

function showDOM(targetDom)
{
	targetDom.style.marginTop = "0px";
	targetDom.style.opacity = 1;
	targetDom.style.pointerEvents = "inherit";
}

function changeTeamSize(elm, size)
{
	switch (size) {
		case 'solo':
		  document.getElementById("modeSolo").className = "mode active";
		  document.getElementById("modeDuo").className = "mode";
		  document.getElementById("modeSquad").className = "mode";
		  break;
		case 'duo':
		  document.getElementById("modeDuo").className = "mode active";
		  document.getElementById("modeSolo").className = "mode";
		  document.getElementById("modeSquad").className = "mode"; 
		  break;
		case 'squad':
		  document.getElementById("modeDuo").className = "mode";
		  document.getElementById("modeSolo").className = "mode";
		  document.getElementById("modeSquad").className = "mode active";
		  break;

	}
}
function changeRegion (elm, mode)
{
	var regions = document.getElementById("regions").children;

	for (var i = 0; i < regions.length; i++) {
		var child = regions[i];
		if (child != elm)
			child.className = "region";
		else
			child.className ="region active";
	}
}

function searchForUser ()
{
	var un = document.getElementById("username");
	// Check if there is a username
	if (un.value == "")
		return;

	changePage(spinner);
	getPUBGStats(un.value, mode, region);
	time = new Date();
}

function getPUBGStats(user, mode, region)
{
	var url = `stats.php?u=${user}`;
	var callback = function (data) {

		var stats = JSON.parse(data);

		// Last Updated Txt
		document.getElementById("lastUpdatedText").innerHTML = `Last updated: ${new Date(stats.LastUpdated)}`;

		// Avatar
		var avatar = getFullSizeSteamAvatar(stats.Avatar);
		document.getElementById("avatar").src = avatar;

		// Username
		document.getElementById("statsUsername").innerHTML = `${stats.PlayerName}`;

		// Region Mode
		document.getElementById("statsRegionMode").innerHTML = `${region.toUpperCase()}/${mode.toUpperCase()}`;

		var matchStats = [];
		stats.Stats.forEach( game => {
			if (game.Region == region.toLowerCase() && game.Match == mode.toLowerCase())
				matchStats.push(game);
		});

		if (matchStats.length > 0)
		{
			var game = matchStats[matchStats.length-1];


			// Rating
			document.getElementById("ratingValue").innerHTML = game.Stats[9].displayValue;

			// KDR
			document.getElementById("KDValue").innerHTML = game.Stats[0].displayValue;
			
			// Wins
			document.getElementById("winsValue").innerHTML = game.Stats[4].displayValue;

			// Wins%
			document.getElementById("winPValue").innerHTML = game.Stats[1].displayValue;
		
			// Top 10
			document.getElementById("t10Value").innerHTML = game.Stats[6].displayValue;
		
			// Kills
			document.getElementById("killsValue").innerHTML = game.Stats[22].displayValue;
		
			// Deaths
			document.getElementById("deathsValue").innerHTML = Math.round((game.Stats[22].ValueInt / game.Stats[0].ValueDec));
		
			// Assists
			document.getElementById("assistsValue").innerHTML = game.Stats[23].displayValue;
		
			// Suicides
			document.getElementById("suicideValue").innerHTML = game.Stats[24].displayValue;

			// Team Kills
			document.getElementById("tkValue").innerHTML = game.Stats[25].displayValue;

			// Headshots
			document.getElementById("hsValue").innerHTML = game.Stats[26].displayValue;

			// Headshots Rank
			document.getElementById("hsrValue").innerHTML = game.Stats[27].displayValue;

			// Longest Kill
			document.getElementById("lkValue").innerHTML = game.Stats[45].displayValue;

			// Road Kills
			document.getElementById("rkValue").innerHTML = game.Stats[29].displayValue;

			// Heals
			document.getElementById("healsValue").innerHTML = game.Stats[46].displayValue;

			// Revives
			document.getElementById("revivesValue").innerHTML = game.Stats[47].displayValue;

			// Knock Outs
			document.getElementById("koValue").innerHTML = game.Stats[50].displayValue;

			// Boosts
			document.getElementById("boostsValue").innerHTML = game.Stats[48].displayValue;

			// Rounds Played
			document.getElementById("rpValue").innerHTML = game.Stats[3].displayValue;

			// Highest Kills 
			document.getElementById("hkValue").innerHTML = game.Stats[32].displayValue;

		};

		// Save user to array so we dont have to request his stats again
		users[user] = stats;

		// URL Hash
		var hash = `u=${user.toLowerCase()}&m=${mode.toLowerCase()}&r=${region.toLowerCase()}`

		// Check how long have elapsed since we started to load (if less than 2 seconds wait)
		setTimeout(function() {
			changePage(statsPage);
			// Set URL
			window.location.hash = hash;
		}, 1500, hash);
	};
	ajaxGet(url, callback);
}


function onPageLoad()
{
	// Parse URL
	var params = {};
	var keyPairs = window.location.hash.slice(1).split("&");
	keyPairs.forEach( keypair => {
		var temp = keypair.split("=");
		params[temp[0]] = temp[1];
	});

	// Check if we should server a page
	if ( params.hasOwnProperty('u') && params.hasOwnProperty('m') && params.hasOwnProperty('r') &&
		 ['eu', 'as', 'oc', 'na'].indexOf(params.r) != -1 && ['solo', 'duo', 'squad'].indexOf(params.m) != -1)
	{
		changePage(spinner);
		getPUBGStats(params.u, params.m, params.r);
		time = new Date();
	};	
}

function getFullSizeSteamAvatar(url) {
	var split = url.split('.');
	split[2] += '_full';
	return split.join('.');	
}



function backHome() {
	changePage(search);
	window.location.hash = "";
}






function ajaxGet(page, callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
}