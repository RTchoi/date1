let selectedFoodName = "";

function nextStep(currentStep, nextStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + nextStep).classList.add('active');
}

// --- 1단계 버튼 제어 ---
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// YES 버튼은 언제 눌러도 바로 2단계로 이동
yesBtn.addEventListener('click', function() {
    nextStep(1, 2);
});

let isFirstMove = true; 

function handleNoButtonMove(clientX, clientY) {
    // ★ [핵심 추가] 마우스가 처음 다가왔을 때, 두 버튼의 '현재 위치'를 그대로 고정시킵니다.
    if (isFirstMove) {
        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();

        // 1. YES 버튼을 원래 있던 그 위치(좌표) 그대로 fixed로 고정시켜 버립니다.
        // 이렇게 하면 NO 버튼이 이탈해도 YES 버튼이 중앙으로 쏠리지 않고 제자리에 멈춰있습니다.
        yesBtn.style.position = 'fixed';
        yesBtn.style.left = yesRect.left + 'px';
        yesBtn.style.top = yesRect.top + 'px';
        yesBtn.style.margin = '0';

        // 2. NO 버튼도 원래 있던 위치에서 자연스럽게 출발하도록 고정합니다.
        noBtn.style.position = 'fixed';
        noBtn.style.left = noRect.left + 'px';
        noBtn.style.top = noRect.top + 'px';
        noBtn.style.margin = '0';

        isFirstMove = false;
        return; // 첫 감지 때는 위치 스타일만 고정하고, 다음 움직임부터 본격적으로 도망칩니다.
    }

    const btnRect = noBtn.getBoundingClientRect();
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
        
        // 화면 이탈 방지 펜스
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

// 마우스 및 터치 이벤트 리스너 (기존과 동일)
window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

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
