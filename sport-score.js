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
  let gameStatus = teamData.status.type.shortDetail;
  let homeTeamPath = teamData.competitors[0];
  let awayTeamPath = teamData.competitors[1];
  // let htCode = homeTeamPath.team.abbreviation;
  // let htScore = homeTeamPath.score.displayValue;
  // let atCode = awayTeamPath.team.abbreviation;
  // let atScore = awayTeamPath.score.displayValue;
  
  let competition = main.addStack();
  competition.layoutVertically();
  let displayStatus = competition.addStack();
  displayStatus.addText(gameStatus);
  let awayTeam = competition.addStack();
  awayTeam.layoutHorizontally();
  let homeTeam = competition.addStack();
  homeTeam.layoutHorizontally();

  awayTeam.size = new Size(100, 20);
  awayTeam.spacing = 40;
  let awayTeamCode = awayTeam.addText(awayTeamPath.team.abbreviation);
  awayTeamCode.leftAlignText();
  let awayTeamScore = awayTeam.addText(awayTeamPath.score.value);
  awayTeamScore.rightAlignText();

  homeTeam.size = new Size(100, 20);
  homeTeam.spacing = 40;
  let homeTeamCode = homeTeam.addText(homeTeamPath.team.abbreviation);
  homeTeamCode.leftAlignText();
  let homeTeamScore = homeTeam.addText(homeTeamPath.score.value);
  homeTeamScore.rightAlignText();
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

  for (const fav of favorites) {
    let teamData = await getTeamData(fav.sport, fav.league, fav.team);
    addCompetition(main, teamData.team.nextEvent[0].competitions[0]);
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
