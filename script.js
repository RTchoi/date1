let selectedFoodName = "";

function nextStep(currentStep, nextStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + nextStep).classList.add('active');
}

// --- 1단계 버튼 제어 ---
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

yesBtn.addEventListener('click', function() {
    nextStep(1, 2);
});

let isFirstMove = true; 

function handleNoButtonMove(clientX, clientY) {
    const btnRect = noBtn.getBoundingClientRect();
    
    // ★ [PC 보완] 마우스가 처음 닿을 때, 그 중앙에 정렬되어 있던 실시간 위치 좌표를 그대로 계승합니다.
    if (isFirstMove) {
        noBtn.style.position = 'fixed';
        noBtn.style.left = btnRect.left + 'px';
        noBtn.style.top = btnRect.top + 'px';
        isFirstMove = false;
        return; 
    }

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const deltaX = btnCenterX - clientX;
    const deltaY = btnCenterY - clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // PC 화면을 고려해 감지 반경을 기존보다 살짝 넓혔습니다. (120px)
    const avoidanceRadius = 120; 
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        // 도망치는 힘의 세기 조정
        const forceMult = 160; 
        
        let moveX = (deltaX / distance) * force * forceMult;
        let moveY = (deltaY / distance) * force * forceMult;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        // 거대한 PC 브라우저 모니터 화면 전체를 기준으로 밖으로 안 나가게 제한
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

// PC 환경용 마우스 이벤트 연결
window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

// 모바일 하이브리드 지원용 터치 이벤트 연결
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
        const time = document.getElementById('timeInput').value;

        if(!date || !time) {
            alert("날짜와 시간을 모두 골라줘! ⏰");
            return;
        }
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
        const timeValue = document.getElementById('timeInput').value;

        const hour = timeValue.split(':')[0];
        const displayHour = hour > 12 ? `오후 ${hour - 12}시` : `오전 ${hour}시`;

        document.getElementById('finalTime').innerText = displayHour;
        document.getElementById('finalDate').innerText = dateValue;
        document.getElementById('finalFood').innerText = selectedFoodName;

        nextStep(4, 5);
    });
}
