document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const file = document.getElementById('file').files[0];
    const username = document.getElementById('username').value;

    formData.append('file', file);
    formData.append('username', username);

    try {
        const response = await fetch('/API/V1/getFiles', {
            method: 'POST',
            body: formData,
        });

        const result = await response.text();
        document.getElementById('message').innerText = result;
    } catch (error) {
        document.getElementById('message').innerText = 'Error uploading file.';
    }
});
