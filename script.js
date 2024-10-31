/* ===== Lo del tema para luces =====*/

/* function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    const message = document.getElementById('message');
    const imagePreview = document.getElementById('imagePreview'); // Elemento donde se mostrará la imagen

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Verificamos si es un archivo de imagen
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(event) {
                // Mostrar la imagen seleccionada
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;
                imgElement.style.maxWidth = '100%'; // Ajustar el tamaño para que no sobrepase el contenedor
                imgElement.style.marginTop = '20px';

                // Limpiar la vista previa anterior y agregar la nueva imagen
                imagePreview.innerHTML = '';
                imagePreview.appendChild(imgElement);

                message.innerHTML = "¡Imagen subida con éxito!";
                message.style.color = 'green';
            };

            reader.onerror = function() {
                message.innerHTML = "Error al subir la imagen.";
                message.style.color = 'red';
            };

            reader.readAsDataURL(file); // Lee el archivo de la imagen
        } else {
            message.innerHTML = "El archivo seleccionado no es una imagen.";
            message.style.color = 'red';
        }
    } else {
        message.innerHTML = "Por favor, selecciona una imagen.";
        message.style.color = 'red';
    }
}
*/
document.addEventListener('DOMContentLoaded', () => {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');

    // Abrir el selector de archivos al hacer clic en el área
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Manejar la selección de archivos
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            mostrarVistaPrevia(file);
        }
    });

    // Manejar el arrastrar y soltar
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            mostrarVistaPrevia(file);
        }
    });
});

function mostrarVistaPrevia(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista Previa" style="max-width: 100%; height: auto;">`;
    };
    reader.readAsDataURL(file);
}

async function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    const message = document.getElementById('message');

    if (fileInput.files.length === 0) {
        message.textContent = 'Por favor, selecciona una imagen para subir.';
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            message.textContent = result.message;
            // Opcional: Limpiar la vista previa y el input
            document.getElementById('imagePreview').innerHTML = '';
            fileInput.value = '';
        } else {
            message.textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        message.textContent = 'Hubo un error al subir la imagen.';
    }
}