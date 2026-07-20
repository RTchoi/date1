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
    // 1단계 카드가 활성화 상태일 때만 이탈 연산 수행
    if (!step1Card.classList.contains('active')) return;

    const btnRect = noBtn.getBoundingClientRect();
    
    // ★ [오류 해결의 핵심] 첫 감지 시 박스 찌그러짐 원천 차단
    if (isFirstMove) {
        // 1. 버튼이 날아가기 직전의 하얀색 카드 박스 실제 높이를 측정하여 그대로 고정합니다.
        const cardRect = step1Card.getBoundingClientRect();
        step1Card.style.minHeight = cardRect.height + 'px';

        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();

        // 2. YES 버튼 처음 위치 그대로 화면에 박아버리기
        yesBtn.style.position = 'fixed';
        yesBtn.style.left = yesRect.left + 'px';
        yesBtn.style.top = yesRect.top + 'px';
        yesBtn.style.margin = '0';

        // 3. NO 버튼도 독립 레이아웃으로 변경
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
    
    const avoidanceRadius = 120; // 마우스 접근 감지 거리
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        const forceMult = 160; 
        
        let moveX = (deltaX / distance) * force * forceMult;
        let moveY = (deltaY / distance) * force * forceMult;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        // PC 브라우저 화면 테두리 밖으로 이탈 방지
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

// 이벤트 리스너 등록
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
