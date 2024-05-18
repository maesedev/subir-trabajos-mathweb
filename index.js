const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port =  process.env.PORT|| 3000 ;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Configurar multer para guardar archivos en la carpeta 'files'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ruta para recibir el archivo y el nombre de usuario
app.post('/API/V1/getFiles', upload.single('file'), (req, res) => {
    const username = req.body.username;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!username) {
        return res.status(400).send('No username provided.');
    }

    const filePath = path.join(__dirname, 'files', file.filename);

    // Ejecutar comandos de Git
    exec(`git add ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send(`Error adding file to git: ${stderr}`);
        }

        const commitMessage = `Added zip file from ${username}`;
        exec(`git commit -m "${commitMessage}"`, (err, stdout, stderr) => {
            if (err) {
                return res.status(500).send(`Error committing file to git: ${stderr}`);
            }

            res.send('File uploaded and committed to git successfully.');
        });
    });
});

// Crear la carpeta 'files' si no existe
if (!fs.existsSync('files')) {
    fs.mkdirSync('files');
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
