// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;

//@ts-check

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
    const widget = new ListWidget()
    
    widget.addText("VFucking work bitch");

    return widget
}

module.exports = {
    createWidget
}
