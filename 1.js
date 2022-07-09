window.addEventListener('load', () => {
    document.getElementById('list').style.height = document.documentElement.clientHeight - document.querySelector('.controls').offsetHeight - 28 + 'px'
});

//1. hiệu ứng phần input task
    inputTask.addEventListener('focus', function(){

        label.style.top = '0'
        label.style.color =  `#3C87FF`

    })
    inputTask.addEventListener('blur', function(){

        if(this.value === ''){
            label.style.top = '50%'
            label.style.color =  `#bfbfbf`
        }else{
            label.style.top = '0'
            label.style.color =  `#bfbfbf`
        }

    })
//-----------------------------------------------------

//2. hiệu ứng khi ấn vào nút add
    buttons.forEach(btn => {

        btn.addEventListener('mousedown', function(){
            this.style.transform = 'scale(0.95)'
        })

        btn.addEventListener('mouseup', function(){
            this.style.transform = 'scale(1)'
        })

    })
//-----------------------------------------------------

//3. hiệu ứng đường line di chuyển phần menu
    tabName.forEach(item => {

        item.addEventListener('click', function(){

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

        })
        
    })
    document.querySelector('.tabName.active')?.click()
//-----------------------------------------------------

//4. hiệu ứng tabs của menu show
    document.querySelectorAll('.tabPaneShow li').forEach(item => {

        item.addEventListener('click', function(){
            document.querySelector('.tabPaneShow li.active')?.classList.remove('active')
            item.classList.add('active')
        })

    })
//-----------------------------------------------------

//5. hiệu ứng ẩn hiện menu detele và edit
    function dotClick(_this){ 
        document.querySelector('.dot.active')?.classList.remove('active')
        _this.classList.add('active')
    }
    window.addEventListener('click', function(e){
        if(!e.target.matches('.dot.active')){
            document.querySelector('.dot.active')?.classList.remove('active')
        }
    })
//-----------------------------------------------------
