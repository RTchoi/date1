let selectedFoodName = "";

function nextStep(currentStep, nextStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + nextStep).classList.add('active');
}

// --- 1단계 버튼 제어 ---
const step1Card = document.getElementById('step1');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

yesBtn.addEventListener('click', function() {
    nextStep(1, 2);
});

let isFirstMove = true; 

function handleNoButtonMove(clientX, clientY) {
    if (!step1Card.classList.contains('active')) return;

    const btnRect = noBtn.getBoundingClientRect();
    
    if (isFirstMove) {
        const cardRect = step1Card.getBoundingClientRect();
        step1Card.style.minHeight = cardRect.height + 'px';

        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();

        yesBtn.style.position = 'fixed';
        yesBtn.style.left = yesRect.left + 'px';
        yesBtn.style.top = yesRect.top + 'px';
        yesBtn.style.margin = '0';

        noBtn.style.position = 'fixed';
        noBtn.style.left = noRect.left + 'px';
        noBtn.style.top = noRect.top + 'px';
        noBtn.style.margin = '0';

        isFirstMove = false;
        return; 
    }

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const deltaX = btnCenterX - clientX;
    const deltaY = btnCenterY - clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const avoidanceRadius = 120; 
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        const forceMult = 160; 
        
        let moveX = (deltaX / distance) * force * forceMult;
        let moveY = (deltaY / distance) * force * forceMult;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        const padding = 30;
        if (newLeft < padding) newLeft = padding;
        if (newLeft > window.innerWidth - btnRect.width - padding) {
            newLeft = window.innerWidth - btnRect.width - padding;
        }
        if (newTop < padding) newTop = padding;
        if (newTop > window.innerHeight - btnRect.height - padding) {
            newTop = window.innerHeight - btnRect.height - padding;
        }
        
        noBtn.style.left = newLeft + 'px';
        noBtn.style.top = newTop + 'px';
    }
}

window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });


// --- 3단계 입력 검증 ---
const dateSubmitBtn = document.getElementById('dateSubmitBtn');
if (dateSubmitBtn) {
    dateSubmitBtn.addEventListener('click', function() {
        const date = document.getElementById('dateInput').value;
        const timeSelect = document.getElementById('timeInput');
        const timeText = timeSelect.options[timeSelect.selectedIndex].text; // 사용자가 선택한 이쁜 텍스트 통째로 가져오기

        if(!date || !timeSelect.value) {
            alert("날짜와 시간을 모두 골라줘! ⏰");
            return;
        }
        
        // 최종 화면에 보여줄 텍스트 임시 저장
        timeSelect.dataset.displayText = timeText;
        nextStep(3, 4);
    });
}


// --- 4단계 음식 고르기 ---
const foodItems = document.querySelectorAll('.food-item');
foodItems.forEach(item => {
    item.addEventListener('click', function() {
        foodItems.forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        selectedFoodName = this.getAttribute('data-food');
    });
});

const foodSubmitBtn = document.getElementById('foodSubmitBtn');
if (foodSubmitBtn) {
    foodSubmitBtn.addEventListener('click', function() {
        if(!selectedFoodName) {
            alert("땡기는 음식을 하나 골라줘! 😋");
            return;
        }

        const dateValue = document.getElementById('dateInput').value;
        const timeSelect = document.getElementById('timeInput');
        
        // 3단계에서 저장해둔 깔끔한 시간 텍스트 반영 (ex: 오후 06:30)
        const displayTime = timeSelect.dataset.displayText || timeSelect.value; 

        document.getElementById('finalTime').innerText = displayTime;
        document.getElementById('finalDate').innerText = dateValue;
        document.getElementById('finalFood').innerText = selectedFoodName;

        nextStep(4, 5);
    });
}
