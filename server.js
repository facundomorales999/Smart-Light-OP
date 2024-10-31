const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar a 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

// Ruta para servir archivos estáticos
app.use(express.static('public'));

// Ruta para manejar la subida de imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    // Aquí puedes agregar la lógica para enviar una notificación
    enviarNotificacion(req.file.filename)
        .then(() => {
            res.json({ message: 'Imagen subida y notificación enviada correctamente', filename: req.file.filename });
        })
        .catch(err => {
            res.status(500).json({ message: 'Imagen subida pero fallo al enviar notificación', error: err.message });
        });
});

// Función para enviar notificación (ejemplo usando correo electrónico)
async function enviarNotificacion(filename) {
    // Configura el transporte de correo
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Por ejemplo, usando Gmail
        auth: {
            user: 'tuemail@gmail.com',
            pass: 'tucontraseña' // Considera usar variables de entorno para seguridad
        }
    });

    // Configura el correo
    let mailOptions = {
        from: 'tuemail@gmail.com',
        to: 'destinatario@gmail.com',
        subject: 'Nueva imagen subida',
        text: `Se ha subido una nueva imagen: ${filename}`,
        // Puedes agregar más información o incluso adjuntar la imagen
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://locFACU3alhost:${PORT}`);
});