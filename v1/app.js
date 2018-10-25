var express = require("express"); // подключение модуля фреймворка express
var app = express(); // вызов функции express
var bodyParser = require("body-parser"); // Подключение модуля парсинга
// body-parser - middleware для обработки post запросов
// BodyParser обрабатывает тела запросов и выставляет для них req.body
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // уставновка движка шаблонизатора ejs

// Создание массива обьектов с именем и изображением
var campgrounds = [
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

// Определяем обработчик маршрута "/"
app.get("/", function(req, res){
    res.render("landing"); 
});
// Определяем обработчик маршрута "/campgrounds"
app.get("/campgrounds", function(req, res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

// Определяем обработчик маршрута "/campgrounds" метода post
app.post("/campgrounds", function(req, res){
    // получаем информацию с полей и добавляем в массив campground
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    res.redirect("/campgrounds"); // возвращаемся на страницу "/campgrounds"
});

// Определяем обработчик маршрута "/campgrounds/new" 
app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});


app.listen(7777, '0.0.0.0', function(){
    console.log('Server started!!!! ');
});