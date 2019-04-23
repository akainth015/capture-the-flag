const fileFetchForm = document.querySelector("#file-fetch-widget.widget form");

fileFetchForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(fileFetchForm);
    fetch("/file-viewer", {
        body: JSON.stringify({
            path: formData.get("path")
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
        .then(response => response.text())
        .then(fileContents => {
            document.querySelector("#file-view-widget.widget pre").innerHTML = fileContents;
        });
});