
viewingProfile
let myProfileBtn = document.querySelector('.myProfile')
login ? myProfileBtn.style.display = 'block' : myProfileBtn.style.display = 'none'

// logout button
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

// when window loads call the startProfile and instantMsg functions
$(window).on('load', e => {
  viewingProfile = JSON.parse(sessionStorage.getItem('viewingProfile'))
  if (viewingProfile) {
    calendars = viewingProfile.calendars
  }
  startProfile()
  instantMsg()
})

// the startProfile function loops through the viewingProfile variable (object)
// and depending on the key and if it's not empty then its value is sent to the attachItems function
function startProfile() {
  for (const i in viewingProfile) {
    if (i === 'goals' && viewingProfile[i].length !== 0) {
      attachItems(viewingProfile[i][0].text, 'goals')
  } if (i === 'books' && viewingProfile[i].length !== 0) {
      attachItems(viewingProfile[i][0].text, 'books')
  } if (i === 'craft') {
      attachItems(viewingProfile[i], 'craft')
  } if (i === 'groups' && viewingProfile[i].length !== 0) {
      attachItems(viewingProfile[i][0].text, 'groups')
  } if (i === 'college' && viewingProfile[i].length !== 0) {
      attachItems(viewingProfile[i][0].text, 'college')
  }
  }


  // attachItems attaches the arrays values to a card depending on its name,
  // then appends that to the page
  function attachItems(arr, name) {
    let cardInfo = document.getElementsByClassName('cardInfo')
    for (const g of cardInfo) {
      if (g.dataset.name === name) {
        for (let i = 0; i < arr.length; i++) {
          let liItem = document.createElement('li')
          let sp = document.createElement('span')
          liItem.setAttribute('class', 'list-group-item text-capitalize d-flex justify-content-between')
          liItem.textContent = arr[i]
          if (name === 'craft') {
            let inp = document.createElement('input')
            inp.setAttribute('class', 'form-check-input profile-check')
            inp.setAttribute('type', 'checkbox')
            sp.append(inp)
            liItem.append(sp)
          } else if (name === 'books') {
            let btns = document.createElement('button')
            btns.textContent = 'Borrow'
            btns.setAttribute('class', 'btn btn-primary borrow')
            btns.setAttribute('data-target', '#borrowBook')
            btns.setAttribute('data-toggle', 'modal')
            sp.append(btns)
            liItem.append(sp)
          } else if (name === 'groups') {
            liItem.append(sp)
          } else if (name === 'college') {
          }
          g.appendChild(liItem)
        }
      }
    }
  }

  // if empty don't display card
  for (const card of document.querySelector('#cardContainer').children) {
    if (card.children[1].children.length === 0) {
        card.style.display = 'none'
    }
}

// on clicking any of the 'borrow' button modal shows up and inputs all pertinent
// information from clicked item to modal
  let borrowBtn = document.querySelectorAll('.borrow')
  for (const b of borrowBtn) {
    b.addEventListener('click', e => {
      let modalMsg = document.querySelectorAll('.modal-body p')[1]
      modalMsg.style.display = 'block'
      let msgSend = document.querySelector('.msgSending')
      msgSend.style.display = 'none'
      let book = e.target.closest('li').textContent
      let bookName = book.slice(0, book.length - 6)
      document.querySelector('.book').textContent = bookName
      document.querySelector('.bookLender').textContent = viewingProfile.first
    })
  }

// all information from profile object is inserted to the webpage accordingly
  let profilePix = document.querySelector('img#profile-img')
  profilePix.src = `../images/${viewingProfile.pic.slice(12)}`

  let firstName = document.querySelector('b.profile-name')
  firstName.textContent = viewingProfile.first

  let bioText = document.querySelector('p.bio-text')
  bioText.textContent = viewingProfile.bio

  let profileAge = document.querySelector('span.profile-age')
  profileAge.textContent = viewingProfile.dob

  let profileBlock = document.querySelector('span.profile-block')
  profileBlock.textContent = viewingProfile.block

  let profileAssignment = document.querySelector('.profile-assignment')
  profileAssignment.textContent = `${viewingProfile.assignment}-${viewingProfile.title}`

  let profileCheckbox = document.getElementsByClassName('profile-check')

  let craftLesson = []
  let bookArray = []

  for (const c of profileCheckbox) {
    c.addEventListener('change', e => {
      let listName = e.target.closest('ol').dataset.name
      let itm = e.target.closest('li').textContent
      if (listName === 'craft') {
        !craftLesson.includes(itm) ? craftLesson.push(itm) :
          craftLesson.splice(craftLesson.indexOf(itm), 1)
      } else {
        !bookArray.includes(itm) ? bookArray.push(itm) :
          bookArray.splice(bookArray.indexOf(itm), 1)
      }
    })
  }


  function revealSlots() {
    let month = document.querySelector('.calMonth')
    let year = document.querySelector('.calYear')
    let tableSlots = document.querySelectorAll('.slotItm')
    for (const x of tableSlots) {
      x.setAttribute('data-target', '#lessons')
      x.setAttribute('data-toggle', 'modal')
      x.addEventListener('click', e => {
        let day = e.target.closest('td').firstElementChild.textContent
        document.querySelector('span.modalTime').textContent = e.target.title
        document.querySelector('span.modalDay').textContent = `${month.textContent} ${day}, ${year.textContent}`
        document.querySelector('span.mentor').textContent = document.querySelector('.profile-name').textContent
        document.querySelector('span.modalCraft').textContent = craftLesson.join(', ')
      })
    }
  }

  prevNext(count)
  revealSlots()
  next.addEventListener('click', revealSlots)
  prev.addEventListener('click', revealSlots)
  sendMsg()
}

