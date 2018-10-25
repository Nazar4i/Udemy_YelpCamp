var express = require("express"); // подключение фреймворка express
var app = express(); // вызов функции express
var bodyParser = require("body-parser"); // Подключение модуля парсинга
// body-parser - middleware для обработки post запросов
// BodyParser обрабатывает тела запросов и выставляет для них req.body
var mongoose = require("mongoose"); // подключение библиотеки БД
var Campground  = require("./models/campground"); // подключение модели и схемы Campground
var seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/yelp_camp-v3"); // открываем соединение с базой под именем /yelp_camp-v3
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // уставновка движка шаблонизатора ejs
// seedDB(); 

// Определяем обработчик маршрута "/"
app.get("/", function(req, res){
    res.render("landing");
});

// Определяем обработчик маршрута "/campgrounds"
app.get("/campgrounds", function(req, res){
    // Получаем все campground с БД
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("index",{campgrounds:allCampgrounds});
       }
    });
});

// Определяем обработчик маршрута "/campgrounds" метода post
// Добавляем campground к БД
app.post("/campgrounds", function(req, res){
    // получаем информацию с полей и добавляем в массив campground
    var name = req.body.name;
    var image = req.body.imaЦge;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
     // Создаем новый campground и сохранаем в БД
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Определяем обработчик маршрута "/campgrounds/new" 
// Показываем форму для создания новых campgrounds
app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

// Определяем обработчик маршрута "/campgrounds/:id"
// Показываем больше информации об одном конкретном campground
app.get("/campgrounds/:id", function(req, res){
    // находим campground с соответствующим ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        //  foundCampground - Инфо что возвращается после findById
        // TODO 
        // learn https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/5086494
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show" , {campground: foundCampground}); // Внутри шаблона show получаем доступ к campground
            // и у него будет значение что мы нашли тут -  Campground.findById(req.params.id)
        }
    });
})

app.listen(7777, '0.0.0.0', function(){
   console.log("The YelpCamp Server Has Started!");
});