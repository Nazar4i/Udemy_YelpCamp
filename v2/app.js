var express = require("express"); // подключение фреймворка express
var app = express(); // вызов функции express
var bodyParser = require("body-parser"); // Подключение модуля парсинга
// body-parser - middleware для обработки post запросов
// BodyParser обрабатывает тела запросов и выставляет для них req.body
var mongoose = require("mongoose"); // подключение библиотеки БД

mongoose.connect("mongodb://localhost/yelp_camp-v2"); // открываем соединение с базой под именем /yelp_camp-v2
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // уставновка движка шаблонизатора ejs

// Создание схемы со свойствами для campground
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema); // определение модели базы

// Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });

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
   res.render("new"); 
});

// Определяем обработчик маршрута "/campgrounds/new"
// Показываем больше информации об одном конкретном campground
app.get("/campgrounds/:id", function(req, res){
    // находим campground с соответствующим ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(7777, '0.0.0.0', function(){
   console.log("The YelpCamp Server Has Started!");
});