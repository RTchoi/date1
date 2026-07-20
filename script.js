let selectedFoodName = "";

function nextStep(currentStep, nextStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + nextStep).classList.add('active');
}

// --- 1단계 버튼 제어 ---
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// YES 버튼은 클릭 시 군더더기 없이 바로 2단계로 고정 이동
yesBtn.addEventListener('click', function() {
    nextStep(1, 2);
});

let isFirstMove = true; 

function handleNoButtonMove(clientX, clientY) {
    const btnRect = noBtn.getBoundingClientRect();
    
    // ★ [핵심 보완] NO 버튼이 처음 도망갈 때, YES 버튼의 레이아웃 위치를 건드리지 않도록
    // 오직 NO 버튼의 스타일만 fixed로 분리하여 튕겨 나가게 만듭니다.
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
    
    const avoidanceRadius = 120; // 마우스 감지 반경
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        const forceMult = 160; // 도망치는 힘의 세기
        
        let moveX = (deltaX / distance) * force * forceMult;
        let moveY = (deltaY / distance) * force * forceMult;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        // 화면 전체 화면 이탈 방지
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

// 마우스 및 터치 이벤트 리스너
window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

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
