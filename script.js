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

// [추가] 처음 도망치기 시작할 때 포지션을 전환하기 위한 변수
let isFirstMove = true; 

function handleNoButtonMove(clientX, clientY) {
    const btnRect = noBtn.getBoundingClientRect();
    
    // ★ [핵심 추가] 처음 마우스가 다가왔을 때, 현재 중앙에 있던 그 위치 그대로 fixed 좌표로 고정합니다.
    // 이렇게 해야 포지션이 변할 때 버튼이 엉뚱한 곳으로 튀지 않고 그 자리에서 자연스럽게 도망을 시작합니다.
    if (isFirstMove) {
        noBtn.style.position = 'fixed';
        noBtn.style.left = btnRect.left + 'px';
        noBtn.style.top = btnRect.top + 'px';
        isFirstMove = false;
        return; // 첫 감지 때는 위치 스타일만 변환하고 다음 움직임부터 본격적으로 밀어냅니다.
    }

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const deltaX = btnCenterX - clientX;
    const deltaY = btnCenterY - clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const avoidanceRadius = 100; // 감지 반경
    
    if (distance < avoidanceRadius) {
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        const forceMult = 150; // 밀쳐내는 세기
        
        let moveX = (deltaX / distance) * force * forceMult;
        let moveY = (deltaY / distance) * force * forceMult;
        
        let newLeft = btnRect.left + moveX;
        let newTop = btnRect.top + moveY;
        
        // 화면 밖 탈출 방지
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

// 마우스 및 터치 이벤트 연결 (기존과 동일)
window.addEventListener('mousemove', function(e) {
    handleNoButtonMove(e.clientX, e.clientY);
});

window.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

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
