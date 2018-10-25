var express = require("express"); // подключение фреймворка express
var app = express(); // вызов функции express
var bodyParser = require("body-parser"); // Подключение модуля парсинга
// body-parser - middleware для обработки post запросов
// BodyParser обрабатывает тела запросов и выставляет для них req.body
var mongoose = require("mongoose"); // подключение библиотеки БД
var Campground  = require("./models/campground"); // подключение модели и схемы Campground
var Comment = require("./models/comment"); // подключение модели и схемы Comments
var seedDB = require("./seeds");
    
mongoose.connect("mongodb://localhost/yelp_camp-v4"); // открываем соединение с базой под именем /yelp_camp-v4
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // уставновка движка шаблонизатора ejs
seedDB(); 

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
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

// Определяем обработчик маршрута "/campgrounds" метода post
// Добавляем campground к БД
app.post("/campgrounds", function(req, res){
    // получаем информацию с полей и добавляем в переменную newCampground
    var name = req.body.name;
    var image = req.body.image;
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
   res.render("campgrounds/new"); 
});

// Определяем обработчик маршрута "/campgrounds/:id"
// Показываем больше информации об одном конкретном campground
app.get("/campgrounds/:id", function(req, res){
    // находим campground с соответствующим ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        //  foundCampground - Инфо что возвращается после findById
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show" , {campground: foundCampground}); // Внутри шаблона show получаем доступ к campground
            // и у него будет значение что мы нашли тут -  Campground.findById(req.params.id)
        }
    });
});

// ====================
// COMMENTS ROUTES
// ====================
// Определяем обработчик маршрута "/campgrounds/:id/comments/new"
app.get("/campgrounds/:id/comments/new", function(req, res){
    // находим campground с соответствующим ID
    Campground.findById(req.params.id, function(err, campground){
        //  campground - Инфо что возвращается после findById
        if(err){
            console.log(err);
        } else {
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    })
});

// Определяем обработчик маршрута "/campgrounds/:id/comments" метода post
// Добавляем comment к БД
app.post("/campgrounds/:id/comments", function(req, res){
   // находим campground с соответствующим ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

app.listen(7777, '0.0.0.0', function(){
    console.log("The YelpCamp Server Has Started!");
 });