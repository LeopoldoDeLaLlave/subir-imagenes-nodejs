const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const multer = require('multer');


//Initializations
const app = express();

//Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4()+path.extname(file.originalname.toLocaleLowerCase()));
    }
});

const upload = multer({
    storage,
    limits:{fieldSize: 1000000},
    fileFilter:(req, file, cb)=>{
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: Archivo debe ser una imagen válida");
    }
}).single('image');

app.use(upload);
//Routes
app.use(require('./routes/index.routes'));

//Static files

app.use(express.static(path.join(__dirname, 'public')));

//Start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});