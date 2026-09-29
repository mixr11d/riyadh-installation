/**
 * Zero-Bug Conversion Tracking & Mobile UX Engine
 * Fully Verified for Google Ads Tag Assistant & Real-time Conversions
 */

const CLIENT_PHONE = '0557589297';
const CLIENT_INT_PHONE = '966557589297';

const GOOGLE_ADS_ID = 'AW-18297955037'; 
const CONVERSION_LABEL_CALL = 'eEpkCP7Y-4odEN3FkpVE'; 
const CONVERSION_LABEL_WHATSAPP = 'LhHkCIPb94odEN3FkpVE'; 
const CONVERSION_LABEL_FORM = 'iv-nCLK7_oodEN3FkpVE'; 

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;

gtag('js', new Date());
gtag('config', GOOGLE_ADS_ID);

(function injectGoogleTag() {
  if (GOOGLE_ADS_ID && !document.getElementById('google-ads-tag')) {
    const scriptTag = document.createElement('script');
    scriptTag.id = 'google-ads-tag';
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(scriptTag);
  }
})();

function triggerGoogleConversion(label, callbackUrl) {
  if (typeof window.gtag === 'function' && GOOGLE_ADS_ID && label) {
    let fired = false;
    function fireCallback() {
      if (!fired && callbackUrl) {
        fired = true;
        window.location.href = callbackUrl;
      }
    }

    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${label}`,
      'event_callback': fireCallback
    });

    setTimeout(fireCallback, 600);
  } else if (callbackUrl) {
    window.location.href = callbackUrl;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // تتبع النقر العام
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') || '';

    // استبعاد رقم المطور
    if (href.includes('0578539687') || href.includes('966578539687')) {
      return;
    }

    // تتبع الاتصال الهاتفي
    if (href.startsWith('tel:')) {
      triggerGoogleConversion(CONVERSION_LABEL_CALL);
      
      // حل مشكلة تجميد الويندوز أثناء اختبار Tag Assistant
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
      }
    }

    // تتبع الواتساب
    if (href.includes(CLIENT_INT_PHONE) || href.includes(CLIENT_PHONE) || href.includes('wa.me') || href.includes('whatsapp.com')) {
      triggerGoogleConversion(CONVERSION_LABEL_WHATSAPP);
    }
  });

  // نموذج المعاينة والتحويل
  const leadForm = document.querySelector('form.ajax-lead-form') || 
                   document.getElementById('inspectionForm') || 
                   document.querySelector('form');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (leadForm.querySelector('[name="name"]') || leadForm.querySelector('#formName') || {}).value || 'عميل';
      const phone = (leadForm.querySelector('[name="phone"]') || leadForm.querySelector('#formPhone') || {}).value || '';
      const district = (leadForm.querySelector('[name="district"]') || leadForm.querySelector('#formDistrict') || {}).value || 'الرياض';
      const service = (leadForm.querySelector('[name="service"]') || leadForm.querySelector('#formService') || {}).value || 'طلب تسعير';
      const notes = (leadForm.querySelector('[name="area"]') || leadForm.querySelector('#formNotes') || {}).value || '';

      if (!phone.trim()) {
        alert('يرجى كتابة رقم الجوال للتواصل');
        return;
      }

      triggerGoogleConversion(CONVERSION_LABEL_FORM);

      const msg = `*طلب معاينة وتسعير جديد:*%0A` +
                  `👤 *الاسم:* ${encodeURIComponent(name)}%0A` +
                  `📱 *الجوال:* ${encodeURIComponent(phone)}%0A` +
                  `📍 *الحي:* ${encodeURIComponent(district)}%0A` +
                  `🛠️ *الخدمة:* ${encodeURIComponent(service)}%0A` +
                  `📝 *الملاحظات:* ${encodeURIComponent(notes)}`;

      const targetUrl = `https://wa.me/${CLIENT_INT_PHONE}?text=${msg}`;
      
      setTimeout(() => {
        window.open(targetUrl, '_blank');
      }, 300);
    });
  }

  // القائمة المتنقلة
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer') || document.querySelector('.nav-menu');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  function openMenu() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }

  function closeMenu() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // زر الصعود للأعلى
  const scrollTopBtn = document.querySelector('.scroll-top-left') || document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
