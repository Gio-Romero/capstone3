document.querySelector('#sign-in-submit').addEventListener('click', e => {
    e.preventDefault()
    let signInEmail = document.querySelector('#sign-in-email')
    let signInPwd = document.querySelector('#sign-in-password')
    for (const i of profilez) {
        if (signInEmail.value === i.email && signInPwd.value === i.password) {
            sessionStorage.setItem('logged-in', JSON.stringify(i))
            return document.location = 'MyProfile.html'
        }
    }
    alert('Wrong e-mail or password. Please try again.')
    signInEmail.value=''
    signInPwd.value=''
}) 

