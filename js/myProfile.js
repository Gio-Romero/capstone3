
if (login) {
    calendars = login.calendars
    startProfile()
}
let myProfileBtn = document.querySelector('.myProfile')

// toggle messages
$(".msgItm:even").css("background-color", "rgb(218 230 250 / 37%)");
let toggleMsgs = document.querySelector('.toggleMsgs')
$('.messages').hide()

// toggle the messages on clicking icon
toggleMsgs.addEventListener('click', e => {

    $('.messages').toggle('slide', { direction: 'left' })
    messagesToggle()
})

// toggle messages on clicking outside of message board
function messagesToggle() {
    if (document.querySelector('.messages').style.left.slice(0, 2) < 0) {
        document.addEventListener('click', e => {
            let modalDisplay = document.querySelector('#sendMsg').style.display
            if (e.target.closest('div .messages') === null && !e.target.className.includes('toggleMsgs')
                && modalDisplay !== 'block') {
                $('.messages').hide('slide', { direction: 'left' })
            }
        })
    }
}

// logout button
let loggOut = document.querySelector('#loggout')
loggOut.addEventListener('click', logOut)
function logOut() {
    sessionStorage.clear()
    document.location = '../index.html'
}

// reorder goal items
$(".goals").sortable({
    item: "li"
})

// kicks starts the profile
function startProfile() {
    createMsgs()
    toggleRemindersMsgs()
    for (const i in login) {
        if (i === 'goals' && login[i].length !== 0) {
            attachItems(login[i][0].text, 'goals')
        } if (i === 'books' && login[i].length !== 0) {
            attachItems(login[i][0].text, 'books')
        } if (i === 'craft') {
            attachItems(login[i], 'craft')
        } if (i === 'groups' && login[i].length !== 0) {
            attachItems(login[i][0].text, 'groups')
        } if (i === 'college' && login[i].length !== 0) {
            attachItems(login[i][0].text, 'college')
        }
    }





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
                        sp.setAttribute('class', 'fa fa-trash')
                        liItem.append(sp)
                    } else if (name === 'goals') {
                        sp.setAttribute('class', 'fa fa-trash')
                        liItem.append(sp)
                    } else if (name === 'books') {
                        sp.setAttribute('class', 'fa fa-trash')
                        liItem.append(sp)
                    } else if (name === 'groups') {
                        sp.setAttribute('class', 'fa fa-trash')
                        liItem.append(sp)
                    } else if (name === 'college') {
                        sp.setAttribute('class', 'fa fa-trash')
                        liItem.append(sp)
                    }
                    g.appendChild(liItem)
                }
            }
        }
    }

    for (const card of document.querySelector('#cardContainer').children) {
        if (card.children[1].children.length === 0) {
            card.style.display = 'none'
        }
    }

    document.getElementById('addSlotTitle').addEventListener('click', e => {
        let target = e.target
        for (const itm of target.nextElementSibling.children) {
            itm.addEventListener('click', e => {
                target.textContent = e.target.textContent
            })
        }
    })

    // .children().hide()
    // let groupSlots=document.querySelector('addASlot')
    $('.addASlot').hide()
    $('.addToggle').on('click', e => {
        $('.addASlot').toggle()
    })


    document.querySelector('.addSlot').addEventListener('click', e => {
        let title = e.target.parentElement.previousElementSibling.firstElementChild.textContent
        let slotInfo = e.target.previousElementSibling.value
        if (title === 'Craft') {
            login[title.toLowerCase()].push(slotInfo)
        } else {

            if (login[title.toLowerCase()].length === 0 && title !== 'College') {

                login[title.toLowerCase()].push({ title: `My ${title}`, text: [`${slotInfo}`] })

            } else {
                login[title.toLowerCase()][0].text.push(slotInfo)
            }
        }
        let dbProfile = findLoginProfile(login.id)
        dbProfile[title.toLowerCase()] = login[title.toLowerCase()]
        localStorage.setItem('profilez', JSON.stringify(profilez))
        sessionStorage.setItem('logged-in', JSON.stringify(dbProfile))
        location.reload()
    })

    $('#updateBio').hide()
    $('#updateBioBtn').hide()
    // permanently remove items or change items
    for (const spanItm of document.querySelectorAll('span.fa')) {

        if (spanItm.className.includes('fa-trash')) {

            spanItm.addEventListener('click', e => {
                let targetName = e.target.parentNode.parentNode.dataset.name
                let targetText = e.target.parentNode.textContent
                let dbPro = findLoginProfile(login.id)
                let removeItmNum = dbPro[targetName].indexOf(targetText)
                dbPro[targetName].splice(removeItmNum, 1)
                e.target.parentNode.remove()
                localStorage.setItem('profilez', JSON.stringify(profilez))
                sessionStorage.setItem('logged-in', JSON.stringify(dbPro))
            })
        } else {

            spanItm.addEventListener('click', e => {
                let spanParent = e.target.parentElement.parentElement
                spanParent.children[1].remove()
                $('#updateBio').show()
                $('#updateBioBtn').show()
                $('#updateBioBtn').on('click', e => {
                    let dbProfile = findLoginProfile(login.id)
                    dbProfile[spanParent.classList[0]] = e.target.previousElementSibling.value
                    localStorage.setItem('profilez', JSON.stringify(profilez))
                    sessionStorage.setItem('logged-in', JSON.stringify(dbProfile))
                    location.reload()
                })

            }, { once: true })
        }
    }


    // the appropriate query's are gathered in order to 
    // update them depending on the login profiles data

    let profilePix = document.querySelector('img#profile-img')
    profilePix.src = `../images/${login.pic.slice(12)}`

    let firstName = document.querySelector('b.profile-name')
    firstName.textContent = login.first

    let bioText = document.querySelector('p.bio-text')
    bioText.textContent = login.bio

    let profileAge = document.querySelector('span.profile-age')
    profileAge.textContent = login.dob

    let profileBlock = document.querySelector('span.profile-block')
    profileBlock.textContent = login.block

    let profileAssignment = document.querySelector('.profile-assignment')
    profileAssignment.textContent = `${login.assignment}-${login.title}`

    prevNext(count)
}

