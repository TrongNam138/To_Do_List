//1. lấy dữ liệu từ loaclStorage và hiển thị ra màn hình và set mặc định lần đầu vào
    if(JSON.parse(localStorage.getItem('data') === null && JSON.parse(localStorage.getItem('data'))) === null){
        localStorage.setItem('idMax', JSON.stringify(0))
        localStorage.setItem('data' ,JSON.stringify([]))
    }
    const data = JSON.parse(localStorage.getItem('data'))

    if(data.length === 0 && document.querySelector('.notThing') === null){
        list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else{
        renderTemplate(data, list, 'afterbegin')
        showAllTask()
    }

//-----------------------------------------------------

//2. xử lý inputDueDate
    inputDueDate.addEventListener('input', function(){
        if(new Date().getTime() > new Date(this.value).getTime()){
            pNowDate.innerHTML = '--- dd/mm/yyyy --:--'
            this.value = ''
        }else{
            pNowDate.innerHTML = convertDate(new Date(this.value))
        }
    })
//-----------------------------------------------------

//3. xử lý check, thay đổi class và lưu vào localStorage
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

//4. xử lý thêm task
    buttonAdd.addEventListener('click', function(){
        const name = inputTask.value
        const dateTime = inputDueDate.value
        if(name.trim() === '' || dateTime === '') return
        
        let idMax = localStorage.getItem('idMax')
        
        
        data.push({id: +idMax + 1 ,name: name, dateTime: dateTime, status: "pending"})
        
        localStorage.setItem('idMax', JSON.stringify(+idMax + 1))
        localStorage.setItem('data' ,JSON.stringify(data))
        
       
        document.querySelector('.notThing')?.remove()

        list.insertAdjacentHTML('afterbegin', template(+idMax + 1 ,"pending", dateTime, name))
        setTimeout(()=>{
            document.querySelector('.task').classList.add('show')
        },0)
        
        inputTask.value = ''
        inputDueDate.value = ''
        pNowDate.innerHTML = '--- dd/mm/yyyy --:--'
    })

    inputTask.addEventListener('keyup', function(e){
        if(e.key !== 'Backspace' && inputTask.value){
            inputTask.value = inputTask.value[0].toUpperCase() + inputTask.value.slice(1)
        }
        if(e.key === 'Enter'){
            buttonAdd.click()
        }
    })
//-----------------------------------------------------

//5. xử lý xóa task
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
        if(data.length === 0 && document.querySelector('a') === null){
            list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
        }
    }, 250)
    

}
//-----------------------------------------------------

//6. xử lý edit
function editClick(_this){
    
    let task = _this.parentElement
    while(!task.matches('.task')){
        task = task.parentElement
    }

    console.log(task)

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

buttonSave.addEventListener('click', function(){
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
})
//-----------------------------------------------------

//7. xử lý task expired
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

//8. xử lý tab all, pending, completed, expired
document.getElementById('all').addEventListener('click', ()=>{menuShow('all')})
document.getElementById('pending').addEventListener('click', ()=>{menuShow('pending')})
document.getElementById('completed').addEventListener('click', ()=>{menuShow('completed')})
document.getElementById('expired').addEventListener('click', ()=>{menuShow('expired')})
//-----------------------------------------------------

//9. xử lý tab time, a-z, z-b
document.getElementById('time').addEventListener('click', ()=>{
    data.sort(function(a, b) {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    
    list.innerHTML = ''
    renderTemplate(data, list, 'beforeend')
    showAllTask()
})

document.getElementById('a-z').addEventListener('click', ()=>{
    data.sort((a, b) => a.name.localeCompare(b.name))
    
    list.innerHTML = ''
    renderTemplate(data, list, 'beforeend')
    showAllTask()
})

document.getElementById('z-a').addEventListener('click', ()=>{
    data.sort((a, b) => b.name.localeCompare(a.name))
    
    list.innerHTML = ''
    renderTemplate(data, list, 'beforeend')
    showAllTask()
})
//-----------------------------------------------------

//10. xử lý search 
inputSearch.addEventListener('input', function(){
    const display = []
    const notDisplayed = []
    let countShow = 0
    
    const keyWord = this.value.toLowerCase()
    for (const element of [...document.querySelectorAll('.task')]) {
        const info = element.querySelector('.task-content').textContent.toLowerCase()
        if(info.includes(keyWord)){
            countShow++
            if(!element.classList.contains('show')){
                display.push(element)
            }
        }else{
            if(element.classList.contains('show')){
                notDisplayed.push(element)
            }
        }
    }
    
    animation(countShow, display, notDisplayed)
    
})
//-----------------------------------------------------

//11. xử lý các lỗi vặt
tabName.forEach(item => {
    item.addEventListener('click', function(){
        inputSearch.value = ''
        showAllTask()
        if(item.id === 'tabShow'){
            document.querySelector('.tabPaneShow li.active').click()
        }
    })
})
//-----------------------------------------------------


