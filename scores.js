async function createWidget() {
  // Create new empty ListWidget instance
  const widget = new ListWidget();

  let stack = widget.addStack();

  widget.addText("test");
  // stack.addText("Test");

  // let scores = await getScores('football', 'nfl');
  // let table = new UITable();
  // table.showSeparators = true;
  // populateTable(table, scores);
  // QuickLook.present(table);
  
  // Return the created widget
  return widget;
}

module.exports = {
    createWidget
}

