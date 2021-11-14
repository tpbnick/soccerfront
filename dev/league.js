var countryx = "England";
var leaguex = "Premier League";
var season = $("#season").val();
$(function () {
  $("#nav_league").addClass("active");
  $("#nav_home").removeClass("active");
  $("#nav_login").removeClass("active");
  var season = $("#season").val();
  var league = $("#league").val();

  getContent("England", "Premier League", season);

  $("#league" || "#season").change(function () {
    if (season != null) {
      if (this.value == "ChampionsLeague") {
        countryx = "World";
        leaguex = "UEFA Champions League";
        season = $("#season").val();
      }
      if (this.value == "EuropaLeague") {
        countryx = "World";
        leaguex = "UEFA Europa League";
        season = $("#season").val();
      }
      if (this.value == "PremierLeague") {
        countryx = "England";
        leaguex = "Premier League";
        season = $("#season").val();
      }
      if (this.value == "Championship") {
        countryx = "England";
        leaguex = "Championship";
        season = $("#season").val();
      }
      if (this.value == "LeagueOne") {
        countryx = "England";
        leaguex = "League One";
        season = $("#season").val();
      }
      if (this.value == "Bundesliga") {
        countryx = "Germany";
        leaguex = "Bundesliga 1";
        season = $("#season").val();
      }
      if (this.value == "Bundesliga2") {
        countryx = "Germany";
        leaguex = "Bundesliga 2";
        season = $("#season").val();
      }
      if (this.value == "3Liga") {
        countryx = "Germany";
        leaguex = "Liga 3";
        season = $("#season").val();
      }
      if (this.value == "LaLiga2") {
        countryx = "Spain";
        leaguex = "Segunda Division";
        season = $("#season").val();
      }
      if (this.value == "LaLiga") {
        countryx = "Spain";
        leaguex = "La Liga";
        season = $("#season").val();
      }
      if (this.value == "SerieA") {
        countryx = "Italy";
        leaguex = "Serie A";
        season = $("#season").val();
      }
      if (this.value == "SerieB") {
        countryx = "Italy";
        leaguex = "Serie B";
        season = $("#season").val();
      }
      if (this.value == "Eredivise") {
        countryx = "Netherlands";
        leaguex = "Eredivisie";
        season = $("#season").val();
      }
      if (this.value == "Ligue1") {
        countryx = "France";
        leaguex = "Ligue 1";
        season = $("#season").val();
      }
      if (this.value == "PrimeiraLiga") {
        (countryx = "Portugal"), "Primeira Liga";
        leaguex = "Primeira Liga";
        season = $("#season").val();
      }
    }
  });
});

async function getContent(countryx, leaguex, season) {
  var yyyy = season;
  var country = countryx;
  var data = [];

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
      if (res.api.results == 0) {
        $.ajax({
          url: "fetch_leagues_else",
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
            if (res.api.results !== 0) {
              data = res.api.leagues;
            }
          },
        });
      } else {
        data = res.api.leagues;
      }
    },
  });

  var league_ex = data.filter((item) => item.name == leaguex);
  var standings_ex = [];
  if (league_ex !== []) {
    var league_id_ex = league_ex[0].league_id;
    var seasonYear = Number(season) + 1;
    var content_logo =
      "<img width='50' height='50' src='" +
      league_ex[0].logo +
      "'>&nbsp;&nbsp;&nbsp;<div><h6>" +
      league_ex[0].country.toUpperCase() +
      "</h6><div class='leagueYear'><h4>" +
      league_ex[0].name.toUpperCase() +
      "</h4><span>" +
      " (" +
      season +
      "-" +
      seasonYear +
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
      }),
      processData: false,
      success: function (res) {
        if (res.api.results !== 0) {
          standings_ex = res.api.standings[0];
          var content =
            " <p style='font-weight:bold;'>" +
            league_ex[0].name.toUpperCase() +
            "</p>" +
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
          standings_ex.forEach((el) => {
            content +=
              "<tr>" +
              "<td style='width:5%'>" +
              el.rank +
              "</td>" +
              "<td style='width:50%;text-align:left;'><img class='Image TeamIcon' width='22' height='22' src='" +
              el.logo +
              "'>&nbsp;&nbsp;&nbsp;" +
              el.teamName +
              "</td>" +
              "<td style='width:5%'>" +
              el.all.matchsPlayed +
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
              el.all.goalsFor +
              " - " +
              el.all.goalsAgainst +
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
        }
      },
    });
  }
}
$("#refresh").click(function () {
  var season = $("#season").val();
  getContent(countryx, leaguex, season);
});

$("#refresh").click(function () {
  $(this).addClass("fa-spin");
  var $el = $(this);
  setTimeout(function () {
    $el.removeClass("fa-spin");
  }, 1000);
});
