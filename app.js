
    function getData() {

        return {

            // employee info
            team: document.getElementById("team").value,
            empNum: document.getElementById("empNum").value,
            name: document.getElementById("name").value,
            position: document.getElementById("position").value,

            // description
            desc: document.getElementById("desc").value,

            // coaching details
            type: document.getElementById("type").value,
            level: document.getElementById("level").value,
            followup: document.getElementById("followup").value,

            //signees name
            supervisor_signature: document.getElementById("supervisor_signature").value,
            employee_signature: document.getElementById("employee_signature").value,
            manager_signature: document.getElementById("manager_signature").value,
            // statements
            promise: document.getElementById("promise").value,
            supervisor: document.getElementById("supervisor").value,

            // screenshot and signatures
            screenshot:
                document.getElementById("screenshot").files[0],

            employeeSign:
                document.getElementById("employeeSign").files[0],

            supervisorSign:
                document.getElementById("supervisorSign").files[0],

            managerSign:
                document.getElementById("managerSign").files[0]
        };
    }

    function isValid(data) {
        return (
            data.team &&
            data.empNum &&
            data.name &&
            data.position &&
            data.desc
        );
    }

    function buildSQL(d) {
        return `
        INSERT INTO coaching_log 
        (   team, 
            emp_num, 
            name, 
            position, 
            description, 
            type, 
            level, 
            followup, 
            promise, 
            supervisor)

        VALUES 
        ('${d.team}', 
        '${d.empNum}', 
        '${d.name}', 
        '${d.position}', 
        '${d.desc}', 
        '${d.type}', 
        '${d.level}', 
        '${d.followup}', 
        '${d.promise}', 
        '${d.supervisor}');
        `;
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById("coachingForm");

        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("coaching_log.pdf");
        });
    }

    function exportSQL(){
            const data = getData();

    if (!isValid(data)) {
        alert("Fill all fields first");
        return;
    }

    const sql = buildSQL(data);
    downloadFile(sql, `coaching_log_${data.empNum}.txt`);
    }
    function handleDownload() {
        exportSQL();
        generatePDF();
        window.print();
    }


    const objectURLMap = {}; // temp storage for object URLs

    function attachImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

           
            if (objectURLMap[inputId]) {
                URL.revokeObjectURL(objectURLMap[inputId]);
            }

            const url = URL.createObjectURL(file);

            objectURLMap[inputId] = url;

            preview.src = url;
            preview.style.display = "block";
        });
    }
    
    function clearImage(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);

        input.value = "";

        if (objectURLMap[inputId]) {
            URL.revokeObjectURL(objectURLMap[inputId]);
            delete objectURLMap[inputId];
        }

        preview.src = "";
        preview.style.display = "none";
    }
    window.onload = function () {
        attachImagePreview("screenshot", "screenshotPreview");
        attachImagePreview("supervisorSign", "supervisorSignPreview");
        attachImagePreview("employeeSign", "employeeSignPreview");
        attachImagePreview("managerSign", "managerSignPreview");
    };