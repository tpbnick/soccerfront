$(function () {
    $("#nav_home").addClass("active");
    $("#nav_league").removeClass("active");
    $("#nav_login").removeClass("active");

    const $menu = $("#list1");
    let dateList = $("#date_list");

    $(document).on('click', (e) => {
        if (
            !$menu.is(e.target) && // if the target of the click isn't the container...
            $menu.has(e.target).length === 0
        ) {
            // ... or inside the container
            $menu.removeClass("visible");
        }
    });

    let current_date = new Date();
    let formatted_date = formatDate(current_date);
    let content_date = document.getElementById("date_list").value;
    dateList.attr("value", formatted_date).html(content_date);
    getContent();

    $("#refresh").on('click', function () {
        getContent();
        vNotify.success({position: "positionOption.center", title:'Games Refreshed'});
    });

    $("#forward_day").on('click', function () {
        content_date = document.getElementById("date_list").value;
        current_date = new Date(content_date);
        current_date.setDate(current_date.getDate() + 2);
        formatted_date = formatDate(current_date);
        dateList.val(formatted_date);
        dateList.html(content_date);
        getContent();
    });

    $("#back_day").on('click', function () {
        content_date = document.getElementById("date_list").value;
        current_date = new Date(content_date);
        current_date.setDate(current_date.getDate());
        formatted_date = formatDate(current_date);
        dateList.val(formatted_date);
        dateList.html(content_date);
        getContent();
    });
    let interval = 0; //Auto Update Checkbox in header
    $("#auto_refresh_checkbox").on('change', function () {
        if ($("#auto_refresh_checkbox:checked").length > 0) {
            getContent();
            interval = setInterval(function () {
                getContent();
                console.log("--content updated--");
            }, 60000);
            vNotify.success({title:'Auto Refresh - On'});
        } else {
            if (interval !== 0) {
                clearInterval(interval);
                console.log("--content updating stopped--");
                vNotify.error({title:'Auto Refresh - Off'});
            }
        }
    });

    $('input[type="checkbox"]').on('click',function () {
        let inputValue = $(this).attr("value");
        $("." + inputValue).toggle();
    });

    dateList.on('change',function () {
        getContent();
    });
});

var currentTimezone = localStorage["timezoneCache"] || "ET";
$("#currentTimezoneCache").text(currentTimezone);

function updateCurrentTimezoneSpan() {
    currentTimezone = $('#timezone').find(":selected").val();
    $("#currentTimezoneCache").text(currentTimezone);
}

function formatDate(date) {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //month is 0 indexed
    let yyyy = String(date.getFullYear()).padStart(4, "0");
    return yyyy + "-" + mm + "-" + dd;
}

function getContent() {
    let date = $("#date_list").val();
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
        success: function (res) {
            let refreshButton = $("#refresh");
            appendContent(res.response);
            refreshButton.addClass("fa-spin");
            let $el = refreshButton;
            setTimeout(function () {
                $el.removeClass("fa-spin");
            }, 1000);
            tableCheck();
            listCheck();
        },
    });
}