function replyToMsg() {
    let replyBtn = document.querySelectorAll('.reply')
    for (const r of replyBtn) {
        r.addEventListener('click', e => {

            changeModalTxt('Send Message', 'Send')
            let replyContent = document.querySelector('.replyContent')
            replyContent.style.display = 'block'
            let textArea = `<textarea cols="50" rows="3" maxlength="180" id="replyMsg"
         placeholder="180 character max"></textarea>`
            replyContent.innerHTML = textArea
            let infoId = e.target.previousElementSibling.dataset.info
            let replyMsg = document.querySelector('#replyMsg')
            clickSend(infoId, replyMsg, 'reply')

        })
    }
}
// adds all messagaes to the message board
function createMsgs() {
    let allMessages = document.querySelector('.allMessages')
    let messageTitle = document.querySelector('.msgTitle')

    messageTitle.textContent = 'Messages'

    let dayCreated = login.createdDate
    createDateTitle(dayCreated, allMessages)
    if (allMessages.children) {
        for (const m of document.querySelectorAll('ul .card')) {
            m.remove()
        }
    }

    if (login.messages) {
        for (const msg of login.messages) {
            if (dayCreated !== msg.dateCreated) {
                dayCreated = msg.dateCreated
                createDateTitle(msg.dateCreated, allMessages)
            }
            if (msg.type.indexOf('service') !== -1) {
                let btnHtml = `<button class="btn btn-sm btn-outline-primary accept" data-target="#sendMsg"
                     data-toggle="modal">Accept</button>
                     <button class="btn btn-sm btn-outline-secondary decline" data-target="#sendMsg"
                    data-toggle="modal">Decline</button>
                    </div>`
                addMsgs(btnHtml, allMessages, msg)
            } else {
                let btnHtml2 = `  <button class="btn btn-sm btn-outline-primary reply" data-target="#sendMsg"
                  data-toggle="modal">Reply</button>
                    </div>`
                addMsgs(btnHtml2, allMessages, msg)
            }
        }
        let acceptBtns = document.querySelectorAll('.accept')
        let declineBtns = document.querySelectorAll('.decline')
        returnMsg(acceptBtns, 'accept')
        returnMsg(declineBtns, 'decline')
    }
    replyToMsg()
    goToProfile()
    deleteOne('messages')
    $(".msgItm:even").css("background-color", "rgb(218 230 250 / 37%)");

    let msgBox = document.querySelector('.messageTitle')
    for (const m of msgBox.nextElementSibling.children) {
        let nextEl = msgBox.nextElementSibling.firstElementChild
        if (nextEl.nextElementSibling) {
            if (nextEl !== null && nextEl.nextElementSibling.className.includes('dateTitle') &&
                nextEl.className.includes('dateTitle')) {
                msgBox.nextElementSibling.firstElementChild.remove()
            } else {
                continue
            }
        }
    }

}


