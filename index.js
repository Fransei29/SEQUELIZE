const express = require('express');  // Importa el módulo Express.
const app = express();               // Crea una instancia de la aplicación Express.
const cookieParser = require('cookie-parser') // Middleware para manejar cookies
const session = require('express-session') // Middleware que facilita el manejo de sessiones

const { Sequelize, Model, DataTypes } = require('sequelize')
// Sequelize es una biblioteca de mapeo objeto-relacional (ORM) para Node.js. Su propósito principal es facilitar la gestión de bases de datos SQL en aplicaciones Node.js mediante la abstracción de las operaciones de base de datos en métodos y objetos de JavaScript, lo que permite a los desarrolladores trabajar con bases de datos de manera más intuitiva y segura

require('dotenv').config(); //Importar y cargar las variables de entorno desde el archivo .env

// Sirve archivos estáticos desde la carpeta 'public'.
app.use(express.static('public'));   

// Configuración de express-session
app.use(session({                    
    secret: 'tu secreto muy secreto',
    resave: false,                 // Definir explícitamente resave como false
    saveUninitialized: true,       // Definir explícitamente saveUninitialized como true
    cookie: { secure: true }
}));

// Configura EJS para renderizar archivos .html.
app.engine('html', require('ejs').renderFile); 

// Establece 'html' como el motor de plantillas.
app.set("view engine", "html");      

// Establece './views' como el directorio de plantillas.
app.set('views', './views');         

  // Ruta para '/index' que renderiza 'index.html'.
app.get('/index', (req, res) => {  
    res.render('index')
});

// Ruta raíz que envía 'Hello World!' como respuesta.
app.get('/', (req, res) => res.send('Hello World!')); 

// ----A) Vamos a conectarnos e interactuar con la base de datos usando SEQUELIZE ----
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres',
    logging: false
});


 // ----B) Para cada tabla que querramos manipular, creamos un "modelo" y lo inicializamos ----
class Dog extends Model {}

Dog.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
    sequelize, // Pasamos la instancia de conexión
    modelName: 'Dog', // Nombre del modelo. Usado en el código para referencias (Dog.create, Dog.findAll, etc.)
    tableName: 'dogs', // Especificamos explícitamente el nombre de la tabla como 'dogs'
    timestamps: false // No incluirá columnas de timestamp (createdAt, updatedAt) por defecto
})

// ---- C) Sincronizar el Modelo con la Base de Datos (lo comento para que no se vuelva a crear)
// sequelize.sync({ force: true }) // Ojo: `force: true` borrará la tabla si ya existe y la recreará
//     .then(() => {
//         console.log("La tabla 'dogs' ha sido creada exitosamente.");
//     })
//     .catch(error => {
//         console.error("Error al crear la tabla 'dogs':", error);
//     });

// ----D) Ahora, vamos a insertar informacion en la base de datos ---- (lo comento para que no se vuelva a agregar)
// async function insertDog() {
//     try {
//         const name = 'Boby';
//         const age = 5;
//         const result = await Dog.create({ name, age });
//         console.log('Nuevo perro añadido:', result);
//     } catch (error) {
//         console.error('Error al insertar nuevo perro:', error);
//     }
// }

// insertDog();  // Llamada a la función para insertar datos



// ----E) Ahora, vamos a obtener informacion de la base de datos ----
async function fetchDogs() {
    try {
        const results = await Dog.findAll();
        console.log(results);  // Esto mostrará los resultados en la consola
        return results;  // Puedes retornar los resultados para usar en otra parte de tu aplicación
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

fetchDogs();  // Llamada a la función para obtener los datos

// ----E) Por ultimo, vamos a actualizar(update) cierta informacion de la base de datos ----
Dog.update({
    age: 10
  }, {
    where: {
      name: 'Boby'
    }
  })

// Prueba para corroborar el correcto entrelazamiento de las variables de entorno
console.log(process.env.HOST);


// Integrar el middleware a la app para el manejo de cookies
app.use(cookieParser()) 
// Inicia el servidor en el puerto 3000 y registra un mensaje.
app.listen(3000, () => console.log('Server ready'));  
