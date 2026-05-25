/* 
   May 21, 2026
   CHANGES:
   fix: date input restrict past dates & manual input validation
   fix: missing dates on download pdf using window.print();
   fix: signature upload required
   feat: reset form to reset all inputs

   May 22, 2026
   CHANGES:
   add:col_ticket, channel_id to the getData(); and buildSQL();
   add: disabled download btn
   style: status message 
   fix: tab key on dates
   add: updateDownloadButton() for disable state'
   
   May 25, 2026
   CHANGES: 
   add: maxlength for textarea == 1000
   May 25, 2026-V2::CHANGES
   add: function for the textarea count limit:: setupCharCounter(textareaId, counterId)
   fix: clipping message on text area using show hidden data -> remove hidden data -> back to initial
   style: added reset style for the char count
   add: syncAllPrintFields() function to sync the real data to the hidden data for print.
   MAY 25, 2026-V3-working::CHANGES
   style: date and time at the top right for date tracking of export.

*/

      /* !FUNCTIONS FOR VALIDATION AND INPUT DISPLAY! */
      
      // Format it for a specific locale (e.g., 'en-PH' for Philippines English)
      function showTime(){
        const now = new Date();
        
        const options = {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
      
        const phTime = new Intl.DateTimeFormat('en-PH', options).format(now);
        document.getElementById('dateToday').innerHTML = phTime;
      }
      
      setInterval(function () {
      	showTime();
      }, 1000);
      
      // sync reflect when typing the name
      const nameInput = document.getElementById('name');
      const displayEmpName = document.getElementById('employee_signature');
      
      nameInput.addEventListener('keyup', function (event) {
      displayEmpName.textContent = nameInput.value;
  });
  

    // validation to check if 6 digits
    function checkEmpNum() {
        const empNum = document.getElementById('empNum').value.trim();
        const error = document.getElementById('empNumError');
    
        const isEmpNumValid = /^\d{6}$/.test(empNum);
    
        if (!isEmpNumValid) {
            error.textContent = "Employee number must be exactly 6 digits";
            toggleFields(true);
        } else {
            error.textContent = "";
            toggleFields(false);
            
        }
    }

    // setting disabled to false
    function toggleFields(disabled){
      document.getElementById('coaching_type').disabled = disabled;
      document.getElementById('col_ticket').disabled = disabled; 
      document.getElementById('channel_id').disabled = disabled; 
      document.getElementById('level').disabled = disabled; 
      document.getElementById('followup').disabled = disabled;
      
      }

    // Activation of the other coaching types when "others" is selected
    const coaching_type = document.getElementById('coaching_type');
    const others = document.getElementById('coaching_others');

    coaching_type.addEventListener('change', function () {
    
        const isOthers = coaching_type.value === "COH";

    	others.disabled = !isOthers;

    if (!isOthers) {
        others.value = "";
    }

    });
    
    // validation to prevent past dates
  	const minDate = new Date().toISOString().split('T')[0];
  	document.querySelectorAll('.limit_past').forEach(input => {
        input.setAttribute('min', minDate);
    });
  	
  	// prevent escaping characters for the sql query build string
  	function escapeSQL(value) {
      	 return String(value).replace(/'/g, "''");
  	}
  	
  	// download button disabled
  	const downloadBtn = document.getElementById('downloadBtn');
    window.addEventListener("DOMContentLoaded", () => {
        downloadBtn.disabled = true;
    });
    
    // updates the state of download button
    function updateDownloadButton() {
        downloadBtn.disabled = !isValid(getData());
    }

    document.querySelectorAll('input, select, textarea').forEach(el => {
    
        el.addEventListener('input', updateDownloadButton);
    
        el.addEventListener('change', updateDownloadButton);
    });

    
    function showStatus(message, type) {
        const box = document.getElementById("statusBox");
    
        box.textContent = message;
        box.className = type;
        box.style.display = "block";
    
        setTimeout(() => {
            box.style.display = "none";
        }, 3000);
    }

    // this sets the limit of character count per text area
    function setupCharCounter(textareaId, counterId) {
    
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
    
        const limit = textarea.maxLength;
    
        textarea.addEventListener('keyup', () => {
    
            const currentLength = textarea.value.length;
    
            counter.innerText = `${currentLength}/${limit}`;
    
            if (currentLength >= limit) {
                counter.style.color = 'red';
            } else if(currentLength >= 800){
                counter.style.color = 'orange'
            } else {
                counter.style.color = 'black';
            }
    
        });
    }

    setupCharCounter('desc','descMaxCharCount' );
    setupCharCounter('promise','empMaxCharCount' );
    setupCharCounter('supervisor','svMaxCharCount' );
    
    // this dynamically expands the textarea base on the length of text
    function autoResizeTextarea(textarea) {
    
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + 2 +"px";
    }

    const textareas = document.querySelectorAll("textarea");
    
    // this is updating the size of textareas while typing
    textareas.forEach(textarea => {
    
        // initial resize
        autoResizeTextarea(textarea);
    
        // resize while typing
        textarea.addEventListener("input", () => {
    
        autoResizeTextarea(textarea);
    
        syncAllPrintFields() // this sync the hidden layout for print
    });
    
    });

    // this sync all print fields from the real value
    function syncAllPrintFields() {
        // List of every input/select ID and its corresponding _print div ID
        const fields = [
            ['team', 'team_print'],
            ['name', 'name_print'],
            ['empNum', 'empNum_print'],
            ['position', 'position_print'],
            ['desc', 'desc_print'],
            ['coaching_type', 'coaching_type_print'],
            ['coaching_others', 'coaching_others_print'],
            ['col_ticket', 'col_ticket_print'],
            ['channel_id', 'channel_id_print'],
            ['level', 'level_print'],
            ['followup', 'followup_print'],
            ['promise', 'promise_print'],
            ['supervisor', 'supervisor_print'],
            ['supervisor_signature', 'supervisor_signature_print'],
            ['sign-date', 'sign-date_print'],
            ['supervisor-sign-date', 'supervisor-sign-date_print']
        ];
    
        fields.forEach(([inputId, printId]) => {
            const input = document.getElementById(inputId);
            const printDiv = document.getElementById(printId);
            if (!input || !printDiv) return;
    
            if (input.tagName === "SELECT") {
                // For selects, get the text of the selected option, not the value code
                printDiv.innerText = input.options[input.selectedIndex]?.text || "";
            } else {
                printDiv.innerText = input.value;
            }
        });
    }




    /*! FUNCTIONS FOR MAIN PROCESS !*/
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
            coaching_type: document.getElementById("coaching_type").value,
      	    col_ticket: document.getElementById("col_ticket").value,
      	    channel_id: document.getElementById("channel_id").value,
            level: document.getElementById("level").value,
            followup: document.getElementById("followup").value,
	    
            //signees name
            supervisor_signature: document.getElementById("supervisor_signature").value,
            employee_signature: document.getElementById("employee_signature").textContent,
            // manager_signature: document.getElementById("manager_signature").value,
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

        };
    }

    // Use for the validation of inputs to ensure all data is available
    function isValid(data) {

    const hasEmployeeSign =
        document.getElementById("employeeSign").files.length > 0;

    const hasSupervisorSign =
        document.getElementById("supervisorSign").files.length > 0;

    return (
        data.team &&
        data.empNum &&
        data.name &&
        data.position &&
        data.desc &&
        data.coaching_type &&
        data.col_ticket &&
        data.channel_id &&
        data.level &&
        data.followup &&
        data.promise &&
        data.supervisor &&
        data.supervisor_signature &&
        data.employee_signature &&
        hasEmployeeSign &&
        hasSupervisorSign
    );
}

    // You can edit this function according to what query you want but double check the ID's of the input fields
    function buildSQL(d) {
        return `
        INSERT INTO coaching_log 
        (   team, 
            emp_num, 
            name, 
            position, 
            description, 
            coaching_type,
      	    col_ticket,
      	    channel_id, 
            level, 
            followup, 
            promise, 
            supervisor)

        VALUES 
        ('${escapeSQL(d.team)}', 
        '${escapeSQL(d.empNum)}', 
        '${escapeSQL(d.name)}', 
        '${escapeSQL(d.position)}', 
        '${escapeSQL(d.desc)}', 
        '${escapeSQL(d.coaching_type)}', 
      	'${escapeSQL(d.col_ticket)}',
      	'${escapeSQL(d.channel_id)}',
        '${escapeSQL(d.level)}', 
        '${escapeSQL(d.followup)}', 
        '${escapeSQL(d.promise)}', 
        '${escapeSQL(d.supervisor)}');
        `;
    }

    // downloadFile() handles the creation of txt file for the string query
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    // Handles the PDF layout using the html2canvas. ~NOTE! the output is an snapshot of the whole selected form
    async function generatePDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById("coachingForm");
        const controls = document.querySelectorAll(".pdf-controls");
    
        // 1. Sync data to the printable divs
        syncAllPrintFields();
    
        // 2. Hide UI elements and switch to capture mode
        controls.forEach(el => el.classList.add("hide-in-pdf"));
        document.body.classList.add("capture-mode");
    
        // 3. Wait for the DOM to reflow/render the hidden/shown elements
        await new Promise(r => setTimeout(r, 300)); 
    
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY
        });
    
        // 4. Revert UI immediately after capture
        document.body.classList.remove("capture-mode");
        controls.forEach(el => el.classList.remove("hide-in-pdf"));
    
        // 5. Generate the PDF file...
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
    
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
    
        const margin = 10;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        let heightLeft = imgHeight;
        let position = 0;
    
        pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    
        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
    
        pdf.save("coaching_log_captured.pdf");
    }

    // Function to build the string SQL and ensures all data is present
    function exportSQL(){
            const data = getData();

    if (!isValid(data)) {
        showStatus("Please fill all fields first.", "error");
        return false;
      }

        const sql = buildSQL(data);
        downloadFile(sql, `coaching_log_${data.empNum}.txt`);
        return true;
    }

    // This handles the download button actions all at once    
    async function handleDownload() {
        
        const ok = exportSQL(); 
        if (!ok) return;
	      showStatus("SQL file generated successfully.", "success");
        await generatePDF();

        window.onafterprint = () => {
            resetForm();
            window.onafterprint = null;
        };

      	window.print();
    }

    /*For image upload and preview */
    const objectURLMap = {}; // temp storage for image object URLs

    // This handles the image upload and check if there is a previous temporary link
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

    // Function to clearImage along with its temporary link for cleaning
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
    
    // This function is for the display of image selected
    window.onload = function () {
	      document.getElementById("logo").src = base64_logohomecredit;
        attachImagePreview("screenshot", "screenshotPreview");
        attachImagePreview("supervisorSign", "supervisorSignPreview");
        attachImagePreview("employeeSign", "employeeSignPreview");
        syncAllPrintFields()
       
       };
    
    // This function resets the form inputs when Reset Form is clicked
    function resetForm() {

    // reset form fields
    document.getElementById("coachingForm").reset();

    // clear dynamic employee signature text
    document.getElementById("employee_signature").textContent = "";

    // clear validation message
    document.getElementById("empNumError").textContent = "";

    // disable fields again
    toggleFields(true);

    // disable coaching others
    document.getElementById("coaching_others").disabled = true;

    // clear image previews
    clearImage("screenshot", "screenshotPreview");
    clearImage("employeeSign", "employeeSignPreview");
    clearImage("supervisorSign", "supervisorSignPreview");

    // reset select placeholders
    document.getElementById("coaching_type").selectedIndex = 0;
    document.getElementById("coaching_others").selectedIndex = 0;
    document.getElementById("channel_id").selectedIndex = 0;
    document.getElementById("level").selectedIndex = 0;

    downloadBtn.disabled = true;
    document.getElementById("statusBox").style.display = "none";
    document.getElementById("statusBox").className = "";
    document.getElementById("statusBox").textContent = "";

    // reset char count
  	document.querySelectorAll('.char-count').forEach(counter => {
      	counter.textContent = "0/1000";
      	counter.style.color = "black";
  	});
    
    // reset the messy ahh layout
    document.querySelectorAll("textarea").forEach(textarea => {
        textarea.style.height = "auto";
        autoResizeTextarea(textarea);
    });
}

// console.log(base64_logohomecredit); uncomment for check of base64_logohomecredit if loading
