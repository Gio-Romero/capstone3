let myProfileBtn = document.querySelector('.myProfile')
login ? myProfileBtn.style.display = 'block' : myProfileBtn.style.display = 'none'
let logBtn = document.querySelectorAll('.logBtn')

for (const btn of logBtn) {
    !login ? btn.textContent = 'Log-In' : null
    btn.addEventListener('click', e => {
        if (e.target.textContent === 'Log-In') {
            document.location = '../pages/login.html'
        } else {
            sessionStorage.clear()
            document.location = '../index.html'
        }
    })
}

let calInstructions = document.querySelector('.calInstructions')
let mentorORstudent = document.querySelector('.mentorORstudent')

// on clicking the mentor button the page exhibits the values for a mentor
$(".mentor").on('click', e => {
    e.preventDefault()
    $(".craft").show()
    $('.example').children().show()
    calInstructions.textContent = "Set time slots when you're able to tutor:"
    mentorORstudent.textContent = 'Mentor'
})

// on clicking the student button the page exhibits the values for a mentor
$(".student").on('click', e => {
    e.preventDefault()
    $(".craft").hide()
    $('.example').children().hide()
    calInstructions.textContent = "Set Any important notices to remember:"
    mentorORstudent.textContent = 'Student'
})

// the dob input is added a datepicker
$('#dob').datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: '1950:2006',
    hideIfNoPrevNext: true,
    dateFormat: "yy-mm-dd"

})

let emailValidation = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g

// the person class object, for each new sign up
class Person {
    constructor(id, first, last, email, password, dob, block, assignment, craft,
        calendars, bio, pic, date, goals, books, messages, createdDate, reminders, title, groups, college) {
        this.id = id,
            this.first = first,
            this.last = last,
            this.email = email,
            this.password = password,
            this.dob = dob,
            this.block = block,
            this.assignment = assignment,
            this.craft = craft,
            this.calendars = calendars,
            this.bio = bio,
            this.pic = pic,
            this.date = date,
            this.goals = goals,
            this.books = books,
            this.messages = messages,
            this.createdDate = createdDate,
            this.reminders = [],
            this.title = title,
            this.groups = groups,
            this.college = college
    }
}

let title = 'Mentor'
for (const btn of document.querySelectorAll('.title')) {
    btn.addEventListener('click', e => {
        title = e.target.textContent
    })
}

let myPic

// on clicking the submit button for the form, values for each input is stored into
// their respective variables
$("#submitForm").on("click", e => {
    e.preventDefault()
    let fname = $("#firstname").val()
    let lname = $("#lastname").val()
    let email = $("#email").val()
    let pwd = $("#password").val()
    let dob = $("#dob").val()
    let block = $("#block").val()
    let assignment = $("#assignment").val()
    let bio = $("#bio").val()
    let pic = $("#pic").val()
    let td = $('td input')
    let goals = []
    let books = []
    let groups = []
    let college = []


    // loops through all the data within tables and depending on their text sends the 
    // information to be stored with the help of the insertData function
    for (const i of td) {
        let title = i.closest('table').childNodes[1].firstElementChild.innerText
        if (/my Goal/gi.test(title)) {
            insertData(goals, title, i)
        } else if (/my Books/gi.test(title)) {
            insertData(books, title, i)
        } else if (/my Groups/gi.test(title)) {
            insertData(groups, title, i)
        } else if (/college classes/gi.test(title)) {
            insertData(college, title, i)
        }
    }

//insertData function receives the slots data and pushes them into their assigned array 
    function insertData(arr, title, i) {
        let idx = arr.findIndex(f => f.title == title)
        if (i.value != "") {
            return idx === -1 ? arr.push({ title: title, text: tx = [i.value] }) : arr[idx].text.push(i.value)
        }
    }

    // form validation
    for (const em of profilez) {
        if (em.email === email) {
            return alert('This email is already taken. Please choose another one.')
        }
    }
    if (email.match(emailValidation) == null) {
        return alert('incorrect form of email')
    }
    if (pwd.length < 5) {
        return alert('password must be at least 5 characters')
    }
    let inputs = document.querySelectorAll('input')
    for (const [i, v] of inputs.entries()) {
        if (v.value === '' && i < 8) {
            return alert(`${v.name} is required`)
        }
    }

    // retrieves date info
    let date = new Date()
    let timeStr = date.toLocaleTimeString()
    let digits = timeStr.match(/\d+:\d+/)[0]
    let ampm = timeStr.match(/[A-Z]+/)[0]
    let createdDate = date.toDateString().slice(4)

    let other = document.querySelector('input.other').value
    other !== '' ? craftArr.push(other) : null

    // creates new Person and sends it to be stored
    let person = new Person(date.getTime().toString(), fname, lname, email, pwd, dob, block, assignment,
        craftArr, calendars, bio, pic, date.getTime(), goals, books, [{
            id: 'gio', msgId: date.getTime(), name: 'Gio',
            pix: 'gio.png', msg: 'Welcome!', time: `${digits} ${ampm}`, type: 'welcome'
        }], createdDate, null, title, groups, college)

    // store function receives person object
    storeProfile(person)
    sessionStorage.setItem('logged-in', JSON.stringify(person))
    document.location = 'myProfile.html'
})

// on clicking the plus icon a new slot is added to the column
$('.addSlot').on('click', e => {
    e.preventDefault()
    $(e.target).parent().parent().parent().parent().append(`<tr> <td><input class="form-control" type="text"></td></tr>`)
})

// when the checkboxes are checked/unchecked the craft Array adds/removes the value of the checkbox
let craftArr = []
$(".btn-check").on("change", e => {
    let answer = e.target.attributes.name.value
    !craftArr.includes(answer) ? craftArr.push(answer) :
        craftArr.splice(craftArr.indexOf(answer), 1)
})



// submitting a profile picture
let fileInput = document.querySelector('input[type=file]')
fileInput.addEventListener('change', e => {
    showingUploadImg()
})
function showingUploadImg() {
    let profileImg = document.querySelector('#profileImg')
    let fileR = new FileReader();
    fileR.addEventListener("load", function () {
        profileImg.src = fileR.result
    });
    if (fileInput.files[0]) {
        myPic = fileR.readAsDataURL(fileInput.files[0])
    }
}


