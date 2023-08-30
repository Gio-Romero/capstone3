// creates a calendar constructor 
class Calendar {
    constructor(year, month, day, slots) {
        this.year = year,
            this.month = month,
            this.day = day,
            this.slots = slots
    }
}
// empty caledars variable to hold the profiles calendars info
let calendars = []

// months variable holds all the months and their days
let months = {
    Jan: [31, 'January'],
    Feb: [28, 'February'],
    Mar: [31, 'March'],
    Apr: [30, 'April'],
    May: [31, 'May'],
    Jun: [30, 'June'],
    Jul: [31, 'July'],
    Aug: [31, 'August'],
    Sep: [30, 'September'],
    Oct: [31, 'October'],
    Nov: [30, 'November'],
    Dec: [31, 'December']
}


let calBody = document.querySelector('.calBody')

// sets now to current date to use its data to start the calendar
let now = new Date()
let day = 86400000
let dateInfo = now.toString().match(/\w+/g)

document.querySelector('.calMonth').textContent = months[dateInfo[1]][1]
document.querySelector('.calYear').textContent = dateInfo[3]
let dateStart = new Date(now.getTime() - ((day * Number(dateInfo[2])) - day))
let startDate = `${dateStart}`.split(' ')

startCal(startDate[0], startDate[1])

// starts the calendar on the square depending on the name given 
function startCal(name, month) {
    switch (name) {
        case 'Sun':
            start(0, month)
            break;
        case 'Mon':
            start(1, month)
            break;
        case 'Tue':
            start(2, month)
            break;
        case 'Wed':
            start(3, month)
            break;
        case 'Thu':
            start(4, month)
            break;
        case 'Fri':
            start(5, month)
            break;
        case 'Sat':
            start(6, month)
            break;
    }
}

// start function sends index and month to carry down to setSquares and
// sets each square who has a date to have a modal
function start(idx, month) {
    setSquares(idx, month)
    let slotItm = document.querySelectorAll('.slotItmNum')
    for (let i = 0; i < idx + months[month][0]; i++) {
        if (i >= idx && i < idx + months[month][0]) {
            slotItm[i].textContent = i - idx + 1
            let tdata = slotItm[i].closest('td')
            tdata.setAttribute('data-target', '#signUp')
            tdata.setAttribute('data-toggle', 'modal')

            let currMonth = document.querySelector('.calMonth').textContent
            let currYear = document.querySelector('.calYear').textContent

            if (slotItm[i].textContent === Number(dateInfo[2]).toString() && currMonth.slice(0, 3) === dateInfo[1] &&
                currYear === dateInfo[3]) {
                slotItm[i].offsetParent.style.backgroundColor = 'rgb(237, 245, 255)'
            } else {
                slotItm[i].offsetParent.style.backgroundColor = ''
            }
        } else {
            slotItm[i].textContent = ''
            slotItm[i].closest('td').removeAttribute('data-target', '#signUp')
            slotItm[i].closest('td').removeAttribute('data-toggle', 'modal')
        }
    }
}

// setSquares function creates rows for the calendar and 
// depending on the value of i, sends that number to the
// setDay function to create the squares
function setSquares(idx, month) {
    for (let i = 0; i < idx + months[month][0]; i++) {
        if (i % 7 == 0) {
            let tr = document.createElement('tr')
            tr.setAttribute('class', i)
            calBody.appendChild(tr)
        }
        if (i < 7) {
            setDay(0)
        } else if (i < 14) {
            setDay(7)
        } else if (i < 21) {
            setDay(14)
        } else if (i < 28) {
            setDay(21)
        } else if (i < 35) {
            setDay(28)
        } else {
            setDay(35)
        }
    }
}

// setDay function creates the elements for each square that
// will be holding the date and slot data
function setDay(i) {
    let td = document.createElement('td')
    let pTag = document.createElement('p')
    pTag.setAttribute('class', 'slotItmNum')
    let slots = document.createElement('div')
    slots.setAttribute('class', 'slots')
    td.appendChild(pTag)
    td.append(slots)
    td.setAttribute('class', 'tData')
    let tr = document.getElementsByClassName(`${i}`)
    tr[0].append(td)
}

let newDateInfo
let count = 0
let next = document.querySelector('.next')
// when clicking on the next button of the calendar send current count
// to the prevNext function to restructure the entire calendar
next.addEventListener('click', () => {
    if (count === 0) {
        count = months[dateInfo[1]][0]
        prevNext(count)
    } else {
        count += months[newDateInfo[1]][0]
        prevNext(count)
    }
})

let prev = document.querySelector('.prev')
// when clicking on the prev button of the calendar send current count
// to the prevNext function to restructure the entire calendar
prev.addEventListener('click', () => {
    if (count === 0) {
        count -= months[dateInfo[1]][0]
        prevNext(count)
    } else {
        count -= months[newDateInfo[1]][0]
        prevNext(count)
    }
})

