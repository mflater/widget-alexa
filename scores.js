const baseUrl = "https://site.api.espn.com/apis/site/v2/sports/";
async function getTeams(sport, league, team) {
  // Query url
  const url = baseUrl + sport + '/' + league + '/teams/' + team;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const response = await request.loadJSON();

  // Return the returned launch data
  return response;
}

const baseScoreUrl = "http://site.api.espn.com/apis/site/v2/sports/"
async function getScores(sport, league) {
  // Query url
  const url = baseScoreUrl + sport + '/' + league + '/scoreboard';

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const response = await request.loadJSON();

  // Return the returned launch data
  return response;
}

async function createWidget() {
  // Create new empty ListWidget instance
  let widget = new ListWidget();

  let stack = widget.addStack();

  stack.addText("Test");

  // let scores = await getScores('football', 'nfl');
  // let table = new UITable();
  // table.showSeparators = true;
  // populateTable(table, scores);
  // QuickLook.present(table);
  
  // Return the created widget
  return widget;
}

// Script.setWidget(createWidget());

// Shows Amazon Alexa lights and switches connected to the network. Allows on/off toggle
// let scores = await getScores('football', 'nfl');

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
