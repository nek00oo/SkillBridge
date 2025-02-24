document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("editSchedule");
    const saveButton = document.getElementById("saveSchedule");
    const loadSavedButton = document.getElementById("loadSavedSchedule");
    const form = document.getElementById("scheduleForm");
    const tableContainer = document.getElementById("tableContainer");

    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const scheduleListModal = document.getElementById("scheduleListModal");

    // Создать расписание
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const days = parseInt(document.getElementById("days").value, 10);
        const lessons = parseInt(document.getElementById("lessons").value, 10);
        const language = document.getElementById("language").value;

        tableContainer.innerHTML = "";

        const table = document.createElement("table");
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        headerRow.appendChild(document.createElement("th")).textContent =
            language === "ru" ? "Урок" : "Lesson";

        for (let i = 1; i <= days; i++) {
            headerRow.appendChild(document.createElement("th")).textContent =
                language === "ru" ? `День ${i}` : `Day ${i}`;
        }

        const tbody = table.createTBody();
        for (let lesson = 1; lesson <= lessons; lesson++) {
            const row = tbody.insertRow();
            row.appendChild(document.createElement("th")).textContent =
                language === "ru" ? `Урок ${lesson}` : `Lesson ${lesson}`;

            for (let day = 1; day <= days; day++) {
                row.insertCell().textContent = "";
            }
        }

        tableContainer.appendChild(table);
    });


    // Сохранить расписание
    saveButton.addEventListener("click", () => {
        const table = document.querySelector("#tableContainer table");
        if (!table) {
            alert("Сначала создайте расписание, чтобы его сохранить");
            return;
        }

        const name = prompt("Введите название для сохранения расписания:");
        if (!name) {
            alert("Имя расписания не может быть пустым!");
            return;
        }

        const rows = Array.from(table.rows).map((row) =>
            Array.from(row.cells).map((cell) => cell.textContent)
        );

        const savedSchedules = JSON.parse(localStorage.getItem("savedSchedules")) || [];
        const existingIndex = savedSchedules.findIndex((item) => item.name === name);

        if (existingIndex !== -1) {
            savedSchedules[existingIndex] = { name, rows };
        } else {
            savedSchedules.push({ name, rows });
        }

        localStorage.setItem("savedSchedules", JSON.stringify(savedSchedules));
        alert(`Расписание "${name}" успешно сохранено!`);
    });

    // Выбор расписания
    loadSavedButton.addEventListener("click", () => {
        const savedSchedules = JSON.parse(localStorage.getItem("savedSchedules")) || [];
        scheduleListModal.innerHTML = "";

        if (savedSchedules.length === 0) {
            scheduleListModal.innerHTML = "<li>Нет сохранённых расписаний</li>";
        } else {
            savedSchedules.forEach((schedule) => {
                const li = document.createElement("li");
                li.textContent = schedule.name;
                li.style.cursor = "pointer";
                li.style.padding = "10px";
                li.style.borderBottom = "1px solid #ccc";
                li.addEventListener("click", () => {
                    loadSchedule(schedule.name);
                    closeModal.click();
                });
                scheduleListModal.appendChild(li);
            });
        }

        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Изменить расписание
    editButton.addEventListener("click", () => {
        const table = document.querySelector("#tableContainer table");
        if (!table) {
            alert("Сначала создайте таблицу!");
            return;
        }

        const cells = table.querySelectorAll("td");
        cells.forEach((cell) => {
            cell.setAttribute("contenteditable", "true");
            cell.style.backgroundColor = "#f0f8ff"; // Подсветка
        });

        if (cells.length > 0) {
            cells[0].focus();
        }
    });

    function loadSchedule(name) {
        const savedSchedules = JSON.parse(localStorage.getItem("savedSchedules")) || [];
        const schedule = savedSchedules.find((item) => item.name === name);

        if (schedule) {
            const table = document.createElement("table");
            table_body = table.createTBody()
            schedule.rows.forEach((rowData, rowIndex) => {
                const row = rowIndex === 0 ? table.createTHead().insertRow() : table_body.insertRow();
                rowData.forEach((cellData, columnIndex) => {
                    const cell = (rowIndex === 0 || columnIndex === 0) ? document.createElement("th") : row.insertCell();
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
            });

            tableContainer.innerHTML = "";
            tableContainer.appendChild(table);
        } else {
            alert(`Расписание "${name}" не найдено.`);
        }
    }
});
