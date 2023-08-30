// call data storage to return array of profiles
dataStorage()
let profilez = JSON.parse(localStorage.getItem('profilez'))
console.log(profilez)
function dataStorage() {
  let db = JSON.parse(localStorage.getItem('profilez'));
  (!db) ? localStorage.setItem('profilez', JSON.stringify([])) : null;
}

// stores new profiles
function storeProfile(obj) {
  profilez.push(obj)
  localStorage.setItem('profilez', JSON.stringify(profilez))
}

// class constructor for new messages
class Msg {
  constructor(id, msgId, name, pix, msg, type, time, dateCreated) {
    this.id = id,
      this.msgId = msgId,
      this.name = name,
      this.pix = pix,
      this.msg = msg,
      this.type = type,
      this.time = time,
      this.dateCreated = dateCreated
  }
}

// message board memory
let messageBoard = JSON.parse(localStorage.getItem('messageBoard'))
!messageBoard ? localStorage.setItem('messageBoard', JSON.stringify([])) : null;
messageBoard = JSON.parse(localStorage.getItem('messageBoard'))

// set viewingProfile variable to profile if you're looking at someones profile
let viewingProfile
let login = JSON.parse(sessionStorage.getItem('logged-in'))

// updates message sent and received
function updateMsg(receiverId, messg, types, reminderMsg) {
  console.log(receiverId, messg, types, reminderMsg)

  //creates date info for each message sent and received 
  let dateArr = new Date().toDateString().slice(4).split(' ')
  let createdDate = `${dateArr[0]} ${dateArr[1]}, ${dateArr[2]}`
  let timeStr = new Date().toLocaleTimeString()
  let digits = timeStr.match(/\d+:\d+/)[0]
  let ampm = timeStr.match(/[A-Z]+/)[0]
  let loginProf = findLoginProfile(receiverId)

  // updates messages for the message board
  if (messageBoard && types === 'msgBrd') {
    messageBoard.push(new Msg(login.id, new Date().getTime(), login.first, login.pic.slice(12).split(' ').join(' '), msgBrdTxt.value.trim(),
      'msgBrd', `${digits} ${ampm}`, createdDate))
    localStorage.setItem('messageBoard', JSON.stringify(messageBoard))
    return messageBoard = JSON.parse(localStorage.getItem('messageBoard'))
  }

  // updates messages for accepting a service
  if (messg.includes('accepts')) {
    for (const receiver of profilez) {
      if (receiver.id === receiverId) {
        for (const pro of profilez) {
          if (pro.id === login.id) {
            loginProf.reminders.push(new Msg(receiverId, new Date().getTime(), pro.first.toUpperCase(), pro.pic.slice(12),
              messg, 'reminder', `${digits} ${ampm}`, createdDate))
            pro.reminders.push(new Msg(receiverId, new Date().getTime(), receiver.first.toUpperCase(), receiver.pic.slice(12),
              reminderMsg, 'reminder', `${digits} ${ampm}`, createdDate))
          }
        }
      }
    }
  }

  // updates messages for all other messages
  // for (const p of profilez) {
  //   if (receiverId === p.id) {
  let p = findLoginProfile(receiverId)
  let mesgs = p.messages
  mesgs.push(new Msg(login.id, new Date().getTime(), login.first.toUpperCase(), login.pic.slice(12),
    messg, types, `${digits} ${ampm}`, createdDate))
  // }
  localStorage.setItem('profilez', JSON.stringify(profilez))
  // }

  // resets login variable to updated profile
  login = findLoginProfile(login.id)
  sessionStorage.setItem('logged-in', JSON.stringify(login))
  login = JSON.parse(sessionStorage.getItem('logged-in'))
}

//function to  find the profile your looking for within the database
function findLoginProfile(profile) {
  for (const p of profilez) {
    if (profile === p.id) {
      return p
    }
  }
}

// updates new messages and other changed data instantly
function instantMsg() {

  let len = login.calendars.length
  let msgBrdLength = messageBoard.length
  // updates profiles every second
  setInterval(() => {
    // update viewing profile
    if (viewingProfile) {
      viewProf = findLoginProfile(viewingProfile.id)
      sessionStorage.setItem('viewingProfile', JSON.stringify(viewProf))
    }

    // update calendar on own profile
    if (login.calendars.length !== len) {
      len = login.calendars.length
      let dbProfile = findLoginProfile(login.id)
      dbProfile.calendars = login.calendars
      localStorage.setItem('profilez', JSON.stringify(profilez))
      sessionStorage.setItem('logged-in', JSON.stringify(dbProfile))
    }

    // message board updates
    let msgBrdPro = JSON.parse(localStorage.getItem('messageBoard'))
    if (msgBrdLength !== msgBrdPro.length) {
      localStorage.setItem('messageBoard', JSON.stringify(msgBrdPro))
      messageBoard = JSON.parse(localStorage.getItem('messageBoard'))
      createMsgBrd()
      postMsgs()
      msgBrdLength = messageBoard.length
    }

    // remove all messages if empty
    if (login.messages.length === 0) {
      for (const dt of document.querySelectorAll('.dateTitle')) {
        dt.remove()
      }
    }
    let msgs = login.messages.length
    let profiles = JSON.parse(localStorage.getItem('profilez'))
    localStorage.setItem('profilez', JSON.stringify(profiles))
    profilez = JSON.parse(localStorage.getItem('profilez'))

    // if there's a new message then update and re-render all messages
    let pro = findLoginProfile(login.id)
    // console.log(login)
    if (msgs !== pro.messages.length) {
      sessionStorage.setItem('logged-in', JSON.stringify(pro))
      login = JSON.parse(sessionStorage.getItem('logged-in'))
      msgs = login.messages.length
      if (!viewingProfile) {
          createMsgs()
      }
    
    }
  }, 1000);
}

