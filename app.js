
const label = document.querySelector('#input-task + label')
const inputTask = document.getElementById('input-task')
const inputDueDate = document.getElementById('deadline')
const buttonAdd = document.getElementById('btn-add')
const buttonSave = document.getElementById('btn-save')
const tabName = document.querySelectorAll('.tabName')
const list = document.querySelector('.list')
const pNowDate =  document.querySelector('.nowDate')


list.style.height = document.documentElement.clientHeight - document.querySelector('.controls').offsetHeight - 28 + 'px'

function showItem(){
    const arrShow = []

    list.querySelectorAll('.task').forEach(element => {
        if(!element.classList.contains('show')){
            arrShow.push(element)
        }
    })

    let count = 0
    const loopInterval = setInterval(() => {
        if(count === arrShow.length) {
            clearInterval(loopInterval)
        } else {
            arrShow[count++].classList.add('show')
        }
    }, 250);
}

// Hàm thêm số 0 vào đằng trước các só từ 1 -> 9
function addZero(number){
    if(number > 0 && number < 10 ){
        return '0' + number
    }
    return '' + number
}
//-----------------------------------------------------

// Hàm chuyển đổi ngày giờ
function convertDate(date = ""){
    if(!date){
        return `${new Date().toDateString().slice(0, 4)}${addZero(new Date().getDate())}/${addZero(new Date().getMonth() + 1)}/${new Date().getFullYear()} - 23:59`
    }else{
        return `${new Date(date).toDateString().slice(0, 4)}${addZero(new Date(date).getDate(date))}/${addZero(new Date(date).getMonth() + 1)}/${new Date(date).getFullYear()} - ${new Date(date).toTimeString().slice(0, 5)}`
    }
}
//-----------------------------------------------------

function template(id ,status, dateTime, name) {
    return `
    <li class="task ${status}" data-id="${id}">
    <i onclick="nameClick(this)" class="iconCheck las la-check-square"></i>
    <div class="task-content">
    <p class="task__dateTime">
    <span class="date">${convertDate(new Date(dateTime)).slice(0, 14)}</span>
    <span class="time">${convertDate(new Date(dateTime)).slice(17)}</span>
    </p>
    <p onclick="nameClick(this)" class="name">${name}</p>
    </div>
    <i onclick="dotClick(this)" class="dot las la-ellipsis-h">
    <ul class="setting">
    <li onclick="deleteClick(this)" class="delete"><i class="las la-trash"></i>Delete</li>
    <li onclick="editClick(this)" class="edit"><i class="las la-pen"></i>Edit</li>
    </ul>
    </i>
    </li>`
}

// lấy dữ liệu từ loaclStorage và hiển thị ra màn hình
if(JSON.parse(localStorage.getItem('data') === null && JSON.parse(localStorage.getItem('data'))) === null){
    localStorage.setItem('idMax', JSON.stringify(0))
    localStorage.setItem('data' ,JSON.stringify([]))
}
const data = JSON.parse(localStorage.getItem('data'))


function renderTemplate(insertPosition){
    data.forEach(element => {
        list.insertAdjacentHTML(insertPosition, template(element.id , element.status, element.dateTime, element.name))
    });

    let count = 0
    setTimeout(()=>{
        document.querySelectorAll('.task')[count++].classList.add('show')
    }, 0)
    const loopInterval = setInterval(() => {
        if(count === document.querySelectorAll('.task').length) {
            clearInterval(loopInterval)
        } else {
            document.querySelectorAll('.task')[count++].classList.add('show')
        }
    }, 250);

}

if(data.length === 0){
    list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
}else{
    document.querySelector('.notThing')?.remove()
    renderTemplate('afterbegin')
}
//-----------------------------------------------------

// Start phần hiệu ứng
{
    // hiệu ứng ẩn hiện phần detele và edit
function dotClick(_this){
    document.querySelector('.dot.active')?.classList.remove('active')
    _this.classList.add('active')
}

window.onclick = function(e){
    if(!e.target.matches('.dot.active')){
        document.querySelector('.dot.active')?.classList.remove('active')
    }
}
//-----------------------------------------------------

// hiệu ứng đường line di chuyển phần menu
tabName.forEach(item => {
    item.onclick = function(){
        document.querySelector('.tabName.active')?.classList.remove('active')
        item.classList.add('active')
        document.querySelector('.tabList .line').style.left = item.offsetLeft + 'px'
        document.querySelector('.tabList .line').style.width = item.offsetWidth + 'px'
        
        document.querySelectorAll('.tabContent ul').forEach(ul => {
            if(ul.dataset.pane === item.id){
                document.querySelector('.tabContent ul.active')?.classList.remove('active')
                ul.classList.add('active')
            }
        })
        
        document.getElementById("search").value = ''

        if(item.id !== 'tabShow'){
            showItem()
        }else{
            document.querySelector('.tabPaneShow li.active')?.click()
        }
    }
})

document.querySelector('.tabName.active')?.click()
//-----------------------------------------------------

// hiệu ứng phần tabs
document.querySelectorAll('.tabPaneShow li').forEach(item => {
    item.onclick = function(){
        document.querySelector('.tabPaneShow li.active')?.classList.remove('active')
        item.classList.add('active')
        if(data.length === 0){
            if(document.querySelector('.notThing') === null)
                list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
        }else{
            document.querySelector('.notThing')?.remove()
        }
    }
})

//-----------------------------------------------------

// hiệu ứng phần input task
inputTask.onfocus= function() {
    label.style.top = '0'
    label.style.color =  `#3C87FF`
}

inputTask.onblur = function() {
    if(this.value === ''){
        label.style.top = '50%'
        label.style.color =  `#bfbfbf`
    }else{
        label.style.top = '0'
        label.style.color =  `#bfbfbf`
    }
}
//-----------------------------------------------------

// hiệu ứng nút add
document.querySelectorAll('.btn').forEach(btn => {
    btn.onmousedown = function(){
    this.style.transform = 'scale(0.95)' 
    }  
})
document.querySelectorAll('.btn').forEach(btn => {
  btn.onmouseup = function(){
    this.style.transform = 'scale(1)' 
    }  
})

//-----------------------------------------------------
}
// End phần hiệu ứng

