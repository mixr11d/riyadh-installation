/**
 * Universal Precision Google Ads Tracking & Conversion Engine
 * Fully Compatible with Google Tag Assistant & Production Live Traffic
 */

(function () {
  'use strict';

  // 1. مسح الكاش القديم من جوال الزائر لضمان عمل أحدث تعديلات
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (r) { r.unregister(); });
    });
  }
  if ('caches' in window) {
    caches.keys().then(function (names) {
      names.forEach(function (name) { caches.delete(name); });
    });
  }

  // 2. إعدادات حساب إعلانات جوجل
  const GOOGLE_ADS_ID = 'AW-18297955037';
  const CONVERSION_LABEL_CALL = 'eEpkCP7Y-4odEN3FkpVE';
  const CONVERSION_LABEL_WHATSAPP = 'LhHkCIPb94odEN3FkpVE';
  const CONVERSION_LABEL_FORM = 'iv-nCLK7_oodEN3FkpVE';

  // أرقام العميل والمطور
  const CLIENT_PHONE_CLEAN = '966557589297';
  const DEV_PHONE_CLEAN = '966578539687';

  // 3. تهيئة وحقن وسم Google Tag فوراً في أعلى الصفحة
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GOOGLE_ADS_ID);

  if (!document.getElementById('google-ads-tag')) {
    const script = document.createElement('script');
    script.id = 'google-ads-tag';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
    document.head.appendChild(script);
  }

  // 4. الدالة الفورية لإرسال الإحالة بدون أي تعطيل
  function sendConversion(label) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': GOOGLE_ADS_ID + '/' + label,
        'value': 1.0,
        'currency': 'SAR'
      });
      console.log('✅ Conversion Fired Successfully:', label);
    }
  }

  // التحقق من استبعاد رقم المطور
  function isDeveloperContact(url) {
    if (!url) return false;
    const cleanUrl = url.replace(/[^\d]/g, '');
    return cleanUrl.includes(DEV_PHONE_CLEAN) || cleanUrl.includes('0578539687');
  }

  // 5. صائد النقرات الفوري (Instant Global Click Tracker)
  // يلقط النقرة في اللحظة الأولى للضغط قبل أي انتقال
  document.addEventListener('pointerdown', handleUserInteraction, true);
  document.addEventListener('click', handleUserInteraction, true);

  let lastClickTime = 0;
  function handleUserInteraction(e) {
    // منع تكرار الإحالة لنفس الضغطة في أقل من 700 جزء من الثانية
    const now = Date.now();
    if (now - lastClickTime < 700) return;

    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (isDeveloperContact(href)) return;

    // رصد أي رابط اتصال tel: في أي مكان بالصفحة
    if (href.startsWith('tel:')) {
      lastClickTime = now;
      sendConversion(CONVERSION_LABEL_CALL);
    }

    // رصد أي رابط واتساب في أي مكان بالصفحة
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      lastClickTime = now;
      sendConversion(CONVERSION_LABEL_WHATSAPP);
    }
  }

  // 6. تتبع نموذج المعاينة والطلب فور الإرسال
  document.addEventListener('submit', function (e) {
    const form = e.target.closest('form');
    if (!form) return;

    // استثناء نماذج البحث العامة إن وجدت
    if (form.getAttribute('role') === 'search') return;

    // إرسال إحالة النموذج إلى جوجل فوراً
    sendConversion(CONVERSION_LABEL_FORM);

    // إذا كان النموذج هو نموذج طلب الأسعار المعتاد، نجهّز رسالة الواتساب
    if (form.classList.contains('ajax-lead-form') || form.id === 'inspectionForm') {
      e.preventDefault();

      const name = (form.querySelector('[name="name"]') || form.querySelector('#formName') || {}).value || 'عميل';
      const phone = (form.querySelector('[name="phone"]') || form.querySelector('#formPhone') || {}).value || 'غير محدد';
      const service = (form.querySelector('[name="service"]') || form.querySelector('#formService') || {}).value || 'طلب تسعير';
      const district = (form.querySelector('[name="district"]') || form.querySelector('#formDistrict') || {}).value || 'الرياض';
      const area = (form.querySelector('[name="area"]') || form.querySelector('#formNotes') || {}).value || '';

      let messageText = 'مرحباً مؤسسة الرياض، أود الاستفسار وطلب تسعيرة:%0A' +
        '👤 الاسم: ' + encodeURIComponent(name) + '%0A' +
        '📱 الجوال: ' + encodeURIComponent(phone) + '%0A' +
        '🛠 الخدمة: ' + encodeURIComponent(service) + '%0A' +
        '📍 الحي: ' + encodeURIComponent(district);

      if (area) {
        messageText += '%0A📝 الملاحظات/المساحة: ' + encodeURIComponent(area);
      }

      const waUrl = 'https://wa.me/' + CLIENT_PHONE_CLEAN + '?text=' + messageText;

      setTimeout(function () {
        window.location.href = waUrl;
      }, 300);
    }
  }, true);

  // 7. تحسينات القائمة وواجهة المستخدم
  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer') || document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.drawer-close');

    function toggleMenu() {
      if (drawer) drawer.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
  });

})();
