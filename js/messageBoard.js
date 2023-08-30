
// post buttons login and logout
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

// createMsgBrd and postMsgs functions are instantly called to set up messages
createMsgBrd()
postMsgs()
let msgBrdTxt = document.querySelector('#msgBrdTxt')
document.querySelector('.postToMsgBrd').addEventListener('click', e => {
    if (msgBrdTxt.value.trim() !== '') {
        updateMsg(login.id, msgBrdTxt.value.trim(), 'msgBrd')
        createMsgBrd()
        postMsgs()
    }
    msgBrdTxt.value=''
})

// createMsgBrd creates the container for all the messages
function createMsgBrd() {
    let msgBoard = document.querySelector('.msgBoard')
    msgBoard.remove()
    let newBrd = document.createElement('div')
    newBrd.setAttribute('class', 'my-5 msgBoard')
    document.querySelector('main').append(newBrd)
}

// postMsgs appends all messages to the container
function postMsgs() {
    if (messageBoard) {
        let dayCreated = null
        for (const e of messageBoard) {
            if (dayCreated !== e.dateCreated) {
                dayCreated = e.dateCreated
                createDateTitle(e.dateCreated, document.querySelector('.msgBoard'))
            }
            $('.msgBoard').append(`
    <div class="d-flex align-items-center flex-column flex-md-row justify-content-md-center mb-5 brdMsg">
    <div class="w-100 text-center"> <img class="msgBrdImg" src=../images/${e.pix} alt="" data-id=${e.id}>
        <div class="d-flex justify-content-around text-muted">
            <p class="name-posted mr-2 text-capitalize">${e.name}</p>
            <p class="time-posted">${e.time}</p>
        </div>
    </div>
    <div class="mb-2 mx-5 w-75 w-md-50 p-0 p-lg-5">
        <p class="message-posted">${e.msg}</p>
    </div>
    <div data-ProId=${e.id} data-name=${e.name}>
    <button class="btn btn-sm btn-outline-primary rpy" data-target="#sendMsg"
    data-toggle="modal">Reply Directly</button>
    </div>
    </div>
    <hr>
    `)
        }
    }
    goToProfile()

    for (const btn of document.querySelectorAll('.rpy')) {
        let msg = document.querySelector('#msgToSnd')
        btn.addEventListener('click', e => {
            e.preventDefault()
            let target = e.target.closest('div')
            document.querySelector('.modal-title-2').textContent = `Send a message to ${target.dataset.name.toUpperCase()}`
            document.querySelector('#snd').addEventListener('click', e => {
                if (msg !== '') {
                    updateMsg(target.dataset.proid, msg.value, 'reply')

                } else {
                    alert('Need Characters!')
                }
                msg.value = ''
            }, { once: true })
        })
    }
}

// creates the date if its a new day
function createDateTitle(msgCreated, msgWrapper) {
    let dateDiv = document.createElement('div')
    dateDiv.textContent = msgCreated
    let line = document.createElement('hr')
    dateDiv.append(line)
    dateDiv.setAttribute('class', 'text-center font-weight-bold ')
    msgWrapper.append(dateDiv)
}
instantMsg()

// on clicking the profile img on each msg posted, the user is taken to that
// persons profile
function goToProfile() {
    for (const p of document.querySelectorAll('.msgBrdImg')) {
        p.addEventListener('click', e => {
            let profileId = e.target.dataset.id
            let pro = findLoginProfile(profileId)
            sessionStorage.setItem('viewingProfile', JSON.stringify(pro))
            document.location = 'viewProfile.html'
        })
    }
}

