

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
     fix: file name for js and html:: ec_coaching-5-25-26.html && app-5-25-26.js
     add: maxlength for textarea == 1000
     May 25, 2026-V2::CHANGES
     fix: file name for js and html:: ec_coaching-5-25-26-V2.html && app-5-25-26-V2.js
     add: function for the textarea count limit:: setupCharCounter(textareaId, counterId)
     fix: clipping message on text area using show hidden data -> remove hidden data -> back to initial
     style: added reset style for the char count
     add: syncAllPrintFields() function to sync the real data to the hidden data for print.
     MAY 25, 2026-V3-working::CHANGES
     fix: file name for js and html:: ec_coaching-5-25-26-V3-working.html && app-5-25-26-V3-working.js
     style: date and time at the top right for date tracking of export.
     
     June 2, 2026
     CHANGES:
     fix: file name for js and html:: ec_coaching-6-2-26-V4-working.html && app-6-2-26-V4-working.js
     add: functions for filter inputs for team[checkTeam()] and employee name, position title [validateTextField()]
     add: minlength for textarea == 20
     removed: commented out anything related to channel
     add: function for current date for signature dates
     fix: changed export file name for txt and generate pdf to `${data.name}_${data.coaching_type}_year(year to be update)`
     add: mininum empNum start on 13000 
     style: changed Col ticket for follow up to Dialer Ticket
     
     June 3, 2026
     CHANGES:
     fix: file name for js and html:: ec_coaching-6-3-26-V4-working.html && app-6-3-26-V4-working.js
     add: date function for the file name:: getFormattedDateYYYYMMDD();
     add: function to get the text value of the coaching_type for the file name:: getCoachingTypeLabel();
     add: sanitize function for the file name:: sanitizeFileName(str);
     fix: changed export file name for the txt and generate pdf to fileName = `${sanitizeFileName(data.name)}_${sanitizeFileName(getCoachingTypeLabel())}_${getFormattedDateYYYYMMDD()}.pdf`;
     fix: long text from text area are enclosed with q block:: q'{${d.promise}}', q'{${d.supervisor}}');
     add: function for min limit consist of 3:: setupTextAreaValidation(), validateTextAreaLength(), and checkers: minDesc/Promise/SvActionCheck();
     add: function for Fastball logic:: requiresColTicket() and placed the function to isValid(), buildSQL(), and toggleFields();
     add: function for col/dialer ticket to check max input of 6 and show error message:: checkDialerTicket(); 
     add: function to validate if the dialer ticket is required and show error message if not valid:: validateDialerTicketRequired() and placed in isValid()
     fix: added minimum of 3-5 characters for team, emp and sv name. 5 minimum for the position title:: /^[a-zA-Z\s'-]{3,}$/ && /^[a-zA-Z0-9\s\/\-(),&]{5,}$/;
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
        
        // current date for the signatures 
        function signatureDateToday(dateId) {
        // Use Intl to format exactly to the required 'YYYY-MM-DD' ISO format for Asia/Manila
        const phTimeISO = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date());
      
        // Intl.DateTimeFormat with 'en-US' and 2-digit fields outputs "MM/DD/YYYY"
        const [month, day, year] = phTimeISO.split('/');
        
        // Rearrange into the strict "YYYY-MM-DD" format required by <input type="date">
        document.getElementById(dateId).value = `${year}-${month}-${day}`;
      }

        signatureDateToday('sign-date');
        signatureDateToday('supervisor-sign-date');
        
      // validation to prevent past dates
    	const minDate = new Date().toISOString().split('T')[0];
    	document.querySelectorAll('.limit_past').forEach(input => {
          input.setAttribute('min', minDate);
      });
      
      // date tail for the file name 
      function getFormattedDateYYYYMMDD() {
          const now = new Date();
      
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
      
          return `${year}${month}${day}`;
      }

      // returns the text of the option for the file name
      function getCoachingTypeLabel() {
          const select = document.getElementById("coaching_type");
          return select.options[select.selectedIndex]?.text || "Unknown";
      }

      // sanitize the file name
      function sanitizeFileName(str) {
          return String(str)
              .replace(/[\/\\:*?"<>|]/g, "")
              .replace(/\s+/g, " ")
              .trim();
      }

      // filter for team and employee name
      function validateTextField(inputId, errorId, fieldName) {
          const value = document.getElementById(inputId).value.trim();
          const error = document.getElementById(errorId);
      
          const isValid = /^[a-zA-Z\s'-]{3,}$/.test(value);
      
          if (!isValid) {
              error.textContent =
                  `${fieldName} can only contain letters, spaces, apostrophes, hyphens, and mininum of 3-5 characters.`;
              return false;
          }
      
          error.textContent = "";
          return true;
      }

      // returns the validation message
      function checkTeam() {
          return validateTextField('team', 'teamError', 'Team');
      }

      // sync reflect when typing the name
      const nameInput = document.getElementById('name');
      const displayEmpName = document.getElementById('employee_signature');
      
      nameInput.addEventListener('keyup', function (event) {
      displayEmpName.textContent = nameInput.value;
      });
          
      function checkName() {
          return validateTextField('name', 'nameError', 'Employee name');
      }
      
      // validation to check if 6 digits
      function checkEmpNum(showError = true) {
          const empNum = document.getElementById('empNum').value.trim();
          const error = document.getElementById('empNumError');
      
          const isEmpNumValid = /^\d{6}$/.test(empNum);

          if (!isEmpNumValid) {
              if (showError) {
                  error.textContent = "Employee number must be exactly 6 digits.";
              }
              toggleFields(true);
              return false;
          } 

        const emp = parseInt(empNum, 10);

        if (isNaN(emp) || emp < 130000) {
            error.textContent = "Employee number must start at 130000.";
            return false;
        }
      
          error.textContent = "";
          toggleFields(false);
          return true;
      }
  
      // setting disabled to false
      function toggleFields(disabled){
          const colTicket = document.getElementById('col_ticket');
    
          document.getElementById('coaching_type').disabled = disabled;
          document.getElementById('col_ticket').disabled = disabled; 
          //document.getElementById('channel_id').disabled = disabled; 
          document.getElementById('level').disabled = disabled; 
          document.getElementById('followup').disabled = disabled;
          
          if (!disabled) {
                colTicket.disabled = !requiresColTicket();
            } else {
                colTicket.disabled = true;
            }
          
      }
  
      // activation of the other coaching types when "others" is selected
      const coaching_type = document.getElementById('coaching_type');
      const others = document.getElementById('coaching_others');
  
      coaching_type.addEventListener('change', function () {
          
          const isOthers = coaching_type.value === "COH";
  
      	others.disabled = !isOthers;
  
      if (!isOthers) {
          others.value = "";
      }
  
      });
      
      // activation if dialer ticket is required
          coaching_type.addEventListener('change', function () {
            const data = getData();
        
            col_ticket.disabled = !requiresColTicket();
        
            if (!requiresColTicket()) {
                col_ticket.value = "";
                }
          });
      
      // dialer ticket is required for all except with "Fastball"
      function requiresColTicket() {
          const select = document.getElementById("coaching_type");
          const text = select.options[select.selectedIndex]?.text || "";
      
          return !text.includes("Fastball");
      }
      
      // checks if the col/dialer ticket is 6 digits
      function checkDialerTicket(showError = true){
        const dialerTicket = document.getElementById('col_ticket').value.trim();
        const dialerError = document.getElementById('dialerTicketError');
        
        const isDialerTicketValid = /^\d{6}$/.test(dialerTicket);
        
        if(!isDialerTicketValid){
          if(showError){
            dialerError.textContent = "Dialer ticket must be exactly 6 digits.";
            return false;
          }
        } 
        
        dialerError.textContent = "";
        return true;
        
      }

        function validateDialerTicketRequired() {
            const error = document.getElementById('dialerTicketError');
            const value = document.getElementById('col_ticket').value.trim();

            if (requiresColTicket() && !/^\d{6}$/.test(value)) {
                error.textContent = "Dialer ticket is required (6 digits).";
                return false;
            }

            error.textContent = "";
            return true;
        }

      // filter for position title
      function checkPosition() {
          const value = document.getElementById('position').value.trim();
          const error = document.getElementById('positionError');
      
          const isValid = /^[a-zA-Z0-9\s\/\-(),&]{5,}$/.test(value);
      
          if (!isValid) {
              error.textContent =
                  "Please enter at least 5 characters using only letters, numbers, spaces, and standard symbols (/, -, (), , &).";
              return false;
          }
      
          error.textContent = "";
          return true;
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
  
      setupCharCounter('desc','descMaxCharCount');
      setupCharCounter('promise','empMaxCharCount');
      setupCharCounter('supervisor','svMaxCharCount');
      
      // restrict the min length for text areas to 20 characters
      function setupTextAreaValidation(textareaID, errorID) {
          const textarea = document.getElementById(textareaID);
      
          textarea.addEventListener('keyup', () => {
              validateTextAreaLength(textareaID, errorID);
          });
      }
      
      function validateTextAreaLength(textareaID, errorID) {
          const textarea = document.getElementById(textareaID);
          const error = document.getElementById(errorID);
      
          const currentLength = textarea.value.trim().length;
      
          if (currentLength < textarea.minLength) {
              error.textContent =
                  `Please provide at least ${textarea.minLength} characters.`;
              return false;
          }
      
          error.textContent = "";
          return true;
      }

      function minDescCheck() {
          return validateTextAreaLength('desc', 'descError');
      }
      function minPromiseCheck() {
          return validateTextAreaLength('promise', 'promiseError');
      }
      function minSvActionCheck() {
          return validateTextAreaLength('supervisor', 'supervisorActionError');
      }
      
      
      setupTextAreaValidation('desc', 'descError');
      setupTextAreaValidation('promise', 'promiseError');
      setupTextAreaValidation('supervisor', 'supervisorActionError');
      
      function checkSvName(){
        return validateTextField('supervisor_signature', 'svNameError', 'Immediate Supervisor');
      }
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
              //['channel_id', 'channel_id_print'],
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
      
      function confirmReset() {
      const ok = confirm("Are you sure you want to reset the form? All entered data will be cleared.");
      if (!ok) return;
  
        resetForm();
      }


      /*! FUNCTIONS FOR MAIN PROCESS !*/
      function getData() {
  
          return {
  
              // employee info
              team: document.getElementById("team").value.trim(),
              empNum: document.getElementById("empNum").value.trim(),
              name: document.getElementById("name").value.trim(),
              position: document.getElementById("position").value.trim(),
  
              // description
              desc: document.getElementById("desc").value,
  
              // coaching details
              coaching_type: document.getElementById("coaching_type").value,
        	    col_ticket: document.getElementById("col_ticket").value.trim(),
        	    //channel_id: document.getElementById("channel_id").value,
              level: document.getElementById("level").value,
              followup: document.getElementById("followup").value,
  	    
              //signees name
              supervisor_signature: document.getElementById("supervisor_signature").value.trim(),
              employee_signature: document.getElementById("employee_signature").textContent,
              
              // statements
              promise: document.getElementById("promise").value.trim(),
              supervisor: document.getElementById("supervisor").value.trim(),
  
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
            checkEmpNum(false) &&
            checkName() &&
            checkTeam() &&
            checkPosition() &&
            minPromiseCheck()&&
            minSvActionCheck()&&
            checkSvName() &&
    
            data.team &&
            data.empNum &&
            data.name &&
            data.position &&
            minDescCheck()&&
            data.coaching_type &&
            validateDialerTicketRequired() &&
            data.level &&
            data.followup &&
            data.promise &&
            data.supervisor &&
            data.supervisor_signature &&
            data.employee_signature &&
            hasEmployeeSign &&
            hasSupervisorSign &&
            document.getElementById("sign-date").value &&
            document.getElementById("supervisor-sign-date").value
        );
    }
  
      // You can edit this function according to what query you want but double check the ID's of the input fields
      function buildSQL(d) {
        const colTicketValue = requiresColTicket()
        ? `'${escapeSQL(d.col_ticket)}'`
        : 'NULL';
        
          return `
          INSERT INTO coaching_log 
          (   team, 
              emp_num, 
              name, 
              position, 
              description, 
              coaching_type,
        	    col_ticket,
              level, 
              followup, 
              promise, 
              supervisor)
  
          VALUES 
          ('${escapeSQL(d.team)}', 
          '${escapeSQL(d.empNum)}', 
          '${escapeSQL(d.name)}', 
          '${escapeSQL(d.position)}', 
          q'{${d.desc}}',
          '${escapeSQL(d.coaching_type)}', 
        	${colTicketValue},
          '${escapeSQL(d.level)}', 
          '${escapeSQL(d.followup)}', 
          q'{${d.promise}}', 
          q'{${d.supervisor}}');
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
      		const data = getData();

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
      
          const fileName = `${sanitizeFileName(data.name)}_${sanitizeFileName(getCoachingTypeLabel())}_${getFormattedDateYYYYMMDD()}.pdf`;
          pdf.save(fileName);
      }
  
      // Function to build the string SQL and ensures all data is present
      function exportSQL(){
              const data = getData();
  
      if (!isValid(data)) {
          alert("Please complete all required fields before exporting.");
          showStatus("Please fill all fields first.", "error");
          return false;
        }
  
          const sql = buildSQL(data);
          const fileName = `${sanitizeFileName(data.name)}_${sanitizeFileName(getCoachingTypeLabel())}_${getFormattedDateYYYYMMDD()}.txt`;
          downloadFile(sql, fileName);
          return true;
      }
  
      // This handles the download button actions all at once    
      async function handleDownload() {
          //const date = getData();
          
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
      //document.getElementById("channel_id").selectedIndex = 0;
      document.getElementById("level").selectedIndex = 0;
      
      // to refresh the date in signature
      signatureDateToday('sign-date');
      signatureDateToday('supervisor-sign-date');
      
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
      
      syncAllPrintFields();

  }
  
  // console.log(base64_logohomecredit); uncomment for check of base64_logohomecredit if loading
