/**
 * script.js - Universal Lead & Event Engine
 * 100% Script-Only Tracking Architecture (Google Ads AW-XXXXXXXXXXX)
 * Zero tracking tags in HTML. Centralized delegate listener.
 */

(function () {
  'use strict';

  // 1. Google Ads Configuration
  const GOOGLE_ADS_ID = 'AW-XXXXXXXXXXX';
  const CONVERSION_LABEL_CALL = 'XXXXXXXXXXXXXXXXXX';
  const CONVERSION_LABEL_WHATSAPP = 'XXXXXXXXXXXXXXXXXX';
  const CONVERSION_LABEL_FORM = 'XXXXXXXXXXXXXXXXXX';

  // Verified Client & Developer Phones
  const CLIENT_PHONE_CLEAN = '966557589297';
  const DEV_PHONE_CLEAN = '966578539687';

  // Dynamic injection of Google Tag Manager / gtag.js
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

  // Trigger Google Conversion safely
  function triggerConversion(label, callback) {
    if (typeof window.gtag === 'function') {
      let fired = false;
      const done = function () {
        if (!fired) {
          fired = true;
          if (callback) callback();
        }
      };
      // Fallback timer if gtag takes too long
      const timer = setTimeout(done, 500);

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

  // Check if target link belongs to the developer
  function isDevLink(href) {
    if (!href) return false;
    const clean = href.replace(/[^\d]/g, '');
    return clean.includes(DEV_PHONE_CLEAN) || clean.includes('0578539687');
  }

  // Initialize
  initGoogleTag();

  // 2. Universal Delegated Click Listener (Capture Phase)
  document.addEventListener('click', function (e) {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;

    const href = targetLink.getAttribute('href') || '';

    // Ignore developer contact links from tracking
    if (isDevLink(href)) {
      return;
    }

    // Call tracking
    if (href.startsWith('tel:')) {
      triggerConversion(CONVERSION_LABEL_CALL);
    }

    // WhatsApp tracking
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      triggerConversion(CONVERSION_LABEL_WHATSAPP);
    }
  }, true);

  // 3. Lead Form Handler & Calculation
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

    // Trigger Form Conversion then redirect
    triggerConversion(CONVERSION_LABEL_FORM, function () {
      window.location.href = waUrl;
    });
  });

  // 4. Mobile Menu Toggle
  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', function () {
        drawer.classList.toggle('open');
      });

      // Close when clicking any nav item inside
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          drawer.classList.remove('open');
        });
      });
    }

    // Register Service Worker if present
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    }
  });
})();
