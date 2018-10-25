var mongoose = require("mongoose");

// Создание схемы со свойствами для comment
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// експорт модели и схемы Comment
module.exports = mongoose.model("Comment", commentSchema);