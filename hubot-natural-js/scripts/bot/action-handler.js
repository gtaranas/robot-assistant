const actionHandler = {};

const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, '..', 'actions');
const actions = {};

const nodes = {};
let err_nodes = 0;

actionHandler.registerActions = function(config) {
  for (var action of Array.from(fs.readdirSync(actionsPath).sort())) {
    const action_name = action.replace(/\.js$/, '');
    actions[action_name] = require(path.join(actionsPath, action));
  }

  for (let interaction of Array.from(config.interactions)) {
    var name;
    ({ name, action } = interaction);    
    nodes[name] = new (actions[action])(interaction);
    console.log(nodes[name])
    if (name.substr(0, 5) === "error") {
      err_nodes++;
    }
  }

  if (err_nodes === 0) {
    return console.log("WARNING! You don't have any error nodes, you need at least " +
                "one to garantee that the bot always will respond something");
  }
};

actionHandler.errorNodesCount = () => err_nodes;

actionHandler.takeAction = function(name, res) {
  if ((name == null)) {
    return res.sendWithNaturalDelay("I'm sorry Dave, I'm afraid I can't do that =/");
  } else {
    return nodes[name].process(res);
  }
};

module.exports = actionHandler;