// xử lý đầu vào
inputDueDate.oninput = function(){
    if(new Date().getTime() > new Date(this.value).getTime()){
        pNowDate.innerHTML = '--- dd/mm/yyyy --:--'
        this.value = ''
    }else{
        pNowDate.innerHTML = convertDate(new Date(this.value))
    }
}
//-----------------------------------------------------

// xử lý thêm task
buttonAdd.onclick = function(){
    const name = inputTask.value
    const dateTime = inputDueDate.value
    if(name === '' || dateTime === '') return

    let idMax = localStorage.getItem('idMax')

    
    data.push({id: +idMax + 1 ,name: name, dateTime: dateTime, status: "pending"})
    
    localStorage.setItem('idMax', JSON.stringify(+idMax + 1))
    localStorage.setItem('data' ,JSON.stringify(data))

    if(data.length === 0){
        if(document.querySelector('.notThing') === null)
            list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else{
        document.querySelector('.notThing')?.remove()
    }
    
    list.insertAdjacentHTML('afterbegin', template(+idMax + 1 ,"pending", dateTime, name))
    setTimeout(()=>{
        document.querySelectorAll('.task').forEach(element => {
            element.classList.add('show')
        })
    },0)
    
    inputTask.value = ''
    inputDueDate.value = ''
    pNowDate.innerHTML = '--- dd/mm/yyyy --:--'
}

inputTask.onkeyup = function(e){
    if(e.key !== 'Backspace'){
        inputTask.value = inputTask.value[0].toUpperCase() + inputTask.value.slice(1)
    }
    if(e.key === 'Enter'){
        buttonAdd.click()
    }
}
//-----------------------------------------------------

// xử lý delete
function deleteClick(_this){
    
    let task = _this.parentElement
    while(!task.matches('.task')){
        task = task.parentElement
    }

    
    data.find((item, index) => {
        return item.id === +task.dataset.id && data.splice(index, 1)
    })
    
    localStorage.setItem('data' ,JSON.stringify(data))
    
    task.classList.remove('show')
    setTimeout(()=>{
        task.remove()
        if(data.length === 0){
            if(document.querySelector('.notThing') === null)
                list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
        }else{
            document.querySelector('.notThing')?.remove()
        }
    }, 250)
}
//-----------------------------------------------------

// xử lý edit
function editClick(_this){
    
    let task = _this.parentElement
    while(!task.matches('.task')){
        task = task.parentElement
    }

    const pName = task.querySelector('.name')
    const pDateTime = task.querySelector('.task__dateTime')
    const dd = pDateTime.innerText.slice(4, 6)
    const mm = pDateTime.innerText.slice(7, 9)
    const yyyy = pDateTime.innerText.slice(10, 14)
    const date = pDateTime.innerText.slice(0, 14)
    const time = pDateTime.innerText.slice(15)
    
    inputTask.focus()
    inputTask.value = pName.innerText
    inputDueDate.value = `${yyyy}-${mm}-${dd}T${time}`
    
    pNowDate.innerText = `${date} - ${time}`
    buttonAdd.style.display ='none'
    buttonSave.style.display ='block'

    task.classList.add('edit')
}

buttonSave.onclick = function(){
    const date = convertDate(inputDueDate.value).slice(0, 14)
    const time = convertDate(inputDueDate.value).slice(17)
    const name = inputTask.value
    const taskEdit = document.querySelector('.task.edit')

    
    const taskData = data.find((item) => {return +item.id === +taskEdit.dataset.id})
    taskData.name = name
    taskData.dateTime = inputDueDate.value
    localStorage.setItem('data', JSON.stringify(data))    

    taskEdit.querySelector('.task__dateTime .date').innerHTML = date
    taskEdit.querySelector('.task__dateTime .time').innerHTML = time
    taskEdit.querySelector('.task-content .name').innerHTML = name

    taskEdit.classList.remove('edit')
    inputTask.value = ''
    inputDueDate.value = ''
    pNowDate.innerHTML = '--- dd/mm/yyyy --:--'
    buttonAdd.style.display ='block'
    this.style.display ='none'
}
//-----------------------------------------------------

// xử lý check 
function nameClick(_this){
    
    let task = _this.parentElement
    while(!task.matches('.task')){
        task = task.parentElement
    }
    
    if(task.classList.contains('pending')){
        task.classList.replace('pending', 'completed')
    }else{
        task.classList.replace('completed', 'pending')
    }


    data.find((item) => {
        return item.id === +task.dataset.id
    }).status = task.classList[1]
    localStorage.setItem('data' ,JSON.stringify(data))

}
//-----------------------------------------------------

// xử lý task expired
setInterval(()=>{
    for (const item of data) {
        if(new Date().getTime() >= new Date(item.dateTime).getTime() && item.status === 'pending'){
            for (const task  of [...list.querySelectorAll('.task')]) {
                if(+task.dataset.id === +item.id){
                    task.classList.replace('pending', 'expired')
                    item.status = 'expired'
                    localStorage.setItem('data' ,JSON.stringify(data))
                    break
                }
            }
            
        }          
    }
}, 1000)
//-----------------------------------------------------

function show (show){

    const display = []
    const notDisplayed = []
    
    if(show === 'pending' || show === 'expired' || show === 'completed'){
        list.querySelectorAll('.task').forEach(element => {
            if(element.classList.contains(show)){
                if(!element.classList.contains('show')){
                    display.push(element)
                }
            }else{
                if(element.classList.contains('show')){
                    notDisplayed.push(element)
                }
            }
        })
    }else if(show = 'all') {
        showItem()
    }

    let countDisplay = 0
    let countNotDisplayed = 0

    setTimeout(()=>{
        notDisplayed[countNotDisplayed++].classList.remove('show')
    }, 0)
    const notDisplayedInterval = setInterval(() => {
        if(countNotDisplayed === notDisplayed.length) {
            clearInterval(notDisplayedInterval)
        } else {
            notDisplayed[countNotDisplayed++].classList.remove('show')
        }
    }, 250);
    
    setTimeout(() => {
        setTimeout(()=>{
            display[countDisplay++].classList.add('show')
        }, 0)
        const displayInterval = setInterval(() => {
            if(countDisplay === display.length) {
                clearInterval(displayInterval)
            } else {
                display[countDisplay++].classList.add('show')
            }
        }, 250);
    
    }, notDisplayed.length * 250);

    return
}

document.getElementById('all').addEventListener('click', ()=>{show('all')})
document.getElementById('pending').addEventListener('click', ()=>{show('pending')})
document.getElementById('completed').addEventListener('click', ()=>{show('completed')})
document.getElementById('expired').addEventListener('click', ()=>{show('expired')})

document.getElementById('time').addEventListener('click', ()=>{
    data.sort(function(a, b) {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    if(data.length === 0){
        if(document.querySelector('.notThing') === null)
            list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else{
        document.querySelector('.notThing')?.remove()
        list.innerHTML = ''
        renderTemplate('beforeend')
    }
})

document.getElementById('a-z').addEventListener('click', ()=>{
    data.sort((a, b) => a.name.localeCompare(b.name))
    if(data.length === 0){
        if(document.querySelector('.notThing') === null)
            list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else{
        document.querySelector('.notThing')?.remove()
        list.innerHTML = ''
        renderTemplate('beforeend')
    }
    
})
document.getElementById('z-a').addEventListener('click', ()=>{
    data.sort((a, b) => a.name.localeCompare(b.name))
    if(data.length === 0){
        if(document.querySelector('.notThing') === null)
            list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else{
        document.querySelector('.notThing')?.remove()
        list.innerHTML = ''
        renderTemplate('afterbegin')
    }
})



document.getElementById("search").oninput = function(){
    const display = []
    const notDisplayed = []
    
    const keyWord = this.value.toLowerCase()
    for (const element of [...document.querySelectorAll('.list .task')]) {
        const info = element.querySelector('.task-content').textContent.toLowerCase()
        if(info.includes(keyWord)){
            if(!element.classList.contains('show')){
                display.push(element)
            }
        }else{
            if(element.classList.contains('show')){
                notDisplayed.push(element)
            }
        }
        
    }

    let countDisplay = 0
    let countNotDisplayed = 0

    setTimeout(()=>{
        notDisplayed[countNotDisplayed++].classList.remove('show')
    }, 0)
    const notDisplayedInterval = setInterval(() => {
        if(countNotDisplayed === notDisplayed.length) {
            clearInterval(notDisplayedInterval)
        } else {
            notDisplayed[countNotDisplayed++].classList.remove('show')
        }
    }, 250);
    
    setTimeout(() => {
        setTimeout(()=>{
            display[countDisplay++].classList.add('show')
        }, 0)
        const displayInterval = setInterval(() => {
            if(countDisplay === display.length) {
                clearInterval(displayInterval)
            } else {
                display[countDisplay++].classList.add('show')
            }
        }, 250);
    
    }, notDisplayed.length * 250);

}








