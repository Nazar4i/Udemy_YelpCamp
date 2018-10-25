var mongoose = require("mongoose");

// Создание схемы со свойствами для campground
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      { // ссылка на схему Comment
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
// експорт модели и схемы Campground
module.exports = mongoose.model("Campground", campgroundSchema);