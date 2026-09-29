/**
 * script.js - Universal Lead & Event Engine
 * 100% Script-Only Tracking Architecture (Google Ads AW-18297955037)
 * Zero tracking tags in HTML. Centralized delegate listener.
 */

(function () {
  'use strict';

  // 1. مسح الكاش والـ Service Worker القديم لضمان قراءة أحدث نسخة من الجوال
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then(function (names) {
      for (let name of names) {
        caches.delete(name);
      }
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

  // حقن مكتبة Google Tag Manager
  function initGoogleTag() {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
  }

  // إرسال الإحالة بأمان مع Callback مضمون
  function triggerConversion(label, callback) {
    if (typeof window.gtag === 'function') {
      let fired = false;
      const done = function () {
        if (!fired) {
          fired = true;
          if (callback) callback();
        }
      };
      const timer = setTimeout(done, 500); // مهلة احتياطية لنصف ثانية

      window.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${label}`,
        event_callback: function () {
          clearTimeout(timer);
          done();
        }
      });
    } else if (callback) {
      callback();
    }
  }

  // استبعاد نقرات المطور
  function isDevLink(href) {
    if (!href) return false;
    const clean = href.replace(/[^\d]/g, '');
    return clean.includes(DEV_PHONE_CLEAN) || clean.includes('0578539687');
  }

  initGoogleTag();

  // 3. تتبع النقرات العام لجميع الصفحات
  document.addEventListener('click', function (e) {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;

    const href = targetLink.getAttribute('href') || '';

    // تجاهل روابط المطور
    if (isDevLink(href)) {
      return;
    }

    // تتبع الاتصال مع تأمين الإرسال
    if (href.startsWith('tel:')) {
      e.preventDefault();
      triggerConversion(CONVERSION_LABEL_CALL, function () {
        window.location.href = href;
      });
    }

    // تتبع الواتساب مع تأمين الإرسال
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      // إذا كان الرابط يفتح في صفحة جديدة اتركه يفتح ويرسل في الخلفية
      if (targetLink.target === '_blank') {
        triggerConversion(CONVERSION_LABEL_WHATSAPP);
      } else {
        e.preventDefault();
        triggerConversion(CONVERSION_LABEL_WHATSAPP, function () {
          window.location.href = href;
        });
      }
    }
  }, true);

  // 4. معالج نموذج المعاينة
  document.addEventListener('submit', function (e) {
    const form = e.target.closest('.ajax-lead-form');
    if (!form) return;

    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || 'عميل';
    const phone = form.querySelector('[name="phone"]')?.value || 'غير محدد';
    const service = form.querySelector('[name="service"]')?.value || 'استفسار عام';
    const area = form.querySelector('[name="area"]')?.value || '';
    const district = form.querySelector('[name="district"]')?.value || 'الرياض';

    let messageText = `مرحباً مؤسسة الرياض، أود الاستفسار وطلب تسعيرة:%0A` +
      `👤 الاسم: ${encodeURIComponent(name)}%0A` +
      `📱 الجوال: ${encodeURIComponent(phone)}%0A` +
      `🛠 الخدمة: ${encodeURIComponent(service)}%0A` +
      `📍 الحي: ${encodeURIComponent(district)}`;

    if (area) {
      messageText += `%0A📐 المساحة التقريبية: ${encodeURIComponent(area)} م²`;
    }

    const waUrl = `https://wa.me/${CLIENT_PHONE_CLEAN}?text=${messageText}`;

    // إرسال إحالة النموذج ثم التوجيه للواتساب
    triggerConversion(CONVERSION_LABEL_FORM, function () {
      window.location.href = waUrl;
    });
  });

  // 5. القائمة الجانبية وزر الصعود للأعلى
  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.drawer-close');
    const scrollTopBtn = document.querySelector('.scroll-top-left');

    function openDrawer() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    if (drawer) {
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeDrawer);
      });
    }

    if (scrollTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 350) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      });

      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  });
})();