// function used to add html for the messages depending on type of message
function addMsgs(xtraHtml, allMessagesDiv, msg) {
    let newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'card msgItm')
    newDiv.setAttribute('data-findId', `${msg.msgId}`)
    newDiv.innerHTML = `
    <div class="m-3">
    <div class="d-flex justify-content-between">
    <div class="d-flex">
    <img class="msgPic mr-2" data-id=${msg.id} src="../images/${msg.pix}" alt="profilePic">
    <h5 class="card-title text-capitalize mr-2">${msg.name}</h5>
    <p class="fa-xs figure-caption mt-1">${msg.time}</p>
    </div>
    <img class="closing" data-msgId=${msg.msgId} src="../images/close.svg" alt="">
    </div>
    <p class="card-text" data-info=${msg.id} data-name=${msg.name} data-service=${msg.type}>${msg.msg}</p>
    ${xtraHtml}`
    allMessagesDiv.append(newDiv)
}

// creates the date for each new day, appends it to message board
function createDateTitle(msgCreated, msgWrapper) {
    let dateDiv = document.createElement('div')
    dateDiv.textContent = msgCreated
    dateDiv.setAttribute('class', 'text-center font-weight-bold fa-xs dateTitle')
    msgWrapper.append(dateDiv)
}

// removes date title as messages are removed only if no messages are available w/in that date
function removeDateTitle() {
    for (const date of document.querySelectorAll('.dateTitle')) {
        if (date.nextElementSibling === null || !date.nextElementSibling.className.includes('card')) {
            date.remove()
        }
    }
}

