// --- 1. 기본 설정 및 전역 변수 ---
let selectedFoodName = "";

// 화면 전환 기능 함수
function nextStep(currentStep, nextStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + nextStep).classList.add('active');
}

// --- 2. 1단계: YES / NO 버튼 이벤트 처리 ---
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// YES 누르면 2단계로 이동
yesBtn.addEventListener('click', function() {
    nextStep(1, 2);
});

// NO 버튼을 마우스/터치 좌표 기준으로 자석처럼 밀어내는 로직
function handleNoButtonMove(clientX, clientY) {
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const deltaX = btnCenterX - clientX;
    const deltaY = btnCenterY - clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const avoidanceRadius = 80; // 마우스 접근 감지 반경 (px)
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        
        // 반대 방향 밀쳐내기 (숫자 80을 조절하면 튕겨 나가는 세기가 변함)
        let moveX = (deltaX / distance) * force * 80;
        let moveY = (deltaY / distance) * force * 80;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        // 화면 밖 탈출 방지 펜스
        const padding = 20;
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

// PC 화면 전체 마우스 움직임 감지
window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

// 모바일 터치 드래그 움직임 감지
window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });


// --- 3. 3단계: 날짜 및 시간 입력 검증 ---
const dateSubmitBtn = document.getElementById('dateSubmitBtn');
dateSubmitBtn.addEventListener('click', function() {
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;

    if(!date || !time) {
        alert("날짜와 시간을 모두 골라줘! ⏰");
        return;
    }
    nextStep(3, 4);
});


// --- 4. 4단계: 음식 선택 처리 ---
const foodItems = document.querySelectorAll('.food-item');
foodItems.forEach(item => {
    item.addEventListener('click', function() {
        // 기존 선택 하이라이트 지우기
        foodItems.forEach(i => i.classList.remove('selected'));
        // 지금 누른 것만 선택 효과
        this.classList.add('selected');
        selectedFoodName = this.getAttribute('data-food');
    });
});

// 음식 선택 완료 버튼 누를 때 최종 화면 데이터 바인딩
const foodSubmitBtn = document.getElementById('foodSubmitBtn');
foodSubmitBtn.addEventListener('click', function() {
    if(!selectedFoodName) {
        alert("땡기는 음식을 하나 골라줘! 😋");
        return;
    }

    const dateValue = document.getElementById('dateInput').value;
    const timeValue = document.getElementById('timeInput').value;

    // 시간 포맷 예쁘게 다듬기 (예: 18:00 -> 오후 6시)
    const hour = timeValue.split(':')[0];
    const displayHour = hour > 12 ? `오후 ${hour - 12}시` : `오전 ${hour}시`;

    // 5단계 최종 페이지 글자 변경
    document.getElementById('finalTime').innerText = displayHour;
    document.getElementById('finalDate').innerText = dateValue;
    document.getElementById('finalFood').innerText = selectedFoodName;

    nextStep(4, 5);
});
