// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;

//@ts-check

const favorites = [{
  "sport":"football", 
  "league":"nfl", 
  "team":"SF"
},{
  "sport":"football",
  "league":"nfl",
  "team":"LV"
}];
async function getTeamData(sport, league, team) {
  const baseUrl = "https://site.api.espn.com/apis/site/v2/sports/";
  // Query url
  const url = baseUrl + sport + '/' + league + '/teams/' + team;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const response = await request.loadJSON();

  // Return the returned launch data
  return response;
};

function addCompetition (main, teamData) {
  let homeTeamPath = teamData.team.nextEvent.competitions[0].competetors[0];
  let htCode = homeTeamPath.team.abbreviation;
  let htScore = homeTeamPath.score;

  let awayTeamPath = teamData.team.nextEvent.competitions[0].competetors[1];
  let atCode = awayTeamPath.team.abbreviation;
  let atScore = awayTeamPath.score;

  
  let competition = main.addStack();
  competition.layoutVertically();
  let awayTeam = competition.addStack();
  awayTeam.layoutHorizontally();
  let homeTeam = competition.addStack();
  homeTeam.layoutHorizontally();

  awayTeam.size = new Size(60, 20);
  awayTeam.spacing = 20;
  let awayTeamCode = awayTeam.addText(atCode);
  awayTeamCode.leftAlignText();
  let awayTeamScore = awayTeam.addText("" + atScore);
  awayTeamScore.rightAlignText();

  homeTeam.size = new Size(60, 20);
  homeTeam.spacing = 20;
  let homeTeamCode = homeTeam.addText(htCode);
  homeTeamCode.leftAlignText();
  let homeTeamScore = homeTeam.addText("" + htScore);
  homeTeamScore.rightAlignText();
}

function getHomeTeam (competitors) {
  if (competitors[0].homeAway == "home"){
    return competitors[0].team.abbreviation;
  } 
  return competitors[1].team.abbreviation;
}

function getAwayTeam (competitors) {
  if (competitors[0].homeAway == "away"){
    return competitors[0].team.abbreviation;
  } 
  return competitors[1].team.abbreviation;
}

/**
 * Create the widget
 * @param {{widgetParameter: string, debug: string}} config widget configuration
 */
async function createWidget(config) {
    const log = config.debug ? console.log.bind(console) : function () {};
    log(JSON.stringify(config, null, 2))

    let message = 'Hello World!'
    let param = config.widgetParameter
    if (param != null && param.length > 0) {
        message = param
    }

    // @ts-ignore
    // let cellSize = new Size(100, 40);
    let widget = new ListWidget();
    let main = widget.addStack();
    main.layoutHorizontally();

    favorites.forEach(fav) {
      await teamData = getTeamData(fav.sport, fav.league, fav.team);
      addCompetition(main, teamData);
    }
    
  

    return widget
};



// Get Teams:
// basketball/nba/teams
// baseball/mlb/teams
// football/nfl/teams
// football/ncaa/teams
// https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams
// ESPN API endpoint for team data
// https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/SF


module.exports = {
    createWidget
}
