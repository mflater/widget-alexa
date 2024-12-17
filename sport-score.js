// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;

//@ts-check

async function getTeams(sport, league, team) {
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

async function getScores(sport, league) {
  const baseScoreUrl = "http://site.api.espn.com/apis/site/v2/sports/"
  // Query url
  const url = baseScoreUrl + sport + '/' + league + '/scoreboard';

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const response = await request.loadJSON();

  // Return the returned launch data
  return response;
};

function populateTable(table, scores) {
  table.removeAllRows()
  // Add reminders to the table.
  for (event of scores.events) {
    let row = new UITableRow()
    row.height = 60
    let titleCell = row.addText(getHomeTeam(event.competitions[0].competitors), getAwayTeam(event.competitions[0].competitors))
    titleCell.subtitleColor = Color.red()
    titleCell.widthWeight = 80
    row.dismissOnSelect = false
    //row.onSelect = (idx) => {
    //  let reminder = reminders[idx - 1]
    //  toggleCompleted(reminder)
    //  populateTable(table, reminders)
    //}
    table.addRow(row)
  }
  table.reload()
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
    // let table = new UITable();
    // let rowOne = new UITableRow();
    // let rowTwo = new UITableRow(); 
    
    // let cellOne = rowOne.addText("test 1");
    // cellOne.widthWeight = 100;
    // rowOne.addCell(cellOne);

    // let cellThree = rowOne.addText("test 3");
    // cellThree.widthWeight = 100;
    // rowOne.addCell(cellThree);

    // let cellTwo = rowTwo.addText("test 2");
    // cellTwo.widthWeight = 100;
    // rowTwo.addCell(cellTwo);

    // let cellFour = rowTwo.addText("test 4");
    // cellFour.widthWeight = 100;
    // rowTwo.addCell(cellFour);

    // table.addRow(rowOne);
    // table.addRow(rowTwo);

    // await QuickLook.present(table)
    let cellSize = new Size(100, 40);
    let widget = new ListWidget();
    let main = widget.addStack();
    main.layoutHorizontally();
  
    let competitionOne = main.addStack();
    competitionOne.layoutVertically();
    awayTeam = competitionOne.addStack();
    awayTeam.layoutHorizontally();
    homeTeam = competitionOne.addStack();
    homeTeam.layoutHorizontally();

    awayTeam.size = new Size(60, 20);
    awayTeam.spacing = 60;
    let awayTeamCode = awayTeam.addText("LAR");
    awayTeamCode.leftAlignText();
  
    let awayTeamScore = awayTeam.addText("6");
    awayTeamScore.rightAlignText();

    homeTeam.size = new Size(60, 20);
    let homeTeamCode = homeTeam.addText("SF");
    homeTeamCode.leftAlignText();
    let homeTeamScore = homeTeam.addText("60");
    homeTeamScore.rightAlignText();
  
   // let topLeft = rowOne.addStack();
  
    //topLeft.addText("12345");
    //topLeft.size = cellSize;
    //topLeft.centerAlignContent();
    //topLeft.backgroundColor = new Color('#001100');

    // let bottomLeft = rowOne.addStack();
    // bottomLeft.addText("34567");
    // bottomLeft.size = cellSize;
    // bottomLeft.centerAlignContent();

    // let rowTwo = main.addStack();
    // rowTwo.layoutVertically();
  
    // let topRight = rowTwo.addStack();
    // topRight.addText("23456");
    // topRight.size = cellSize;
    // topRight.centerAlignContent();

    // let bottomRight = rowTwo.addStack();
    // bottomRight.addText("45678");
    // bottomRight.size = cellSize;
    // bottomRight.centerAlignContent();
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
