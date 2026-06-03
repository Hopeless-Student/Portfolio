q block ✅



emp num starts at 13k ✅



col ticket -> dialer ticket ✅

dialer ticket required for all normal coaching except fastball

6 digits only - col ticket



restrict 20 chars below for all text area ✅



remove channel ✅



change file names ✅



date static ✅





==================================================================================

IF COACHING TYPE == FAST BALL

DIALER TICKET (col\_ticket) IS NOT REQUIRED



functions with missing of col\_ticket when Fastball





ELSE

DIALER TICKET IS REQUIRED



IS DIALER TICKET LENGTH 6 DIGITS ONLY ? ACCEPT : ERROR MESSAGE

==================================================================================

To do: 6-3-26:

* change file name✅
* place the q block again✅
* validate less than 20 chars on text area - it accepts right now even with less than 20✅
* UI for the error message are showing when exported with wrong inputs (validate to not happen)✅
* fix static date for signature - it doesn't get the current date after reset ✅
* clean up date function (optional)
* remove channel related items // comment out ✅
* dialer ticket required for all normal coaching except fastball (later)✅
* 6 digits only - col ticket/dialer ticket (later)✅
* add min LENGTH to the emp, sv, and team name ✅







COACHING\_TYPE

|**value**|**text option**|
|-|-|
|BMF|BMF|
|CBH|Behavioral|
|CCL|Call Listening|
|CCM|Complaints|
|DSAT|DSAT|
|FBLCM|Fastball - Live Call Monitoring|
|FBNU|Fastball - Numbers|
|FBSS|Fastball - Side by side|
|CFU|Follow-up|
|CLV|LLM Validation|
|CLCM|Live Call Monitoring|
|CME|Month-End|
|CNU|Numbers|
|CPCP|PIP Coaching Period|
|CPF|PIP Form|
|CPACW|Prod - After\_Call\_Work|
|CPB|Prod - Break|
|CPC|Prod - Coaching|
|CPL|Prod - Lunch|
|CPNBT|Prod - No\_Break\_Tagging|
|CPN|Prod - Not\_Ready|
|CPSN|Prod - State\_Name|
|CPTM|Prod - Team\_Meeting|
|CPWUM|Prod - WUM|
|CTS|Target Setting|
|CVL|Violation|
|COH|Others|



Example INSERT QUERY FROM SIR NICO:

"INSERT INTO AP\_COLL.T\_EC\_EMPLOYEE\_COACHING\_LOG SELECT DATE '2026-06-01', 'Arcel Bulatao', '19-5005', 'URANUS', DATE '2026-06-01', DATE '2026-06-01', 'Fastball - Live Call Monitoring', '',q'{1. Can you explain what happened and why the client's account was affected in this situation?

\-What happened was I mistakenly entered an incorrect penalty waiver amount in the system. Because of this error, the waiver request was not processed correctly, which affected the clients account and did not reflect the agreed terms. This resulted in the client experiencing an issue that led to the complaint.

2\. Looking back, what should you have done differently to ensure the client's previous agreement was properly honored and to avoid the complaint?

\-Looking back, I should have double-checked the waiver amount before executing to ensure accuracy.

3\. What actions will you take moving forward to ensure this type of error does not happen again?

\-Moving forward, I will make it a practice to carefully verify all entries, especially waiver amounts, before to execute. I will also take extra time to review account and ensure alignment with approved agreements, and follow the correct process consistently.

4\. What support or assistance do you need from me to help you successfully implement your action plan and improve your performance?

\-I would appreciate continued guidance and any refresher tips. Occasional feedback or quick check-ins would also help ensure I stay on track and apply the correct procedures consistently.}', q'{ The agent correctly identified that the issue was caused by an incorrect penalty waiver amount entered in the system, which led to improper processing and affected the clients account. The agent acknowledged that this could have been avoided by carefully reviewing and double-checking details before submission. Moving forward, the agent committed to improving accuracy by consistently verifying all entries, especially waiver amounts, prior to execution and ensuring strict adherence to the correct process. The agent also expressed willingness to receive ongoing coaching and feedback to support performance improvement. It was also emphasized that any repetition of the same issue will result in the issuance of a formal memo.}', DATE '2026-06-01', 'HCPH\_NICOFRANCISCO', q'{A concern was raised by my co-supervisor regarding an unprocessed penalty waiver. Upon validation, it was identified that the agent entered an incorrect penalty waiver amount, which caused the request to be processed incorrectly.

Complaint Validation:

Valid  The penalty waiver was not processed correctly due to the incorrect amount inputted by the agent.

Resolution Provided:

A manual special penalty waiver was approved and processed to honor the client's previous agreement prevent further complaints, and ensure the contract was corrected accordingly.

Coaching and Consideration Given:

The agent was provided with coaching regarding the importance of accurately entering waiver amounts and following the correct process. I also explained the potential impact of such errors on the client experience, company reputation, and operational efficiency. The agent was informed that if the same issue occurs again, a formal memo may be issued}', '' FROM DUAL;"