// on clicking accept/decline/reply buttons the appropriate modal is rendered
function returnMsg(btn, acceptORdecline) {
    for (const i of btn) {
        i.addEventListener('click', e => {

            changeModalTxt('Send Message', acceptORdecline, 'block')
            let msgInfo = e.target.parentNode.children[1]
            let messg, lesson, lessonDate, lessonTime, book
            let service = msgInfo.dataset.service
            let replyContent = document.querySelector('.replyContent')
            let msgName = msgInfo.dataset.name

            let targetCard = e.target.closest('.card')
            if (acceptORdecline === 'accept' && /service-lesson/.test(msgInfo.dataset.service)) {
                let other = `<input type='text' id='location' placeholder='location'> `
                replyContent.innerHTML = `<p>${msgInfo.textContent}:</p>
                <label>Where would you like to meet?(ex.chapel)</label>${other}`
                getLessonsInfo(msgInfo)
                let location = document.getElementById('location')
                messg = `${login.first.toUpperCase()} accepts to have ${lesson} on ${lessonDate} at ${lessonTime}`
                reminderMsg = `You have accepted to meet with ${msgName} for ${lesson} on ${lessonDate} at ${lessonTime}`
                clickSend(msgInfo.dataset.info, messg, 'reply', location, reminderMsg, targetCard)

            } else if (acceptORdecline === 'decline' && /service-lesson/g.test(service)) {
                getLessonsInfo(msgInfo)
                replyContent.innerHTML = `<h5>Are you sure you want to decline?</h5>`
                messg = `Sorry. At this time ${login.first.toUpperCase()} would like to decline ${lesson} on ${lessonDate} at ${lessonTime}`
                clickSend(msgInfo.dataset.info, messg, 'reply', null, null, targetCard)

            } else if (acceptORdecline === 'decline' && /service-book/g.test(service)) {
                replyContent.innerHTML = `<h5>Are you sure you want to decline?</h5>`
                book = msgInfo.textContent.match(/(?<=your).+[^\.]/g)
                messg = `Sorry. At this time ${login.first.toUpperCase()} declines to lend you the${book}`
                clickSend(msgInfo.dataset.info, messg, 'reply', null, null, targetCard)

            } else if (acceptORdecline === 'accept' && /service-book/g.test(service)) {
                replyContent.innerHTML = `<h5>Are you sure you want to accept?</h5>`
                book = msgInfo.textContent.match(/(?<=your).+[^\.]/g)

                messg = `${login.first.toUpperCase()} accepts to lend you the${book}`
                reminderMsg = `You have accepted to lend your${book} to ${msgName}`
                clickSend(msgInfo.dataset.info, messg, 'reply', null, reminderMsg, targetCard)

            }

            function getLessonsInfo(msgInfo) {
                lesson = msgInfo.textContent.slice(msgInfo.textContent.indexOf('lessons'))
                lessonDate = msgInfo.textContent.match(/\w+ \d+, \d+/gi)[0]
                lessonTime = msgInfo.textContent.match(/\d+:\d+-\d+:\d+ \w+/gi)
            }

        })
    }
}

// on clicking the send button on modal, the appropriate info is 
// sent to the updateMsg to update the message to the profile
function clickSend(info, replyMsg, type, location, reminderMsg, targetCard) {
    let send = document.querySelector('#send')
    send.addEventListener('click', e => {
        if (targetCard) {
            let targetId = targetCard.dataset.findid
            toDoWhenDeleting(targetCard, 'messages', targetId)
        }
        if (replyMsg.value !== '') {
            if (location) {
                let fullMsg = `${replyMsg}. Location: ${location.value}`
                let rmdMsg = `${reminderMsg}. Location: ${location.value}`
                updateMsg(info, fullMsg, type, rmdMsg)
            } else if (typeof replyMsg === 'string') {
                updateMsg(info, replyMsg, type, reminderMsg)
            } else {
                let replyValue = replyMsg.value
                updateMsg(info, replyValue, type, reminderMsg)
            }
        }
    }, { once: true })
}

// on clicking the profile img on each msg posted, the user is taken to that
// persons profile
function goToProfile() {
    for (const p of document.querySelectorAll('.msgPic')) {
        p.addEventListener('click', e => {
            let profileId = e.target.dataset.id
            let pro = findLoginProfile(profileId)
            sessionStorage.setItem('viewingProfile', JSON.stringify(pro))
            document.location = 'viewProfile.html'
        })
    }
}

// on clicking the trash can and clicking on the delete button all messages are deleted
delAll()
function delAll() {
    document.querySelector('.emptyTrash').addEventListener('click', e => {
        e.target.setAttribute('data-target', '#sendMsg')
        e.target.setAttribute('data-toggle', 'modal')
        changeModalTxt('Delete all Messages?', 'Delete')
    })
    document.querySelector('#send').addEventListener('click', e => {
        let trashcan = document.querySelector('.emptyTrash').dataset
        if (trashcan.trash === 'Messages' && e.target.textContent === 'Delete') {
            saveDeleteChanges('messages')

        } else if (trashcan.trash === 'Reminders' && e.target.textContent === 'Delete') {
            saveDeleteChanges('reminders')
        }
    })
}