// depending on count, restructures the entire calendars data to accomodate the given month
function prevNext(count) {
    let tableRows = document.querySelectorAll('.calBody tr')
    for (const tr of tableRows) {
        tr.remove()
    }
    nextMonth = new Date(now.getTime() + (day * count))
    newDateInfo = nextMonth.toString().match(/\w+/g)
    let pSlots = document.querySelectorAll('p.slotItm')
    for (const p of pSlots) {
        p.remove()
    }
    document.querySelector('.calMonth').textContent = months[newDateInfo[1]][1]
    document.querySelector('.calYear').textContent = newDateInfo[3]
    let name = new Date(nextMonth.getTime() - ((day * Number(newDateInfo[2])) - day)).toString().match(/\w+/g)
    startCal(name[0], name[1])
    removeSlots()
    let datesss = document.querySelectorAll('.calBody tr p')

    for (const d of datesss) {
        for (const c of calendars) {
            if (c.year === newDateInfo[3] && c.month === months[newDateInfo[1]][1] &&
                c.day === d.textContent) {               
                for (const slot of c.slots) {
                    appendSlots(slot, d.nextElementSibling, 'fa fa-trash', slot)
                }
            }
        }
    }
}

// appends slots to the calendar with an icon
function appendSlots(val, appendor, icon = 'fa fa-trash', dataTxt=val) {
    if (viewingProfile) {
        icon='fa fa-user-friends'
    }
    let peeTag = document.createElement('p')
    let spanRemove = document.createElement('span')
    spanRemove.setAttribute('class', `${icon} mr-0 mr-md-2`)
    peeTag.setAttribute('class', 'slotItm')
    peeTag.setAttribute('title',`${dataTxt}`)
    peeTag.textContent = val
    appendor.append(peeTag)
    peeTag.prepend(spanRemove)
}

let target
// if clicking on a trash icon within the calendar, it removes the slot from
// the calendar and the calendar array permanently
function removeSlots() {
    let dateNum = document.querySelectorAll('.tData')
    for (const i of dateNum) {
        i.addEventListener('click', e => {
            console.log(e.target)
            target = e.target.closest('td')
            if (e.target.className.includes('fa fa-trash')) {
                let rem = e.target.closest('p')
                let testMonth = target.closest('.calendar').children[2].firstElementChild.textContent
                let testYear = target.closest('.calendar').children[2].lastElementChild.textContent
                let d = target.firstElementChild.textContent
                rem.remove()
                for (const [ix, x] of calendars.entries()) {
                    if (x.month === testMonth && x.year === testYear && x.day === d) {
                        let ind = x.slots.indexOf(rem.textContent)
                        x.slots.splice(ind, 1)
                        if (x.slots.length === 0) {
                            calendars.splice(ix, 1)
                        }
                    }
                }
            }
        })
    }
}
removeSlots()


let post = document.querySelector('#connect')
// when clicking the connect button, as long as its not someones profile and
// slot count is less than 4, then append the slot to the calendar square
post.addEventListener('click', () => {
    if (!viewingProfile) {
        let slotCount = target.childNodes[1].childNodes.length
        let inpVal = document.getElementById('modalInp')
        if (slotCount !== 4 && inpVal.value !== '') {
            appendSlots(inpVal.value, target.childNodes[1], 'fa fa-trash', inpVal.value)
        } else {
            alert('characters needed/maxed out on slots')
        }
        monthText = target.closest('.calendar').children[2].firstElementChild.textContent
        yearText = target.closest('.calendar').children[2].lastElementChild.textContent
        dayText = target.firstElementChild.textContent
        addToCalendarArr(monthText, yearText, dayText, inpVal)
        inpVal.value = ''
    }
    restructureSlots(size)
})


// adds slots to Calendar array
let posting
function addToCalendarArr(monthText, yearText, dayText, inpVal) {
    for (const i of calendars) {
        if (i.month === monthText && i.year === yearText && i.day === dayText &&
            i.slots.length !== 0 && inpVal.value !== '') {
            return i.slots.push(inpVal.value)
        }
    }
    if (inpVal.value !== '') {
        posting = new Calendar(yearText, monthText, dayText, [inpVal.value])
        return calendars.push(posting)
    }
    
}


let size = null
// onresize receives the new window width and sends it to redrawCalendarSlots function
function getWindowCoords() {
    canvasX = window.innerWidth
    redrawCalendarSlots(canvasX)
}

window.onresize = getWindowCoords
window.onload = getWindowCoords

// depending on width size and on the size variable, the slots will be restructured
function redrawCalendarSlots(canvasX) {
    if (canvasX < 690 && size !== 'small') {
        size = 'small'
        restructureSlots(size)
    } else if (canvasX > 690 && size !== 'large') {
        size = 'large'
        restructureSlots(size)
    }
}

// restructures the slots depending on its size(width of the screen)
function restructureSlots(size) {
    let slots = document.querySelectorAll('.slots')
    for (const i of slots) {
        if (i.children.length > 0) {
            for (const slot of i.children) {
                 // if on your profile or viewing someones profile, the icon switches
                let icon='fa fa-trash'
                if (viewingProfile) {
                    icon='fa fa-user-friends'
                }
               
                let spanRemove = document.createElement('span')
                spanRemove.setAttribute('class', `${icon} mr-0 mr-md-2`)
                let slotTxt
                // depending on the size of the window, it either displays full text content or reduces it
                if (size === 'large') {
                    slotTxt = slot.attributes[1].value
                    slot.textContent = slotTxt
                } else {
                    slotTxt = slot.textContent
                    slot.textContent = slotTxt.slice(0, 5) + '..'
                }
                
                slot.prepend(spanRemove)
            }
        }
    }
}

// allows all slot Items to display their full information
$(".slotItm").tooltip()