function appendContent(data) {
    //england
    let data_PremierLeague = (data || []).filter(
        (item) =>
            item.league.country === "England" && item.league.name === "Premier League"
    );
    let data_Championship = (data || []).filter(
        (item) =>
            item.league.country === "England" && item.league.name === "Championship"
    );
    let data_LeagueOne = (data || []).filter(
        (item) =>
            item.league.country === "England" && item.league.name === "League One"
    );
    let data_FACup = (data || []).filter(
        (item) => item.league.country === "England" && item.league.name === "FA Cup"
    );
    let data_LeagueCup = (data || []).filter(
        (item) =>
            item.league.country === "England" && item.league.name === "League Cup"
    );
    //germany
    let data_Bundesliga = (data || []).filter(
        (item) =>
            item.league.country === "Germany" && item.league.name === "Bundesliga"
    );
    let data_Bundesliga2 = (data || []).filter(
        (item) =>
            item.league.country === "Germany" && item.league.name === "2. Bundesliga"
    );
    let data_Liga3 = (data || []).filter(
        (item) => item.league.country === "Germany" && item.league.name === "3. Liga"
    );
    let data_DFBPokal = (data || []).filter(
        (item) =>
            item.league.country === "Germany" && item.league.name === "DFB Pokal"
    );
    //spain
    let data_LaLiga = (data || []).filter(
        (item) => item.league.country === "Spain" && item.league.name === "La Liga"
    );
    let data_LaLiga2 = (data || []).filter(
        (item) =>
            item.league.country === "Spain" && item.league.name === "Segunda División"
    );
    let data_CopaDelRey = (data || []).filter(
        (item) =>
            item.league.country === "Spain" && item.league.name === "Copa del Rey"
    );
    //italy
    let data_SerieA = (data || []).filter(
        (item) => item.league.country === "Italy" && item.league.name === "Serie A"
    );
    let data_SerieB = (data || []).filter(
        (item) => item.league.country === "Italy" && item.league.name === "Serie B"
    );
    let data_CoppaItalia = (data || []).filter(
        (item) =>
            item.league.country === "Italy" && item.league.name === "Coppa Italia"
    );
    //netherlands
    let data_Eredivisie = (data || []).filter(
        (item) =>
            item.league.country === "Netherlands" && item.league.name === "Eredivisie"
    );
    let data_KNVBCup = (data || []).filter(
        (item) =>
            item.league.country === "Netherlands" && item.league.name === "KNVB Beker"
    );
    //france
    let data_league1 = (data || []).filter(
        (item) => item.league.country === "France" && item.league.name === "Ligue 1"
    );
    let data_CoupeDeFrance = (data || []).filter(
        (item) =>
            item.league.country === "France" && item.league.name === "Coupe De France"
    );
    //portugal
    let data_PremieraLiga = (data || []).filter(
        (item) =>
            item.league.country === "Portugal" && item.league.name === "Primeira Liga"
    );
    //europe
    let data_Euro = (data || []).filter(
        (item) =>
            item.league.country === "World" && item.league.name === "Euro Championship"
    );
    let data_NationsLeague = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "UEFA Nations League"
    );
    let data_ChampionsLeague = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "UEFA Champions League"
    );
    let data_EuropaLeague = (data || []).filter(
        (item) =>
            item.league.country === "World" && item.league.name === "UEFA Europa League"
    );
    //world
    let data_Friendlies = (data || []).filter(
        (item) => item.league.country === "World" && item.league.name === "Friendlies"
    );
    let data_WorldCup = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup"
    );
    let data_WorldCupQualEuro = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup - Qualification Europe"
    );
    let data_WorldCupQualAsia = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup - Qualification Asia"
    );
    let data_WorldCupQualSA = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup - Qualification South America"
    );
    let data_WorldCupQualAfrica = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup - Qualification Africa"
    );
    let data_WorldCupQualNA = (data || []).filter(
        (item) =>
            item.league.country === "World" &&
            item.league.name === "World Cup - Qualification CONCACAF"
    );

    let content_Euro = getContent_item("UEFA European Championship", data_Euro);
    $("#Euro").html(content_Euro);

    let content_Friendlies = getContent_item("Friendlies", data_Friendlies);
    $("#Friendlies").html(content_Friendlies);

    let content_WorldCup = getContent_item(
        "World Cup",
        data_WorldCup
    );
    $("#WorldCup").html(content_WorldCup);

    let content_WorldCupQualEuro = getContent_item(
        "World Cup Qualification - Europe",
        data_WorldCupQualEuro
    );
    $("#WorldCupQualEuro").html(content_WorldCupQualEuro);

    let content_WorldCupQualNA = getContent_item(
        "World Cup Qualification - North America",
        data_WorldCupQualNA
    );
    $("#WorldCupQualNA").html(content_WorldCupQualNA);

    let content_WorldCupQualSA = getContent_item(
        "World Cup Qualification - South America",
        data_WorldCupQualSA
    );
    $("#WorldCupQualSA").html(content_WorldCupQualSA);

    let content_WorldCupQualAfrica = getContent_item(
        "World Cup Qualification - Africa",
        data_WorldCupQualAfrica
    );
    $("#WorldCupQualAfrica").html(content_WorldCupQualAfrica);

    let content_WorldCupQualAsia = getContent_item(
        "World Cup Qualification - Asia",
        data_WorldCupQualAsia
    );
    $("#WorldCupQualAsia").html(content_WorldCupQualAsia);

    let content_NationsLeague = getContent_item(
        "Nations League",
        data_NationsLeague
    );
    $("#NationsLeague").html(content_NationsLeague);

    let content_ChampionsLeague = getContent_item(
        "Champions League",
        data_ChampionsLeague
    );
    $("#ChampionsLeague").html(content_ChampionsLeague);

    let content_EuropaLeague = getContent_item(
        "Europa League",
        data_EuropaLeague
    );
    $("#EuropaLeague").html(content_EuropaLeague);

    let content_PremierLeague = getContent_item(
        "England - Premier League",
        data_PremierLeague
    );
    $("#England_PremierLeague").html(content_PremierLeague);

    let content_Championship = getContent_item(
        "England - Championship",
        data_Championship
    );
    $("#England_Championship").html(content_Championship);

    let content_LeagueOne = getContent_item(
        "England - League One",
        data_LeagueOne
    );
    $("#England_LeagueOne").html(content_LeagueOne);

    let content_FACup = getContent_item("England - FA Cup", data_FACup);
    $("#England_FACup").html(content_FACup);

    let content_LeagueCup = getContent_item(
        "England - League Cup",
        data_LeagueCup
    );
    $("#England_LeagueCup").html(content_LeagueCup);

    let content_Bundesliga = getContent_item(
        "Germany - Bundesliga",
        data_Bundesliga
    );
    $("#Germany_Bundesliga").html(content_Bundesliga);

    let content_Bundesliga2 = getContent_item(
        "Germany - Bundesliga 2",
        data_Bundesliga2
    );
    $("#Germany_Bundesliga2").html(content_Bundesliga2);

    let content_Liga3 = getContent_item("Germany - Liga 3", data_Liga3);
    $("#Germany_Liga3").html(content_Liga3);

    let content_DFBPokal = getContent_item("Germany - DFB Pokal", data_DFBPokal);
    $("#Germany_DFBPokal").html(content_DFBPokal);

    let content_LaLiga = getContent_item("Spain - La Liga", data_LaLiga);
    $("#Spain_LaLiga").html(content_LaLiga);

    let content_LaLiga2 = getContent_item("Spain - La Liga 2", data_LaLiga2);
    $("#Spain_LaLiga2").html(content_LaLiga2);

    let content_CopaDelRey = getContent_item(
        "Spain - Copa del Rey",
        data_CopaDelRey
    );
    $("#Spain_CopaDelRey").html(content_CopaDelRey);

    let content_SerieA = getContent_item("Italy - Serie A", data_SerieA);
    $("#Italy_SerieA").html(content_SerieA);

    let content_SerieB = getContent_item("Italy - Serie B", data_SerieB);
    $("#Italy_SerieB").html(content_SerieB);

    let content_CoppaItalia = getContent_item(
        "Italy - Coppa Italia",
        data_CoppaItalia
    );
    $("#Italy_CoppaItalia").html(content_CoppaItalia);

    let content_Eredivisie = getContent_item(
        "Netherlands - Eredivisie",
        data_Eredivisie
    );
    $("#Netherlands_Eredivisie").html(content_Eredivisie);

    let content_KNVBCup = getContent_item("Netherlands - KNVB Cup", data_KNVBCup);
    $("#Netherlands_KNVBCup").html(content_KNVBCup);

    let content_Ligue1 = getContent_item("France - Ligue 1", data_league1);
    $("#France_Ligue1").html(content_Ligue1);

    let content_CoupeDeFrance = getContent_item(
        "France - Coupe De France",
        data_CoupeDeFrance
    );
    $("#France_CoupeDeFrance").html(content_CoupeDeFrance);

    let content_PrimeiraLiga = getContent_item(
        "Portugal - Primeira Liga",
        data_PremieraLiga
    );
    $("#Portugal_PrimeiraLiga").html(content_PrimeiraLiga);
}
let formattedDate = (time, timezone) => {
    let dateTime = new Date(time * 1000);
    let gameTime = String(dateTime).slice(15, 21);
    let gameTimeHour = Number(gameTime.slice(1, 3));
    let gameTimeMinute = gameTime.slice(4);
    if (gameTimeMinute === 0){
        gameTimeMinute = "00";
    }
    if (timezone === "PT") {
        gameTimeHour -= 3;
    } else if (timezone === "MT"){
        gameTimeHour -= 2;
    } else if (timezone === "CT") {
        gameTimeHour -= 1;
    }
    gameTime = `${gameTimeHour}:${gameTimeMinute}`;
    return gameTime;
}