function saveDeleteChanges(remORmsgs) {
    for (const i of document.querySelectorAll('.msgItm')) { i.remove() }
    let p = findLoginProfile(login.id)
    login[remORmsgs] = []
    p[remORmsgs] = []
    localStorage.setItem('profilez', JSON.stringify(profilez))
    sessionStorage.setItem('logged-in', JSON.stringify(login))
    login = JSON.parse(sessionStorage.getItem('logged-in'))
}


//On clicking the X on each message the message is then deleted 
function deleteOne(msgORrem) {
    for (const del of document.querySelectorAll('.closing')) {
        del.addEventListener('click', e => {
            let msgid = e.target.dataset.msgid
            toDoWhenDeleting($(e.target).closest('.card'), msgORrem, msgid)

        })
    }
}
function toDoWhenDeleting(cardRem, msgRem, mId) {
    let p = findLoginProfile(login.id)
    for (const [i, msg] of p[msgRem].entries()) {
        if (Number(mId) === msg.msgId) {

            p[msgRem].splice(i, 1)
            login[msgRem].splice(i, 1)
            sessionStorage.setItem('logged-in', JSON.stringify(login))
            localStorage.setItem('profilez', JSON.stringify(profilez))
            login = JSON.parse(sessionStorage.getItem('logged-in'))

        }
    }
    setTimeout(() => {
        cardRem.remove()
        removeDateTitle()
        $(".msgItm").css("background-color", "");
        $(".msgItm:even").css("background-color", "rgb(218 230 250 / 37%)");
    }, 100)

}

// changes the modals title text and button text depending on arguments value given
function changeModalTxt(titleTxt, btnTxt, show = 'none') {
    console.log(titleTxt,btnTxt)
    let modalTitle = document.querySelector('.modal-title-2')
    let modalBtn = document.querySelector('#send')
    document.querySelector('.replyContent').style.display = `${show}`
    modalTitle.textContent = titleTxt
    modalBtn.textContent = btnTxt
}

// toggle between reminders/messages
function toggleRemindersMsgs() {
    document.querySelector('.remindersMsgs').addEventListener('click', e => {
        e.preventDefault()
        let trash = document.querySelector('.emptyTrash')
        if (trash.dataset.trash === 'Messages') {
            trash.dataset.trash = 'Reminders'

        } else {
            trash.dataset.trash = 'Messages'
        }
        let allMessg = document.querySelector('.allMessages')
        let allrmndrs = document.querySelector('.allReminders')
        let msgWrapper = document.querySelector('.messages')
        let newUl = document.createElement('ul')

        let msgTitle = e.target.nextElementSibling.textContent.trim()
        if (msgTitle === 'Messages') {
            allMessg.remove()
            createReminders(allrmndrs)
            newUl.setAttribute('class', 'list-group list-group-flush allMessages')
            newUl.setAttribute('data-name', 'messages')
            msgWrapper.append(newUl)
        } else {
            allrmndrs.remove()
            createMsgs()
            newUl.setAttribute('class', 'list-group list-group-flush allReminders')
            msgWrapper.append(newUl)
        }
        $(".msgItm:even").css("background-color", "rgb(218 230 250 / 37%)");
    })
}

// creates the reminders
function createReminders(allrmndrs) {
    let messageTitle = document.querySelector('.msgTitle')
    messageTitle.textContent = 'Reminders'
    for (const reminder of login.reminders) {
        for (const sentee of profilez) {
            if (sentee.id === reminder.id) {
                addMsgs('', allrmndrs, reminder, sentee)
            }
        }
    }
    goToProfile()
    deleteOne('reminders')
}
instantMsg()



