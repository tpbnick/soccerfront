$(() => {
	$("#nav_home").addClass("active");
	$("#nav_league").removeClass("active");
	$("#nav_login").removeClass("active");

	const $menu = $("#list1");
	const dateList = $("#date_list");

	$(document).on("click", (e) => {
		if (!$menu.is(e.target) && $menu.has(e.target).length === 0) {
			$menu.removeClass("visible");
		}
	});

	let current_date = new Date();
	let formatted_date = formatDate(current_date);
	dateList.attr("value", formatted_date).html(formatted_date);
	getContent();

	$("#refresh").on("click", () => {
		getContent();
		vNotify.success({
			position: "positionOption.center",
			title: "Games Refreshed",
		});
	});

	$("#forward_day").on("click", () => {
		const content_date = dateList.val();
		current_date = new Date(content_date);
		current_date.setDate(current_date.getDate() + 2);
		formatted_date = formatDate(current_date);
		dateList.val(formatted_date).html(formatted_date);
		getContent();
	});

	$("#back_day").on("click", () => {
		const content_date = dateList.val();
		current_date = new Date(content_date);
		current_date.setDate(current_date.getDate());
		formatted_date = formatDate(current_date);
		dateList.val(formatted_date).html(formatted_date);
		getContent();
	});

	let interval = 0;
	$("#auto_refresh_checkbox").on("change", () => {
		if ($("#auto_refresh_checkbox:checked").length > 0) {
			getContent();
			interval = setInterval(() => {
				getContent();
				vNotify.success({ title: "Auto Refresh - On" });
			}, 60000);
		} else {
			if (interval !== 0) {
				clearInterval(interval);
				vNotify.error({ title: "Auto Refresh - Off" });
			}
		}
	});

	$('input[type="checkbox"]').on("click", function () {
		const inputValue = $(this).attr("value");
		$("." + inputValue).toggle();
	});

	dateList.on("change", () => {
		getContent();
	});
});

const currentTimezone = localStorage["timezoneCache"] || "ET";
$("#currentTimezoneCache").text(currentTimezone);

function updateCurrentTimezoneSpan() {
	const currentTimezone = $("#timezone").find(":selected").val();
	$("#currentTimezoneCache").text(currentTimezone);
}