function getTimezoneUpdate() {
    localStorage["timezoneCache"] = $('#timezone').find(":selected").val();
    getContent();
}

function getContent_item(league_name, data) {
    if (data.length === 0) {
        return null;
    }
    let content =
        "<br/><h5>" +
        league_name +
        "</h5><hr style='height:2px;border-width:0;color:gray;background-color:gray'><table id='leagueTables' class='table table-secondary table-bordered' style='width:100%;'>";

    data.forEach((e) => {
        let goals_HomeTeam = e.goals.home == null ? "?" : e.goals.home;
        let goals_AwayTeam = e.goals.away == null ? "?" : e.goals.away;
        let gameDate = e.fixture.timestamp;
        let gameTime;
        let timezone = localStorage["timezoneCache"] || $('#timezone').find(":selected").val();
        if (e.fixture.status.short === "NS") {
            gameTime = formattedDate(gameDate, timezone) + "&nbsp;";
        } else if (e.fixture.status.short === "FT") {
            gameTime = e.fixture.status.short;
        } else if (e.fixture.status.short === "AET") {
            gameTime = e.fixture.status.short;
        } else if (e.fixture.status.short === "PEN") {
            let homePens = e.score.penalty.home;
            let awayPens = e.score.penalty.away;
            gameTime = e.fixture.status.short;
            goals_HomeTeam = e.goals.home == null ? "?" : e.goals.home;
            goals_AwayTeam = e.goals.away == null ? "?" : e.goals.away + "<br>" + "(" + homePens + " - " + awayPens + ")";
        } else if (e.fixture.status.short === "SUSP") {
            gameTime = "Suspended";
        } else if (e.fixture.status.short === "TBD") {
            gameTime = e.fixture.status.short;
        } else if (e.fixture.status.short === "CANC") {
            gameTime = "Cancelled";
        } else if (e.fixture.status.short === "WO") {
            gameTime = "Cancelled";
        } else if (e.fixture.status.short === "INT") {
            gameTime = "Interrupted";
        } else if (e.fixture.status.short === "ABD") {
            gameTime = "Abandoned";
        } else if (e.fixture.status.short === "BT") {
            gameTime = "Break" + "&nbsp;" + "<span class='blink_me'>(LIVE)</span>";
        } else if (e.fixture.status.short === "HT") {
            gameTime =
                e.fixture.status.short + "&nbsp;" + "<span class='blink_me'>(LIVE)</span>";
        } else if (e.fixture.status.short === "PST") {
            gameTime = "Postponed";
        } else {
            gameTime =
                e.fixture.status.short +
                "&nbsp;" +
                "-" +
                "&nbsp;" +
                e.fixture.status.elapsed +
                "'" +
                "&nbsp;" +
                "<span class='blink_me'>(LIVE)</span>";
        }
        if (e.fixture.status.short === "CANC") {
            content +=
                "<tr>" +
                "<td style='width:20%;'>" +
                gameTime +
                "</td>" +
                "<td style='width:32.5%;text-align:right;'>" +
                e.teams.home.name +
                "&nbsp;&nbsp;&nbsp;<img width='30' height='30' src='" +
                e.teams.home.logo +
                "'>" +
                "</td>" +
                "<td style='width:15%'>" +
                "0" +
                " - " +
                "0" +
                "</td>" +
                "<td style='width:32.5%;text-align:left;'>" +
                "<img width='30' height='30' src='" +
                e.teams.away.logo +
                "'>&nbsp;&nbsp;&nbsp;" +
                e.teams.away.name +
                "</td>" +
                "</tr>";
        } else {
            content +=
                "<tr>" +
                "<td style='width:20%;'>" +
                gameTime +
                "</td>" +
                "<td style='width:32.5%;text-align:right;'>" +
                e.teams.home.name +
                "&nbsp;&nbsp;&nbsp;<img width='30' height='30' src='" +
                e.teams.home.logo +
                "'>" +
                "</td>" +
                "<td style='width:15%'>" +
                goals_HomeTeam +
                " - " +
                goals_AwayTeam +
                "</td>" +
                "<td style='width:32.5%;text-align:left;'>" +
                "<img width='30' height='30' src='" +
                e.teams.away.logo +
                "'>&nbsp;&nbsp;&nbsp;" +
                e.teams.away.name +
                "</td>" +
                "</tr>";
        }
    });

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

$("#refresh").on('click', function () {
    $(this).addClass("fa-spin");
    var $el = $(this);
    setTimeout(function () {
        $el.removeClass("fa-spin");
    }, 1000);
    getContent();
});

function listCheck() {
    // World data check
    if ($("#Friendlies").is(":empty")) {
        $("#friendliesCheckbox").addClass("noContentList");
        var friendliesEmpty = true;
    } else {
        $("#friendliesCheckbox").removeClass("noContentList");
        var friendliesEmpty = false;
    }
    if ($("#WorldCup").is(":empty")) {
        $("#worldcupCheckbox").addClass("noContentList");
        var worldCupEmpty = true;
    } else {
        $("#worldcupCheckbox").removeClass("noContentList");
        var worldCupEmpty = false;
    }
    if (
        $("#WorldCupQualAfrica").is(":empty") &&
        $("#WorldCupQualEuro").is(":empty") &&
        $("#WorldCupQualAsia").is(":empty") &&
        $("#WorldCupQualSA").is(":empty") &&
        $("#WorldCupQualNA").is(":empty") &&
        $("#WorldCup").is(":empty")
    ) {
        $("#worldcupCheckboxQual").addClass("noContentList");
        var worldCupQualEmpty = true;
    } else {
        $("#worldcupCheckboxQual").removeClass("noContentList");
        var worldCupQualEmpty = false;
    }
    if (friendliesEmpty && worldCupQualEmpty) {
        $("#worldHeader").addClass("noContentList");
        var worldEmpty = true;
    } else {
        $("#worldHeader").removeClass("noContentList");
        var worldEmpty = false;
    }
    // Euro data check
    if ($("#Euro").is(":empty")) {
        $("#euroCheckbox").addClass("noContentList");
        var euroEmpty = true;
    } else {
        $("#euroCheckbox").removeClass("noContentList");
        var euroEmpty = false;
    }
    if ($("#NationsLeague").is(":empty")) {
        $("#nationsCheckbox").addClass("noContentList");
        var nationsEmpty = true;
    } else {
        $("#nationsCheckbox").removeClass("noContentList");
        var nationsEmpty = false;
    }
    if ($("#ChampionsLeague").is(":empty")) {
        $("#championsCheckbox").addClass("noContentList");
        var championsEmpty = true;
    } else {
        $("#championsCheckbox").removeClass("noContentList");
        var championsEmpty = false;
    }
    if ($("#EuropaLeague").is(":empty")) {
        $("#europaCheckbox").addClass("noContentList");
        var europaEmpty = true;
    } else {
        $("#europaCheckbox").removeClass("noContentList");
        var europaEmpty = false;
    }
    if (euroEmpty && nationsEmpty && championsEmpty && europaEmpty) {
        $("#europeHeader").addClass("noContentList");
    } else {
        $("#europeHeader").removeClass("noContentList");
    }
    // England data check
    if ($("#England_PremierLeague").is(":empty")) {
        $("#premierCheckbox").addClass("noContentList");
        var premierEmpty = true;
    } else {
        $("#premierCheckbox").removeClass("noContentList");
        var premierEmpty = false;
    }
    if ($("#England_Championship").is(":empty")) {
        $("#championshipCheckbox").addClass("noContentList");
        var championshipEmpty = true;
    } else {
        $("#championshipCheckbox").removeClass("noContentList");
        var championshipEmpty = false;
    }
    if ($("#England_LeagueOne").is(":empty")) {
        $("#leagueoneCheckbox").addClass("noContentList");
        var leagueoneEmpty = true;
    } else {
        $("#leagueoneCheckbox").removeClass("noContentList");
        var leagueoneEmpty = false;
    }
    if ($("#England_FACup").is(":empty")) {
        $("#facupCheckbox").addClass("noContentList");
        var facupEmpty = true;
    } else {
        $("#facupCheckbox").removeClass("noContentList");
        var facupEmpty = false;
    }
    if ($("#England_LeagueCup").is(":empty")) {
        $("#leaguecupCheckbox").addClass("noContentList");
        var leaguecupEmpty = true;
    } else {
        $("#leaguecupCheckbox").removeClass("noContentList");
        var leaguecupEmpty = false;
    }
    if (
        premierEmpty &&
        championshipEmpty &&
        leagueoneEmpty &&
        facupEmpty &&
        leaguecupEmpty
    ) {
        $("#englandHeader").addClass("noContentList");
        var englandEmpty = true;
    } else {
        $("#englandHeader").removeClass("noContentList");
        var englandEmpty = false;
    }
    // Germany data check
    if ($("#Germany_Bundesliga").is(":empty")) {
        $("#bundesligaCheckbox").addClass("noContentList");
        var bundesligaEmpty = true;
    } else {
        $("#bundesligaCheckbox").removeClass("noContentList");
        var bundesligaEmpty = false;
    }
    if ($("#Germany_Bundesliga2").is(":empty")) {
        $("#bundesliga2Checkbox").addClass("noContentList");
        var bundesliga2Empty = true;
    } else {
        $("#bundesliga2Checkbox").removeClass("noContentList");
        var bundesliga2Empty = false;
    }
    if ($("#Germany_Liga3").is(":empty")) {
        $("#liga3Checkbox").addClass("noContentList");
        var liga3Empty = true;
    } else {
        $("#liga3Checkbox").removeClass("noContentList");
        var liga3Empty = false;
    }
    if ($("#Germany_DFBPokal").is(":empty")) {
        $("#dfbpokalCheckbox").addClass("noContentList");
        var dfbpokalEmpty = true;
    } else {
        $("#dfbpokalCheckbox").removeClass("noContentList");
        var dfbpokalEmpty = false;
    }
    if (bundesligaEmpty && bundesliga2Empty && liga3Empty && dfbpokalEmpty) {
        $("#germanyHeader").addClass("noContentList");
        var germanyEmpty = true;
    } else {
        $("#germanyHeader").removeClass("noContentList");
        var germanyEmpty = false;
    }
    // Spain data check
    if ($("#Spain_LaLiga").is(":empty")) {
        $("#laligaCheckbox").addClass("noContentList");
        var laligaEmpty = true;
    } else {
        $("#laligaCheckbox").removeClass("noContentList");
        var laligaEmpty = false;
    }
    if ($("#Spain_LaLiga2").is(":empty")) {
        $("#laliga2Checkbox").addClass("noContentList");
        var laliga2Empty = true;
    } else {
        $("#laliga2Checkbox").removeClass("noContentList");
        var laliga2Empty = false;
    }
    if ($("#Spain_CopaDelRey").is(":empty")) {
        $("#copadelreyCheckbox").addClass("noContentList");
        var copadelreyEmpty = true;
    } else {
        $("#copadelreyCheckbox").removeClass("noContentList");
        var copadelreyEmpty = false;
    }
    if (laligaEmpty && laliga2Empty && copadelreyEmpty) {
        $("#spainHeader").addClass("noContentList");
        var spainEmpty = true;
    } else {
        $("#spainHeader").removeClass("noContentList");
        var spainEmpty = false;
    }
    // Italy data check
    if ($("#Italy_SerieA").is(":empty")) {
        $("#serieaCheckbox").addClass("noContentList");
        var serieaEmpty = true;
    } else {
        $("#serieaCheckbox").removeClass("noContentList");
        var serieaEmpty = false;
    }
    if ($("#Italy_SerieB").is(":empty")) {
        $("#seriebCheckbox").addClass("noContentList");
        var seriebEmpty = true;
    } else {
        $("#seriebCheckbox").removeClass("noContentList");
        var seriebEmpty = false;
    }
    if ($("#Italy_CoppaItalia").is(":empty")) {
        $("#coppaitaliaCheckbox").addClass("noContentList");
        var coppaitaliaEmpty = true;
    } else {
        $("#coppaitaliaCheckbox").removeClass("noContentList");
        var coppaitaliaEmpty = false;
    }
    if (serieaEmpty && seriebEmpty && coppaitaliaEmpty) {
        $("#italyHeader").addClass("noContentList");
        var italyEmpty = true;
    } else {
        $("#italyHeader").removeClass("noContentList");
        var italyEmpty = false;
    }
    // Netherlands data check
    if ($("#Netherlands_Eredivisie").is(":empty")) {
        $("#erediviseCheckbox").addClass("noContentList");
        var eredivisieEmpty = true;
    } else {
        $("#erediviseCheckbox").removeClass("noContentList");
        var eredivisieEmpty = false;
    }
    if ($("#Netherlands_KNVBCup").is(":empty")) {
        $("#knvbcupCheckbox").addClass("noContentList");
        var knvbcupEmpty = true;
    } else {
        $("#knvbcupCheckbox").removeClass("noContentList");
        var knvbcupEmpty = false;
    }
    if (eredivisieEmpty && knvbcupEmpty) {
        $("#netherlandsHeader").addClass("noContentList");
        var netherlandsEmpty = true;
    } else {
        $("#netherlandsHeader").removeClass("noContentList");
        var netherlandsEmpty = false;
    }
    // France data check
    if ($("#France_Ligue1").is(":empty")) {
        $("#ligue1Checkbox").addClass("noContentList");
        var ligue1Empty = true;
    } else {
        $("#ligue1Checkbox").removeClass("noContentList");
        var ligue1Empty = false;
    }
    if ($("#France_CoupeDeFrance").is(":empty")) {
        $("#coupedefranceCheckbox").addClass("noContentList");
        var coupedefranceEmpty = true;
    } else {
        $("#coupedefranceCheckbox").removeClass("noContentList");
        var coupedefranceEmpty = false;
    }
    if (ligue1Empty && coupedefranceEmpty) {
        $("#franceHeader").addClass("noContentList");
        var franceEmpty = true;
    } else {
        $("#franceHeader").removeClass("noContentList");
        var franceEmpty = false;
    }
    // Portugal data check
    if ($("#Portugal_PrimeiraLiga").is(":empty")) {
        $("#primeiraligaCheckbox").addClass("noContentList");
        var primeiraligaEmpty = true;
    } else {
        $("#primeiraligaCheckbox").removeClass("noContentList");
        var primeiraligaEmpty = false;
    }
    if (primeiraligaEmpty) {
        $("#portugalHeader").addClass("noContentList");
        var portugalEmpty = true;
    } else {
        $("#portugalHeader").removeClass("noContentList");
        var portugalEmpty = false;
    }
    // check for checkboxes
    if (
        worldEmpty &&
        euroEmpty &&
        englandEmpty &&
        germanyEmpty &&
        spainEmpty &&
        netherlandsEmpty &&
        italyEmpty &&
        franceEmpty &&
        portugalEmpty
    ) {
        $("#noGamesAvailable").removeClass("noGamesAvailable");
    } else {
        $("#noGamesAvailable").addClass("noGamesAvailable");
    }
}