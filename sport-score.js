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

function getCurrentScore (scoreboard, competition) {
  let score = 0; 
  for (const event of scoreboard.events) {
    if (event.id == competition.id) {
      if (event.competitions[0].competitors[0].id == competition.teamId) {
        score = event.competitions[0].competitors[0].score;
      } else {
        score = event.competitions[0].competitors[1].score;
      }
    }
  }
  return score;
}

function getTeamRecord (scoreboard, competition) {
  let record = '0-0'; 
  for (const event of scoreboard.events) {
    if (event.id == competition.id) {
      if (event.competitions[0].competitors[0].id == competition.teamId) {
        record = event.competitions[0].competitors[0].records[0].summary;
      } else {
        record = event.competitions[0].competitors[1].records[0].summary;
      }
    }
  }
  return record;
}

async function getScoreboard (competition) {
  let url = 'https://site.api.espn.com/apis/site/v2/sports/' + competition.sport + '/' + competition.league + '/scoreboard';
  let score = 0;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const scoreboard = await request.loadJSON();

  return scoreboard;
}

async function addCompetition (main, teamData, info) {
  let gameData = teamData.team.nextEvent[0].competitions[0];
  let gameStatus = gameData.status.type.shortDetail;
  let gameState = gameData.status.type.state;
  let homeTeamPath = gameData.competitors[0];
  let awayTeamPath = gameData.competitors[1];
  
  let htImage = await getTeamLogo(homeTeamPath.team.logos[0].href);
  let atImage = await getTeamLogo(awayTeamPath.team.logos[0].href);
  
  let htScore = 0;
  let atScore = 0;
  let htRecord = '';
  let atRecord = '';
  // The scoreboard has in-game data and team record data.
  let scoreboard = await getScoreboard({
    "sport": info.sport,
    "league":info.league
  });

  // Game has started or ended, we need to get the score.
  if (gameState != "pre") {
    htScore = getCurrentScore(scoreboard, {
      "id":teamData.team.nextEvent[0].id,
      "teamId":homeTeamPath.id
    });

    atScore = getCurrentScore(scoreboard, {
      "id":teamData.team.nextEvent[0].id,
      "teamId":awayTeamPath.id,
    });
  } 
  htRecord = getTeamRecord(scoreboard, {
    "id":teamData.team.nextEvent[0].id,
    "teamId":homeTeamPath.id,
  });

  atRecord = getTeamRecord(scoreboard, {
    "id":teamData.team.nextEvent[0].id,
    "teamId":awayTeamPath.id,
  });
  
  
  let competition = main.addStack();
  competition.layoutVertically();
  competition.spacing = 10;
  let awayTeam = competition.addStack();
  awayTeam.layoutHorizontally();
  let homeTeam = competition.addStack();
  homeTeam.layoutHorizontally();

  // Set status info
  let displayStatus = competition.addStack();
  let statusText = displayStatus.addText(gameStatus.toUpperCase());
  statusText.font = smallFont;
  displayStatus.centerAlignContent();
  

  // Set away team info
  awayTeam.size = new Size(110, 45);
  awayTeam.spacing = 40;
  
  let awayImageRecordStack = awayTeam.addStack();
  awayImageRecordStack.layoutVertically();

  let awayTeamImageStack = awayImageRecordStack.addStack(); 
  awayTeamImageStack.addSpacer();
  let awayTeamImage = awayTeamImageStack.addImage(atImage);
  awayTeamImage.imageSize = new Size(30, 30);
  awayTeamImageStack.addSpacer();

  let awayTeamRecordStack = awayImageRecordStack.addStack();
  awayTeamRecordStack.addSpacer();
  let awayTeamRecord = awayTeamRecordStack.addText(atRecord);
  // awayTeamRecord.centerAlignText();
  awayTeamRecord.font = smallFont;
  awayTeamRecordStack.addSpacer();
  
  let awayTeamScore = awayTeam.addText("" + atScore);
  awayTeamScore.font = largeFont;
  awayTeamScore.rightAlignText();

  // Set home team info
  homeTeam.size = new Size(110, 45);
  homeTeam.spacing = 40;
  
  let homeImageRecordStack = homeTeam.addStack();
  homeImageRecordStack.layoutVertically();

  let homeTeamImageStack = homeImageRecordStack.addStack(); 
  homeTeamImageStack.addSpacer();
  let homeTeamImage = homeTeamImageStack.addImage(htImage);
  homeTeamImage.imageSize = new Size(30, 30);
  homeTeamImageStack.addSpacer();
  
  let homeTeamRecordStack = homeImageRecordStack.addStack();
  homeTeamRecordStack.addSpacer();
  let homeTeamRecord = homeTeamRecordStack.addText(htRecord);
  // homeTeamRecord.centerAlignText();
  homeTeamRecord.font = smallFont;
  homeTeamRecordStack.addSpacer();
  
  // homeImageRecordStack.centerAlignContent();
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
    await addCompetition(main, teamData, fav);
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