// checking for login status to check stuff out
let lessons = document.getElementById('lessons')
let borrowBook = document.getElementById('borrowBook')
if (login === null) {
  lessons.removeAttribute('id')
  borrowBook.removeAttribute('id')
}

document.addEventListener('click', e => {
  let target = e.target.className
  if (login === null) {
    if (target.includes('slotItm') || target.includes('profile-check') || target.includes('borrow')) {
      alert('Must be logged-in in order to request services ')
    }
  }
})

function sendMsg() {
  let accept = document.getElementById('accept')
  let msgSending = document.querySelector('.msgSending')
  let sendAMsg = document.querySelector('#send-a-msg')
  let book
  accept.addEventListener('click', e => {
    book = document.querySelector('.book')
    if (book.textContent !== '') {
      updateMsg(viewingProfile.id, `${login.first.toUpperCase()} would like to borrow your ${book.textContent} book.`, 'service-book')
      book.textContent = ''
    } else if (sendAMsg.value !== '') {
      updateMsg(viewingProfile.id, sendAMsg.value.trim(), 'reply')
      sendAMsg.value = ''
      msgSending.style.display = 'none'
    }

  })

  let connect = document.querySelector('.connect')
  connect.addEventListener('click', e => {
    let sessionInfo = document.querySelector('.session-info').children
    updateMsg(viewingProfile.id, `Would you like to meet ${login.first.toUpperCase()} this ${sessionInfo[1].textContent}
 from ${sessionInfo[2].textContent} for lessons on ${sessionInfo[3].textContent}`, 'service-lesson')
  })

  let msgLabel = document.querySelector('.msgLabel')
  let sendAMsgBtn = document.querySelector('#send-a-msg-btn')
  msgLabel.textContent = `Send a message to ${viewingProfile.first.toUpperCase()}:`
  sendAMsgBtn.addEventListener('click', e => {
    let modalMsg = document.querySelectorAll('.modal-body p')[1]

    modalMsg.style.display = 'none'
    msgSending.style.display = 'block'
    if (sendAMsg.value !== '') {
      msgSending.textContent = `Send Message to ${viewingProfile.first.toUpperCase()}?`
    } else {
      msgSending.textContent = 'Text Needed!'
    }
  })
}

