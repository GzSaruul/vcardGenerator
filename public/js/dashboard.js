function filterTable() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const rows = document.querySelectorAll(".employee-table-body tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}