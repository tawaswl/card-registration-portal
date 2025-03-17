// متغيرات النظام
let currentDomain = localStorage.getItem('customDomain') || 'http://t.com';
let countdown = 30; // تم تغيير العداد إلى 30 ثانية
const timerElement = document.getElementById('timer');
const realTimeElement = document.getElementById('realTime');
const batteryIcon = document.getElementById('batteryIcon');

// إعدادات المظهر
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

// حفظ الألوان المخصصة
const customColors = JSON.parse(localStorage.getItem('customColors')) || {
    primary: '#2563eb',
    accent: '#10b981'
};

// تطبيق الألوان المخصصة
function applyCustomColors() {
    document.documentElement.style.setProperty('--primary', customColors.primary);
    document.documentElement.style.setProperty('--accent', customColors.accent);
}

// نظام التوقيت الدقيق
function updateRealTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Riyadh'
    };
    realTimeElement.textContent = now.toLocaleTimeString('ar-SA', options);
}

// تحديث البطارية (محاكاة)
function updateBattery() {
    navigator.getBattery().then(battery => {
        const batteryLevel = Math.floor(battery.level * 100);
        document.getElementById('battery').textContent = `${batteryLevel}%`;
        // أنيميشن أيقونة البطارية
        batteryIcon.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            batteryIcon.style.animation = '';
        }, 500);
    });
}

// التوجيه التلقائي
const countdownInterval = setInterval(() => {
    countdown--;
    timerElement.textContent = countdown;
    if(countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.href = currentDomain + '?source=mobile_gateway';
    }
}, 1000);

// نظام الوقت الحقيقي
setInterval(() => {
    updateRealTime();
    updateBattery();
}, 1000);

// التبديل بين الإعدادات
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    
    if (settingsPanel.classList.contains('active')) {
        closeSettings();
    } else {
        settingsPanel.classList.add('active');
        overlay.style.display = 'block';
    }
}

function closeSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    settingsPanel.classList.remove('active');
    overlay.style.display = 'none';
}

// تحديث الدومين
function updateDomain() {
    const newDomain = document.getElementById('domainInput').value.trim();
    if(/^(https?:\/\/)[\w-]+\.[\w-]+/i.test(newDomain)) {
        localStorage.setItem('customDomain', newDomain);
        currentDomain = newDomain;
        alert('تم التحديث بنجاح ✓');
        triggerConfetti(); // تشغيل أنيميشن الكونفيتي
        window.location.reload();
    } else {
        alert('رابط غير صحيح! مثال: http://example.com');
    }
}

// تسجيل البطاقة
function redirectToCard() {
    window.open(currentDomain, '_blank');
}

// فتح واتساب
function openWhatsApp() {
    const phoneNumber = "+963987512721";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
}

// فتح البريد الإلكتروني
function openEmail() {
    const email = "tawaswl@outlook.com";
    const mailtoUrl = `mailto:${email}`;
    window.location.href = mailtoUrl;
}

// أنيميشن الكونفيتي
function triggerConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.left = `${Math.random() * 100}%`;
        confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
        confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confettiPiece);
        setTimeout(() => {
            confettiPiece.remove();
        }, 2000);
    }
}

// تبديل الوضع المظلم
function toggleDarkMode(event) {
    const isDark = event.target.checked;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// تحديث الألوان المخصصة
function updateCustomColor(type, color) {
    customColors[type] = color;
    localStorage.setItem('customColors', JSON.stringify(customColors));
    applyCustomColors();
}

// تحديث لوحة الإعدادات
function updateSettingsPanel() {
    const settingsContent = `
        <button class="close-settings" onclick="closeSettings()">
            <i class="material-icons">close</i>
        </button>
        <h3>الإعدادات</h3>
        <div class="theme-switch">
            <label>
                <input type="checkbox" ${theme === 'dark' ? 'checked' : ''} onchange="toggleDarkMode(event)">
                <span class="theme-slider"></span>
            </label>
            <span>الوضع المظلم</span>
        </div>
        <div class="color-picker">
            <span>اللون الرئيسي</span>
            <input type="color" value="${customColors.primary}" 
                   onchange="updateCustomColor('primary', this.value)">
        </div>
        <div class="color-picker">
            <span>لون التأكيد</span>
            <input type="color" value="${customColors.accent}" 
                   onchange="updateCustomColor('accent', this.value)">
        </div>
        <div class="domain-section">
            <input type="text" id="domainInput" placeholder="أدخل الرابط الجديد" value="${currentDomain}">
            <button onclick="updateDomain()">تحديث الرابط</button>
        </div>
    `;
    document.getElementById('settingsPanel').innerHTML = settingsContent;
}

// التشغيل الأولي
window.addEventListener('load', () => {
    updateRealTime();
    updateBattery();
    applyCustomColors();
    updateSettingsPanel();
    document.getElementById('domainInput').value = currentDomain;
});