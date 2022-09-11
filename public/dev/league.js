let countryx = "England";
let leaguex = "Premier League";
$(function () {
    $("#nav_league").addClass("active");
    $("#nav_home").removeClass("active");
    $("#nav_login").removeClass("active");
    let season = $("#season").val();

    getContent("England", "Premier League", season);

    $("#league" || "#season").on('click', function () {
        if (season != null) {
            if (this.value === "ChampionsLeague") {
                countryx = "World";
                leaguex = "UEFA Champions League";
                season = $("#season").val();
            }
            if (this.value === "EuropaLeague") {
                countryx = "World";
                leaguex = "UEFA Europa League";
                season = $("#season").val();
            }
            if (this.value === "PremierLeague") {
                countryx = "England";
                leaguex = "Premier League";
                season = $("#season").val();
            }
            if (this.value === "Championship") {
                countryx = "England";
                leaguex = "Championship";
                season = $("#season").val();
            }
            if (this.value === "LeagueOne") {
                countryx = "England";
                leaguex = "League One";
                season = $("#season").val();
            }
            if (this.value === "Bundesliga") {
                countryx = "Germany";
                leaguex = "Bundesliga";
                season = $("#season").val();
            }
            if (this.value === "Bundesliga2") {
                countryx = "Germany";
                leaguex = "2. Bundesliga";
                season = $("#season").val();
            }
            if (this.value === "3Liga") {
                countryx = "Germany";
                leaguex = "3. Liga";
                season = $("#season").val();
            }
            if (this.value === "LaLiga2") {
                countryx = "Spain";
                leaguex = "Segunda División";
                season = $("#season").val();
            }
            if (this.value === "LaLiga") {
                countryx = "Spain";
                leaguex = "La Liga";
                season = $("#season").val();
            }
            if (this.value === "SerieA") {
                countryx = "Italy";
                leaguex = "Serie A";
                season = $("#season").val();
            }
            if (this.value === "SerieB") {
                countryx = "Italy";
                leaguex = "Serie B";
                season = $("#season").val();
            }
            if (this.value === "Eredivise") {
                countryx = "Netherlands";
                leaguex = "Eredivisie";
                season = $("#season").val();
            }
            if (this.value === "Ligue1") {
                countryx = "France";
                leaguex = "Ligue 1";
                season = $("#season").val();
            }
            if (this.value === "PrimeiraLiga") {
                countryx = "Portugal";
                leaguex = "Primeira Liga";
                season = $("#season").val();
            }
        }
    });
});

async function getContent(countryx, leaguex, season) {
    let yyyy = season;
    let country = countryx;
    let data = [];

    await $.ajax({
        url: "/fetch_leagues",
        method: "POST",
        headers: {
            Accept: "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
        },
        data: JSON.stringify({
            the_country: country,
            the_yyyy: yyyy,
        }),
        processData: false,
        success: function (res) {
            if (!res) {
                console.log("Error getting data from API")
            } else {
                data = res.response;
            }
        },
    });

    var league_ex = data.filter((item) => item.league.name == leaguex);
    var standings_ex = [];
    if (league_ex.length) {
        var league_id_ex = league_ex[0].league.id;
        var seasonYear = Number(season);
        let seasonEndYear = seasonYear + 1;
        var content_logo =
            "<img width='50' height='50' src='" +
            league_ex[0].league.logo +
            "'>&nbsp;&nbsp;&nbsp;<div><h6>" +
            league_ex[0].country.name.toUpperCase() +
            "</h6><div class='leagueYear'><h4>" +
            league_ex[0].league.name.toUpperCase() +
            "</h4><span>" +
            " (" +
            season +
            "-" +
            seasonEndYear +
            ")" +
            "</span></div></div>";
        $("#league_logo").html(content_logo);
        $.ajax({
            url: "fetch_league_table",
            method: "POST",
            headers: {
                Accept: "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose",
            },
            data: JSON.stringify({
                the_league_id_ex: league_id_ex,
                the_season: seasonYear
            }),
            processData: false,
            success: function (res) {
                if (res.response) {
                    standings_ex = res.response[0].league.standings;
                    var content =
                        "<table style='width:100%;font-size:12px;' class='table'>" +
                        "<tr>" +
                        "<th style='width:5%'>#</th>" +
                        "<th style='width:50%;text-align:left;'>Team</th>" +
                        "<th style='width:5%'>GP</th>" +
                        "<th style='width:5%'>W</th>" +
                        "<th style='width:5%'>D</th>" +
                        "<th style='width:5%'>L</th>" +
                        "<th style='width:9%'>+/-</th>" +
                        "<th style='width:6%'>GD</th>" +
                        "<th style='width:6%'>PTS</th>" +
                        "</tr>";
                    standings_ex[0].forEach((el) => {
                        content +=
                            "<tr>" +
                            "<td style='width:5%'>" +
                            el.rank +
                            "</td>" +
                            "<td style='width:50%;text-align:left;'><img class='Image TeamIcon' width='22' height='22' src='" +
                            el.team.logo +
                            "'>&nbsp;&nbsp;&nbsp;" + '<b>' + '<a href="https://www.fotmob.com/search?q=' + el.team.name + '" target="_blank">' +
                            el.team.name + '</a>' + '</b>' +
                            "</td>" +
                            "<td style='width:5%'>" +
                            el.all.played +
                            "</td>" +
                            "<td style='width:5%'>" +
                            el.all.win +
                            "</td>" +
                            "<td style='width:5%'>" +
                            el.all.draw +
                            "</td>" +
                            "<td style='width:5%'>" +
                            el.all.lose +
                            "</td>" +
                            "<td style='width:9%'>" +
                            el.all.goals.for +
                            " - " +
                            el.all.goals.against +
                            "</td>" +
                            "<td style='width:6%'>" +
                            el.goalsDiff +
                            "</td>" +
                            "<td style='width:6%'>" +
                            el.points +
                            "</td>" +
                            "</tr>";
                    });
                    content += "</table>";
                    $("#league_table").html(content);
                } else {
                    console.log("error reading data");
                }
            },
        });
    }
    else {
        console.log("error getting league data/id");
    }
}

$("#refresh").on('click', function () {
    let season = $("#season").val();
    getContent(countryx, leaguex, season);
    $(this).addClass("fa-spin");
    let $el = $(this);
    setTimeout(function () {
        $el.removeClass("fa-spin");
    }, 1000);
    vNotify.success({title:'League Table Refreshed'});
});
