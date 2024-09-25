function uploadImage() {
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