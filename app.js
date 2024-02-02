// app.js
    const appElement = document.getElementById('app');
    const dateInput = document.getElementById('attendanceDate');
    const attendanceFormContainer = document.getElementById('attendanceForm');
  
    const fetchAttendanceForm = async () => {
      const dateToFetch = dateInput.value;
  
      try {
        const response = await axios.get(`http://localhost:5000/report/${dateToFetch}`);
        const { success, attendanceReport } = response.data;
  
        if (success) {
          // Display the attendance form on the page
          displayAttendanceForm(attendanceReport);
        } else {
          console.error('Failed to fetch attendance report');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const displayAttendanceForm = (attendanceReport) => {
      // Clear previous form
      attendanceFormContainer.innerHTML = '';
  
      if (!attendanceReport) {
        // Initial attendance submission with radio buttons
        const form = document.createElement('form');
        attendanceFormContainer.appendChild(form);

        axios.get('http://localhost:5000/students')
        .then(result=>{
             const students=result.data.result
            for (let i = 0; i < students.length; i++) {
                const label = document.createElement('label');
                label.textContent = `${students[i].name}`;
                
                const presentRadio = document.createElement('input');
                presentRadio.type = 'radio';
                presentRadio.name = `${students[i].name}`;
                presentRadio.value = 'present';
                
                const absentRadio = document.createElement('input');
                absentRadio.type = 'radio';
                absentRadio.name = `${students[i].name}`;
                absentRadio.value = 'absent';
                
                label.appendChild(presentRadio);
                label.appendChild(document.createTextNode('Present'));
                label.appendChild(absentRadio);
                label.appendChild(document.createTextNode('Absent'));
        
                form.appendChild(label);
                form.appendChild(document.createElement('br'));
              }
              const submitButton = document.createElement('button');
              submitButton.textContent = 'Submit Attendance';
              submitButton.type = 'button'; // Change to 'submit' if needed
              submitButton.addEventListener('click', submitAttendance);
        
              form.appendChild(submitButton);
        })
      } else {
        // Subsequent views with checkboxes
        const form = document.createElement('form');
        attendanceFormContainer.appendChild(form);
  
        attendanceReport.forEach((record) => {
          const label = document.createElement('label');
          label.textContent = record.Student.name;
  
          const presentCheckbox = document.createElement('input');
          presentCheckbox.type = 'checkbox';
          presentCheckbox.checked = record.status === 'present';
          presentCheckbox.disabled = true;
  
          label.appendChild(presentCheckbox);
          label.appendChild(document.createTextNode('Present'));
  
          form.appendChild(label);
        });
      }
    };
  
    const submitAttendance = () => {
      const form = attendanceFormContainer.querySelector('form');
      const formData = new FormData(form);
      // Process the form data and build the entries array
      formData.forEach((key, value) => { 
          // Check if the radio button is checked
          console.log(key,value);
          if (value === 'present' || value === 'absent') {
            console.log(key,value)
            axios.post('http://localhost:5000/submit', {
            date: dateInput.value,
            name: key,
            status: value
            }).then(result=>console.log('added successfully'))
            .catch(err=>console.log(err))
        }
      });
    };
  
    // Example: Fetch attendance form for a specific date
    const fetchButton = document.querySelector('button');
    fetchButton.addEventListener('click', fetchAttendanceForm);
  