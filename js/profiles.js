
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

$(window).on('load', () => {
  profileStart()
})

// function to add profile
function profileAdd(e) {
  let now = new Date()
  let nowMonth = now.getMonth() + 1
  let nowYear = now.getFullYear()
  let nowDay = now.getDate()
  let dobs = `${e.dob}`.split('-')
  let myDob
  if (Number(dobs[1]) === nowMonth && nowDay <= dobs[2]) {
    myDob = nowYear - dobs[0]
  } else {
    myDob = nowYear - dobs[0] - 1
  }

  let dataInfo 
  if (e.books.length!==0) {
    dataInfo=`${e.first}${e.books[0].text.join('')}${e.craft.join('')}${myDob}${e.block}block${e.assignment}${e.title}`.toLowerCase()
  }else{
    dataInfo=`${e.first}${e.craft.join('')}${myDob}${e.block}block${e.assignment}${e.title}`.toLowerCase()
  }

  // template for each card/profile
  $(".deck").append(`
          <div class=" col-sm-6 col-lg-4 col-xl-3 my-4 ml-sm-0" data-info=${dataInfo.split(' ').join('')} data-name=${e.first} 
          data-block=${e.block} data-age=${myDob} data-recent=${e.date} data-title=${e.title}>
          <div class="card card-profile">
            <img class="card-img-top resize" src='../images/${e.pic.slice(12)}' alt="">
            <div class="card-body">
              <p class="card-title text-center text-capitalize font-weight-bold"><b>${e.first} ${e.last}</b>
              <span class="badge badge-primary badge-pill ml-1 mt-2">${myDob}</span></p>
              <p class="text-center"><span class='font-weight-bold'>${e.title}</span> ${e.block} Block</p>
              <div class="d-flex justify-content-between align-item-center flex-column"> 
               <div class="card-text text-center mb-3 text-info">${e.bio.slice(0, 22)}...</div>
                <div class="btn-group justify-content-center">       
                  <button type="button" data-tags='${e.id}'class="btn btn-sm btn-outline-secondary rounded viewProfile">View Profile</button>
                </div>
              </div>
            </div>
            <div class="card-footer text-center">
              <small class="text-muted">Live Since ${timeInt(now.getTime() - e.date)} ago</small>
            </div>
          </div>
        </div>
          `)
}


// starts to add each profile to page
function profileStart() {
  for (const e of profilez) {
    if (login == null) {
      profileAdd(e)
    } else if (e.id === login.id) {
      continue
    } else {
      profileAdd(e)
    }
  }

  // click to go to profile
  let viewProfile = document.querySelectorAll('.viewProfile')
  for (let vp of viewProfile) {
    vp.addEventListener('click', e => {
      e.preventDefault()
      let tag = vp.dataset.tags
      for (const tg of profilez) {
        if (tg.id === tag) {
          sessionStorage.setItem('viewingProfile', JSON.stringify(tg))
          document.location = 'viewProfile.html'
        }
      }
    })
  }


}

// sets the times since being activated
function timeInt(n) {
  let seconds = Math.floor(n / 1000)
  let minutes = Math.floor(n / 60000)
  let hours = Math.floor(n / 3600000)
  let days = Math.floor(n / 86400000)
  let months = Math.floor(n / 2592000000)
  if (seconds < 60) {
    return `${seconds} seconds`
  } else if (minutes < 60) {
    return minutes > 1 ? `${minutes} minutes` : `${minutes} minute`
  } else if (hours < 24) {
    return hours > 1 ? `${hours} hours` : `${hours} hour`
  } else if (days < 30) {
    return days > 1 ? `${days} days` : `${days} day`
  } else {
    return months > 1 ? `${months} months` : `${months} month`
  }
}



let search = document.querySelector('#search')
let sortTitleShowing = document.querySelector('#sortTitleShowing')
let sortItms = document.querySelectorAll('.sortItm')

// set variables for text and sends it to filterByTitle function
for (const itm of sortItms) {
  itm.addEventListener('click', e => {
    let target = e.target.textContent
    e.target.textContent = sortTitleShowing.textContent
    sortTitleShowing.textContent = target
    filterByTitle(target)
  })
}

// send filterProfiles function the appropriat title to sort by
function filterByTitle(target) {
  if (target === 'Recent') {
    filterProfiles(target)
  } else if (target === 'Name') {
    filterProfiles(target)
  } else if (target === 'Age') {
    filterProfiles(target)
  } else if (target === 'Block') {
    filterProfiles(target)
  } else if (target === 'Mentor' || target === 'Student') {
    filterProfiles('title', target)
  }
}

// filters numbers 
function compareNumbers(a, b) {
  return a - b;
}
// filters out profiles depending on 'Sort By' option
let deckOfCards = document.querySelector('.deck').children

// filters profiles depending on the title chosen
function filterProfiles(target, name) {
  let arrayOfData = []

  for (const c of deckOfCards) {
    arrayOfData.push(c.dataset[target.toLowerCase()])
  }
  target == 'Age' ? arrayOfData.sort(compareNumbers) : arrayOfData.sort()
  if (target === 'title') {
    for (const c of deckOfCards) {
      if (c.dataset[target] === name) {
        c.style.display = 'block'
      } else {
        c.style.display = 'none'
      }
    }
  }
  if (target !== 'title') {
    for (let i = 0; i < arrayOfData.length; i++) {
      for (const card of deckOfCards) {
        if (arrayOfData[i] === card.dataset[target.toLowerCase()]) {
          card.remove()
          card.style.display = 'block'
          $(".deck").append(card)
          continue
        }
      }
    }
  }
}

// filters depending on search input
search.addEventListener('keyup', e => {
  let searchWord = e.target.value.split(' ').join('').toLowerCase()
  let deckOfCards = document.querySelector('.deck').children
  for (const c of deckOfCards) {
    if (c.dataset.info.indexOf(searchWord) !== -1) {
      c.style.display = 'block'
    } else {
      c.style.display = 'none'
    }
  }
})


