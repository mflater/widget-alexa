// Get Teams:
// basketball/nba/teams
// baseball/mlb/teams
// football/nfl/teams
// football/ncaa/teams
// https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams
// ESPN API endpoint for team data
// https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/SF

let scores = await getScores('football', 'nfl');
let table = new UITable();
table.showSeparators = true;
populateTable(table, scores);
QuickLook.present(table);

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
  let listwidget = new ListWidget();
  let scores = await getScores('football', 'nfl');
  let table = new UITable();
  table.showSeparators = true;
  populateTable(table, scores);
  QuickLook.present(table);
  
  // Return the created widget
  return listwidget;
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

let table = new UITable()
table.showSeparators = true
populateTable(table, scores)
QuickLook.present(table)





/*


let widget = await createWidget();

// Check where the script is running
if (config.runsInWidget) {
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
} else {
  // Show the medium widget inside the app
  widget.presentSmall();
}
Script.complete();

async function createWidget() {
  // Create new empty ListWidget instance
  let listwidget = new ListWidget();

  // Set new background color
  listwidget.backgroundColor = new Color("#000000");

  // Add widget heading
  let heading = listwidget.addText("🚀Next🚀");
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(25);
  heading.textColor = new Color("#ffffff");
  
  // Spacer between heading and launch date
  listwidget.addSpacer(15);
  
  // Fetch next launch date
  let launch = await getNextLaunch();
  let launchDateTime = getLaunchDateTime(launch);

  // Add the launch time to the widget
  displayLaunchDateTime(listwidget, launchDateTime, launch.date_precision);

  // Return the created widget
  return listwidget;
}

async function getNextLaunch() {
  // Query url
  const url = "https://api.spacexdata.com/v4/launches/next";

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const response = await request.loadJSON();

  // Return the returned launch data
  return response;
}

function getLaunchDateTime(launchData) {
  // Parse launch date to new date object
  const launchDateTime = new Date(launchData.date_utc);
  return launchDateTime;
}

function displayLaunchDateTime(stack, launchDateTime, precision) {
  // Check if next launch date is precise enough and display different details based on the precision
  if (precision == "hour") {
    // Add launch date
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    let datestring = launchDateTime.toLocaleDateString(undefined, dateOptions);
    addDateText(stack, datestring);

    // Add launch time
    const timeOptions = { hour: "numeric", minute: "numeric" };
    let timestring = launchDateTime.toLocaleTimeString(undefined, timeOptions);
    addDateText(stack, timestring);
  } else if (precision == "day") {
    // Add launch date
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    let datestring = launchDateTime.toLocaleDateString(undefined, dateOptions);
    addDateText(stack, datestring);
  } else {
    addDateText(stack, "No day for next launch given");
  }
}

function addDateText(stack, text) {
  let dateText = stack.addText(text);
  dateText.centerAlignText();
  dateText.font = Font.semiboldSystemFont(20);
  dateText.textColor = new Color("#ffffff");
}
