// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;

//@ts-check
// Fonts
let smallFont = new Font("HelveticaNeue-Light", 12);
let largeFont = new Font("AppleSDGothicNeo-SemiBold", 22);


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

async function getTeamLogo(url) {
  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const image = await request.loadImage();

  // Return the returned launch data
  return image;
}

function addCompetition (main, teamData) {
  let gameStatus = teamData.team.nextEvent[0].competitions[0].status.type.shortDetail;
  let gameState = teamData.team.nextEvent[0].competitions[0].status.type.state;
  let homeTeamPath = teamData.team.nextEvent[0].competitions[0].competitors[0];
  let awayTeamPath = teamData.team.nextEvent[0].competitions[0].competitors[1];
  let htCode = homeTeamPath.team.abbreviation;
  let htImage = await getTeamLogo(homeTeamPath.team.logos[0].href);
  let htScore = gameState == "pre" ? 0 : homeTeamPath.score.value;
  let atCode = awayTeamPath.team.abbreviation;
  let atImage = await getTeamLogo(awayTeamPath.team.logos[0].href);
  let atScore = gameState == "pre" ? 0 : awayTeamPath.score.value;
  
  let competition = main.addStack();
  // competition.borderWidth = 1;
  competition.layoutVertically();
  competition.spacing = 10;
  let awayTeam = competition.addStack();
  // awayTeam.borderWidth = 1;
  awayTeam.layoutHorizontally();
  let homeTeam = competition.addStack();
  // homeTeam.borderWidth = 1;
  homeTeam.layoutHorizontally();

  // Set status info
  let displayStatus = competition.addStack();
  let statusText = displayStatus.addText(gameStatus.toUpperCase());
  statusText.font = smallFont;
  displayStatus.centerAlignContent();
  

  // Set away team info
  awayTeam.size = new Size(100, 20);
  awayTeam.spacing = 40;
  let awayTeamImage = awayTeam.addImage(atImage);
  // awayTeamCode.font = largeFont;
  // awayTeamCode.leftAlignText();
  awayTeamImage.imageSize = new Size(30, 30);
  let awayTeamScore = awayTeam.addText("" + atScore);
  awayTeamScore.font = largeFont;
  awayTeamScore.rightAlignText();

  // Set home team info
  homeTeam.size = new Size(100, 20);
  homeTeam.spacing = 40;
  let homeTeamImage = homeTeam.addImage(htImage);
  // homeTeamCode.font = largeFont;
  // homeTeamCode.leftAlignText();
  homeTeamImage.imageSize = new Size(30, 30);
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
    await addCompetition(main, teamData);
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
