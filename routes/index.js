
// home page
exports.index = function(req, res){
  res.render('index');
};

// client-side view
exports.view = function(req, res){
  res.render('client/' + req.params.view);
};