const inputTask = document.getElementById('input-task')
const label = document.querySelector('#input-task + label')
const buttons = document.querySelectorAll('.btn')
const tabName = document.querySelectorAll('.tabName')
const list = document.getElementById('list')
const inputDueDate = document.getElementById('deadline')
const pNowDate =  document.querySelector('.nowDate')
const buttonAdd = document.getElementById('btn-add')
const buttonSave = document.getElementById('btn-save')
const inputSearch = document.getElementById("search")

//1. Hàm thêm số 0 vào đằng trước các só từ 1 -> 9
    function addZero(number){
        if(number > 0 && number < 10 ){
            return '0' + number
        }
        return '' + number
    }
//-----------------------------------------------------

//2. Hàm chuyển đổi ngày giờ
    function convertDate(date = ""){
        if(!date){
            return `${new Date().toDateString().slice(0, 4)}${addZero(new Date().getDate())}/${addZero(new Date().getMonth() + 1)}/${new Date().getFullYear()} - 23:59`
        }else{
            return `${new Date(date).toDateString().slice(0, 4)}${addZero(new Date(date).getDate(date))}/${addZero(new Date(date).getMonth() + 1)}/${new Date(date).getFullYear()} - ${new Date(date).toTimeString().slice(0, 5)}`
        }
    }
//-----------------------------------------------------

//3. template task
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
//-----------------------------------------------------

//4. Render Template
    function renderTemplate(data ,element , insertPosition){
        
        data.forEach(item => {
            element.insertAdjacentHTML(insertPosition, template(item.id , item.status, item.dateTime, item.name))
        });
        
    }
//-----------------------------------------------------

//5. animation
    function animation(countShow ,display, notDisplayed){
        if(countShow > 0){
            document.querySelector('.notThing')?.remove()
        }

        let countDisplay = 0
        let countNotDisplayed = 0
        
        setTimeout(()=>{
            notDisplayed[countNotDisplayed++]?.classList.remove('show')
        }, 0)

        const notDisplayedInterval = setInterval(() => {
            if(countNotDisplayed >= notDisplayed.length) {
                clearInterval(notDisplayedInterval)
            } else {
                notDisplayed[countNotDisplayed++].classList.remove('show')
            }
        }, 250);
        
        setTimeout(() => {

            setTimeout(()=>{
                display[countDisplay++]?.classList.add('show')
            }, 0)

            const displayInterval = setInterval(() => {
                if(countDisplay >= display.length) {
                    clearInterval(displayInterval)

                    document.querySelectorAll('.tabPaneShow li').forEach(item => {
                        item.style.pointerEvents = 'all'
                    })

                    if(countShow === 0 && document.querySelector('.notThing') === null){
                        list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
                    }
                } else {
                    display[countDisplay++].classList.add('show')
                }
            }, 250);
            
        }, notDisplayed.length * 250);
    }
//-----------------------------------------------------

//6. animation hiển thị tất cả task 
function showAllTask(){
    const arrShow = []
    
    list.querySelectorAll('.task').forEach(element => {
        if(!element.classList.contains('show')){
            arrShow.push(element)
        }
    })

    if(list.querySelectorAll('.task').length === 0 && document.querySelector('.notThing') === null){
        list.insertAdjacentHTML('afterbegin', `<p class="notThing">You don't have any task here</p>`)
    }else if(list.querySelectorAll('.task').length > 0){
        document.querySelector('.notThing')?.remove()
    }
    
    let count = 0
    setTimeout(()=>{
        arrShow[count++]?.classList.add('show')
    }, 0)
    const loopInterval = setInterval(() => {
        if(count >= arrShow.length) {
            clearInterval(loopInterval)
            document.querySelectorAll('.tabPaneShow li').forEach(item => {
                item.style.pointerEvents = 'all'
            })
        } else {
            arrShow[count++].classList.add('show')
        }
    }, 250);
    
}
//-----------------------------------------------------

//7. hàm menu show
    function menuShow (show){

        document.querySelectorAll('.tabPaneShow li').forEach(item => {
            item.style.pointerEvents = 'none'
        })
        
        const display = []
        const notDisplayed = []
        let countShow = 0
        
        if(show === 'pending' || show === 'expired' || show === 'completed'){
            list.querySelectorAll('.task').forEach(element => {
                if(element.classList.contains(show)){
                    countShow++
                    if(!element.classList.contains('show')){
                        display.push(element)
                    }
                }else{
                    if(element.classList.contains('show')){
                        notDisplayed.push(element)
                    }
                }
            })
            animation(countShow ,display, notDisplayed)
        }else if(show = 'all') {
            showAllTask()
        }
        
    }
//-----------------------------------------------------
