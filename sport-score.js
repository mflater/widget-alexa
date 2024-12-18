// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;

//@ts-check
// Fonts
let smallFont = new Font("AppleSDGothicNeo-Thin", 14);
let largeFont = new Font("AppleSDGothicNeo-Thin", 22);


const favorites = [{
  "sport":"football", 
  "league":"nfl", 
  "team":"SF"
},{
  "sport":"basketball",
  "league":"nba",
  "team":"GSW"
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
  let gameState = teamData.status.type.state;
  let homeTeamPath = teamData.competitors[0];
  let awayTeamPath = teamData.competitors[1];
  let htCode = homeTeamPath.team.abbreviation;
  let htScore = gameState == "pre" ? 0 : homeTeamPath.score.value;
  let atCode = awayTeamPath.team.abbreviation;
  let atScore = gameState == "pre" ? 0 : awayTeamPath.score.value;
  
  let competition = main.addStack();
  // competition.borderWidth = 1;
  competition.layoutVertically();
  let awayTeam = competition.addStack();
  awayTeam.borderWidth = 1;
  awayTeam.layoutHorizontally();
  let homeTeam = competition.addStack();
  homeTeam.borderWidth = 1;
  homeTeam.layoutHorizontally();

  // Set status info
  let displayStatus = competition.addStack();
  let statusText = displayStatus.addText(gameStatus.toUpperCase());
  statusText.font = smallFont;
  displayStatus.centerAlignContent();
  

  // Set away team info
  awayTeam.size = new Size(100, 20);
  awayTeam.spacing = 40;
  let awayTeamCode = awayTeam.addText(atCode.padEnd(3, " "));
  awayTeamCode.font = largeFont;
  awayTeamCode.leftAlignText();
  let awayTeamScore = awayTeam.addText("" + atScore);
  awayTeamScore.font = largeFont;
  awayTeamScore.rightAlignText();

  // Set home team info
  homeTeam.size = new Size(100, 20);
  homeTeam.spacing = 40;
  let homeTeamCode = homeTeam.addText(htCode.padEnd(3, " "));
  homeTeamCode.font = largeFont;
  homeTeamCode.leftAlignText();
  let homeTeamScore = homeTeam.addText("" + htScore);
  homeTeamScore.font = largeFont;
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


// NOTES:


// Get Teams:
// basketball/nba/teams
// baseball/mlb/teams
// football/nfl/teams
// football/ncaa/teams
// https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams
// ESPN API endpoint for team data
// https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/SF

// Using: https://gitlab.com/sillium-scriptable-projects/universal-scriptable-widget


module.exports = {
    createWidget
}