function formatDate(date) {
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const yyyy = String(date.getFullYear()).padStart(4, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function getContent() {
	const date = $("#date_list").val();
	$.ajax({
		url: "/fetch_fixtures",
		method: "POST",
		headers: {
			Accept: "application/json; odata=verbose",
			"Content-Type": "application/json; odata=verbose",
		},
		data: JSON.stringify({
			the_date: date,
		}),
		processData: false,
		success: ({ response }) => {
			const refreshButton = $("#refresh");
			appendContent(response);
			refreshButton.addClass("fa-spin");
			const $el = refreshButton;
			setTimeout(() => {
				$el.removeClass("fa-spin");
			}, 1000);
			tableCheck();
			listCheck();
		},
	});
}

function appendContent(data) {
	const leagues = [
		{ country: "England", name: "Premier League", id: "England_PremierLeague" },
		{ country: "England", name: "Championship", id: "England_Championship" },
		{ country: "England", name: "League One", id: "England_LeagueOne" },
		{ country: "England", name: "FA Cup", id: "England_FACup" },
		{ country: "England", name: "League Cup", id: "England_LeagueCup" },
		{ country: "Germany", name: "Bundesliga", id: "Germany_Bundesliga" },
		{ country: "Germany", name: "2. Bundesliga", id: "Germany_Bundesliga2" },
		{ country: "Germany", name: "3. Liga", id: "Germany_Liga3" },
		{ country: "Germany", name: "DFB Pokal", id: "Germany_DFBPokal" },
		{ country: "Spain", name: "La Liga", id: "Spain_LaLiga" },
		{ country: "Spain", name: "Segunda División", id: "Spain_LaLiga2" },
		{ country: "Spain", name: "Copa del Rey", id: "Spain_CopaDelRey" },
		{ country: "Italy", name: "Serie A", id: "Italy_SerieA" },
		{ country: "Italy", name: "Serie B", id: "Italy_SerieB" },
		{ country: "Italy", name: "Coppa Italia", id: "Italy_CoppaItalia" },
		{
			country: "Netherlands",
			name: "Eredivisie",
			id: "Netherlands_Eredivisie",
		},
		{ country: "Netherlands", name: "KNVB Beker", id: "Netherlands_KNVBCup" },
		{ country: "France", name: "Ligue 1", id: "France_Ligue1" },
		{ country: "France", name: "Coupe De France", id: "France_CoupeDeFrance" },
		{ country: "Portugal", name: "Primeira Liga", id: "Portugal_PrimeiraLiga" },
		{ country: "World", name: "UEFA European Championship", id: "Euro" },
		{ country: "World", name: "Friendlies", id: "Friendlies" },
		{ country: "World", name: "World Cup", id: "WorldCup" },
		{
			country: "World",
			name: "World Cup - Qualification Europe",
			id: "WorldCupQualEuro",
		},
		{
			country: "World",
			name: "World Cup - Qualification North America",
			id: "WorldCupQualNA",
		},
		{
			country: "World",
			name: "World Cup - Qualification South America",
			id: "WorldCupQualSA",
		},
		{
			country: "World",
			name: "World Cup - Qualification Africa",
			id: "WorldCupQualAfrica",
		},
		{
			country: "World",
			name: "World Cup - Qualification Asia",
			id: "WorldCupQualAsia",
		},
		{ country: "World", name: "UEFA Nations League", id: "NationsLeague" },
		{ country: "World", name: "UEFA Champions League", id: "ChampionsLeague" },
		{ country: "World", name: "UEFA Europa League", id: "EuropaLeague" },
	];

	const leaguesMap = {};
	for (const leagueId in leagues) {
		if (Object.hasOwnProperty.call(leagues, leagueId)) {
			const league = leagues[leagueId];
			leaguesMap[league.id] = {
				country: league.country,
				name: league.name,
				id: league.id,
				data: (data || []).filter(
					(item) =>
						item.league.country === league.country &&
						item.league.name === league.name
				),
			};
		}
	}
	for (const league of Object.values(leaguesMap)) {
		const fixtures = league.data;
		if (fixtures.length === 0) continue;
		const leagueId = league.id;

		// add content to the HTML element with the matching league ID
		const leagueElement = document.getElementById(leagueId);
		if (leagueElement) {
			for (const fixture of fixtures) {
				getContent_item(leagueId, fixture);
			}
		}
	}
}

let formattedDate = (time, timezone) => {
	let dateTime = new Date(time * 1000);
	let gameTime = String(dateTime).slice(15, 21);
	let gameTimeHour = Number(gameTime.slice(1, 3));
	let gameTimeMinute = gameTime.slice(4);
	if (gameTimeMinute === 0) {
		gameTimeMinute = "00";
	}
	if (timezone === "PT") {
		gameTimeHour -= 3;
	} else if (timezone === "MT") {
		gameTimeHour -= 2;
	} else if (timezone === "CT") {
		gameTimeHour -= 1;
	}
	gameTime = `${gameTimeHour}:${gameTimeMinute}`;
	return gameTime;
};

function getTimezoneUpdate() {
	localStorage["timezoneCache"] = $("#timezone").find(":selected").val();
	getContent();
}

function getContent_item(league_name, data) {
	console.log(
		`This is the received data: ${league_name} : ${JSON.stringify(data)}`
	);
	console.log(`goals home: ${data.goals.home}`);
	if (!data || typeof data !== "object") {
		console.log("No data");
		return null;
	}
	let content =
		"<br/><h5>" +
		league_name +
		"</h5><hr style='height:2px;border-width:0;color:gray;background-color:gray'><table id='leagueTables' class='table table-secondary table-bordered' style='width:100%;'>";

	let goals_HomeTeam = data.goals.home == null ? "?" : data.goals.home;
	let goals_AwayTeam = data.goals.away == null ? "?" : data.goals.away;
	let gameDate = data.fixture.timestamp;
	let gameTime;
	let timezone =
		localStorage["timezoneCache"] || $("#timezone").find(":selected").val();
	if (data.fixture.status.short === "NS") {
		gameTime = formattedDate(gameDate, timezone) + "&nbsp;";
	} else if (data.fixture.status.short === "FT") {
		gameTime = data.fixture.status.short;
	} else if (data.fixture.status.short === "AET") {
		gameTime = data.fixture.status.short;
	} else if (data.fixture.status.short === "PEN") {
		let homePens = data.score.penalty.home;
		let awayPens = data.score.penalty.away;
		gameTime = data.fixture.status.short;
		goals_HomeTeam = data.goals.home == null ? "?" : data.goals.home;
		goals_AwayTeam =
			data.goals.away == null
				? "?"
				: data.goals.away + "<br>" + "(" + homePens + " - " + awayPens + ")";
	} else if (data.fixture.status.short === "SUSP") {
		gameTime = "Suspended";
	} else if (data.fixture.status.short === "TBD") {
		gameTime = data.fixture.status.short;
	} else if (data.fixture.status.short === "CANC") {
		gameTime = "Cancelled";
	} else if (data.fixture.status.short === "WO") {
		gameTime = "Cancelled";
	} else if (data.fixture.status.short === "INT") {
		gameTime = "Interrupted";
	} else if (data.fixture.status.short === "ABD") {
		gameTime = "Abandoned";
	} else if (data.fixture.status.short === "BT") {
		gameTime = "Break" + "&nbsp;" + "<span class='blink_me'>(LIVE)</span>";
	} else if (data.fixture.status.short === "HT") {
		gameTime =
			data.fixture.status.short +
			"&nbsp;" +
			"<span class='blink_me'>(LIVE)</span>";
	} else if (data.fixture.status.short === "PST") {
		gameTime = "Postponed";
	} else {
		gameTime =
			data.fixture.status.short +
			"&nbsp;" +
			"-" +
			"&nbsp;" +
			data.fixture.status.elapsed +
			"'" +
			"&nbsp;" +
			"<span class='blink_me'>(LIVE)</span>";
	}
	if (data.fixture.status.short === "CANC") {
		content +=
			"<tr>" +
			"<td style='width:20%;'>" +
			gameTime +
			"</td>" +
			"<td style='width:32.5%;text-align:right;'>" +
			data.teams.home.name +
			"&nbsp;&nbsp;&nbsp;<img width='30' height='30' src='" +
			data.teams.home.logo +
			"'>" +
			"</td>" +
			"<td style='width:15%'>" +
			"0" +
			" - " +
			"0" +
			"</td>" +
			"<td style='width:32.5%;text-align:left;'>" +
			"<img width='30' height='30' src='" +
			data.teams.away.logo +
			"'>&nbsp;&nbsp;&nbsp;" +
			data.teams.away.name +
			"</td>" +
			"</tr>";
	} else {
		content +=
			"<tr>" +
			"<td style='width:20%;'>" +
			gameTime +
			"</td>" +
			"<td style='width:32.5%;text-align:right;'>" +
			data.teams.home.name +
			"&nbsp;&nbsp;&nbsp;<img width='30' height='30' src='" +
			data.teams.home.logo +
			"'>" +
			"</td>" +
			"<td style='width:15%'>" +
			goals_HomeTeam +
			" - " +
			goals_AwayTeam +
			"</td>" +
			"<td style='width:32.5%;text-align:left;'>" +
			"<img width='30' height='30' src='" +
			data.teams.away.logo +
			"'>&nbsp;&nbsp;&nbsp;" +
			data.teams.away.name +
			"</td>" +
			"</tr>";
	}

	content += "</td></tr></table>";
	return content;
}

function tableCheck() {
	if ($("#leagueTables").length === 0) {
		$("#no_games").html(
			"No games available on selected date! <i class='far fa-frown'></i>"
		);
	} else {
		$("#no_games").html("");
	}
}

$("#refresh").on("click", function () {
	$(this).addClass("fa-spin");
	var $el = $(this);
	setTimeout(function () {
		$el.removeClass("fa-spin");
	}, 1000);
	getContent();
});

function listCheck() {
	const regions = [
		{
			id: "WorldCup",
			qualIds: [
				"WorldCupQualAfrica",
				"WorldCupQualEuro",
				"WorldCupQualAsia",
				"WorldCupQualSA",
				"WorldCupQualNA",
			],
		},
		{ id: "Euro", qualIds: ["NationsLeague"] },
		{
			id: "England_PremierLeague",
			cupIds: ["England_FACup", "England_LeagueCup"],
		},
		{ id: "Germany_Bundesliga", cupIds: ["Germany_DFBPokal"] },
		{ id: "Spain_LaLiga", cupIds: ["Spain_CopaDelRey"] },
		{ id: "Italy_SerieA", cupIds: ["Italy_CoppaItalia"] },
		{ id: "Netherlands_Eredivisie", cupIds: ["Netherlands_KNVBCup"] },
		{ id: "France_Ligue1", cupIds: ["France_CoupeDeFrance"] },
		{ id: "Portugal_PrimeiraLiga" },
	];

	let noGamesAvailable = true;

	regions.forEach((region) => {
		const mainEl = $(`#${region.id}`);
		const qualEls = region.qualIds?.map((id) => $(`#${id}`));
		const cupEls = region.cupIds?.map((id) => $(`#${id}`));
		const mainEmpty = mainEl.is(":empty");
		const qualEmpty = qualEls?.every((el) => el.is(":empty"));
		const cupEmpty = cupEls?.every((el) => el.is(":empty"));

		const empty = mainEmpty && (!qualEmpty || !cupEmpty);

		if (empty) {
			$(`#${region.id}Checkbox`).addClass("noContentList");
		} else {
			$(`#${region.id}Checkbox`).removeClass("noContentList");
			noGamesAvailable = false;
		}

		if (qualEmpty && cupEmpty) {
			$(`#${region.id}Header`).addClass("noContentList");
		} else {
			$(`#${region.id}Header`).removeClass("noContentList");
		}
	});

	if (noGamesAvailable) {
		$("#noGamesAvailable").removeClass("noGamesAvailable");
	} else {
		$("#noGamesAvailable").addClass("noGamesAvailable");
	}
}
