// ★ [EmailJS 설정 값 입력] 본인의 정보로 채워주세요
const EMAILJS_PUBLIC_KEY = "m-Z9GybMe0U0m-dr5"; 
const EMAILJS_SERVICE_ID = "service_awiflcx";
const EMAILJS_TEMPLATE_ID = "template_lda67yh";

// SDK 초기화
emailjs.init(EMAILJS_PUBLIC_KEY);

let selectedFoodName = "";

// 단계 이동 함수 (HTML의 onclick에서도 찾을 수 있도록 전역 배치)
function nextStep(currentStep, nextStepNum) {
    const currentCard = document.getElementById('step' + currentStep);
    const nextCard = document.getElementById('step' + nextStepNum);
    
    if (currentCard) currentCard.classList.remove('active');
    if (nextCard) nextCard.classList.add('active');
}

// HTML의 모든 요소들이 브라우저에 완전히 로드된 후 안전하게 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1단계 버튼 제어 ---
    const step1Card = document.getElementById('step1');
    const btn-yes = document.getElementById('btn-yes');
    const btn-no = document.getElementById('btn-no');
    
    let isFirstMove = true; 

    // YES 버튼 클릭 시 2단계로 부드럽게 이동
    if (btn-yes) {
        btn-yes.addEventListener('click', function() {
            nextStep(1, 2);
        });
    }

    // NO 버튼 회피 로직
    function handleNoButtonMove(clientX, clientY) {
        if (!step1Card || !noBtn || !yesBtn) return;
        if (!step1Card.classList.contains('active')) return;

        const btnRect = btn-no.getBoundingClientRect();
        
        if (isFirstMove) {
            const cardRect = step1Card.getBoundingClientRect();
            step1Card.style.minHeight = cardRect.height + 'px';

            const yesRect = btn-yes.getBoundingClientRect();
            const noRect = btn-no.getBoundingClientRect();

            btn-yes.style.position = 'fixed';
            btn-yes.style.left = yesRect.left + 'px';
            btn-yes.style.top = yesRect.top + 'px';
            btn-yes.style.margin = '0';

            btn-no.style.position = 'fixed';
            btn-no.style.left = noRect.left + 'px';
            btn-no.style.top = noRect.top + 'px';
            btn-no.style.margin = '0';

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
            
            btn-no.style.left = newLeft + 'px';
            btn-no.style.top = newTop + 'px';
        }
    }

    // 마우스 및 터치 이벤트 연결
    window.addEventListener('mousemove', function(e) {
        handleNoButtonMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            handleNoButtonMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });


    // --- 3단계 입력 검증 (날짜/시간 선택 완료) ---
    const dateSubmitBtn = document.getElementById('dateSubmitBtn');
    if (dateSubmitBtn) {
        dateSubmitBtn.addEventListener('click', function() {
            const dateInput = document.getElementById('dateInput');
            const timeSelect = document.getElementById('timeInput');
            
            if (!dateInput || !timeSelect) return;
            
            const date = dateInput.value;
            const timeText = timeSelect.options[timeSelect.selectedIndex].text;

            if(!date || !timeSelect.value) {
                alert("날짜와 시간을 모두 골라줘! ⏰");
                return;
            }
            
            timeSelect.dataset.displayText = timeText;
            nextStep(3, 4);
        });
    }


    // --- 4단계 음식 고르기 & 이메일 전송 ---
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

            const dateInput = document.getElementById('dateInput');
            const timeSelect = document.getElementById('timeInput');
            
            if (!dateInput || !timeSelect) return;

            const dateValue = dateInput.value;
            const displayTime = timeSelect.dataset.displayText || timeSelect.value; 

            // 5단계 결과창 텍스트 바인딩
            const finalTimeEl = document.getElementById('finalTime');
            const finalDateEl = document.getElementById('finalDate');
            const finalFoodEl = document.getElementById('finalFood');
            
            if (finalTimeEl) finalTimeEl.innerText = displayTime;
            if (finalDateEl) finalDateEl.innerText = dateValue;
            if (finalFoodEl) finalFoodEl.innerText = selectedFoodName;

            // 5단계 결과창으로 카드 전환
            nextStep(4, 5);

            // EmailJS로 결과 발송
            const templateParams = {
                finalDate: dateValue,
                finalTime: displayTime,
                finalFood: selectedFoodName
            };

            const statusDiv = document.getElementById('emailStatus');

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('이메일 전송 성공!', response.status, response.text);
                    if (statusDiv) {
                        statusDiv.innerText = "성공적으로 내 이메일로 발송 완료! 📬";
                        statusDiv.style.color = "#4a2c3a";
                    }
                }, function(error) {
                    console.error('이메일 전송 실패...', error);
                    if (statusDiv) {
                        statusDiv.innerText = "이메일 전송에 실패했습니다. 코드를 다시 확인해 주세요. 😢";
                        statusDiv.style.color = "#ff4d4d";
                    }
                });
        });
    }
});
