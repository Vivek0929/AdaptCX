(function () {
  const currentScript = document.currentScript || document.querySelector('script[data-business-id]');
  if (!currentScript) {
    console.error('[AdaptCX] Missing data-business-id attribute on embed script.');
    return;
  }

  const businessId = currentScript.getAttribute('data-business-id');
  const apiBase = currentScript.src ? new URL(currentScript.src).origin + '/api' : 'http://localhost:5000/api';

  // Helper for unique session token
  const getSessionToken = () => {
    let token = localStorage.getItem('adaptcx_session_token');
    if (!token) {
      token = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('adaptcx_session_token', token);
    }
    return token;
  };

  const sessionToken = getSessionToken();

  // Send event helper
  const sendEvent = (eventType, useCaseId = null) => {
    fetch(`${apiBase}/public/${businessId}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_token: sessionToken,
        event_type: eventType,
        use_case_id: useCaseId
      })
    }).catch(err => console.warn('[AdaptCX] Event error:', err));
  };

  // Content swap helper
  const applyPersonalizedContent = (contentMap) => {
    if (!contentMap) return;
    Object.keys(contentMap).forEach(key => {
      const elements = document.querySelectorAll(`[data-adaptcx="${key}"]`);
      elements.forEach(el => {
        el.innerText = contentMap[key];
        el.style.transition = 'opacity 0.2s ease';
        el.style.opacity = '1';
      });
    });
  };

  // Bind CTA click listeners
  const bindCtaListeners = (useCaseId) => {
    const ctaElements = document.querySelectorAll('[data-adaptcx="cta_text"], [data-adaptcx-cta]');
    ctaElements.forEach(cta => {
      cta.addEventListener('click', () => {
        sendEvent('cta_click', useCaseId);
      });
    });
  };

  // Render floating Quiz Banner
  const renderQuizBanner = (siteData) => {
    if (!siteData.use_cases || siteData.use_cases.length === 0) return;

    sendEvent('quiz_shown');

    const overlay = document.createElement('div');
    overlay.id = 'adaptcx-quiz-container';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '20px';
    overlay.style.right = '20px';
    overlay.style.zIndex = '999999';
    overlay.style.maxWidth = '360px';
    overlay.style.width = 'calc(100vw - 40px)';
    overlay.style.backgroundColor = '#ffffff';
    overlay.style.color = '#0f172a';
    overlay.style.padding = '18px';
    overlay.style.borderRadius = '12px';
    overlay.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    overlay.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    overlay.style.border = '1px solid #e2e8f0';
    overlay.style.animation = 'adaptcx-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes adaptcx-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .adaptcx-option-btn {
        display: block;
        width: 100%;
        text-align: left;
        background: #f8fafc;
        color: #334155;
        border: 1px solid #e2e8f0;
        padding: 9px 12px;
        margin-top: 6px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .adaptcx-option-btn:hover {
        background: #4f46e5;
        border-color: #4f46e5;
        color: #ffffff;
      }
      .adaptcx-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 18px;
        cursor: pointer;
      }
      .adaptcx-close-btn:hover { color: #0f172a; }
    `;
    document.head.appendChild(style);

    let optionsHtml = siteData.use_cases
      .map(uc => `<button class="adaptcx-option-btn" data-uc-id="${uc.id}">${uc.label}</button>`)
      .join('');

    overlay.innerHTML = `
      <button class="adaptcx-close-btn" id="adaptcx-close">&times;</button>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; font-weight: 700; margin-bottom: 4px;">Personalize Experience</div>
      <div style="font-size: 14px; font-weight: 600; line-height: 1.35; margin-bottom: 10px; color: #0f172a;">${siteData.quiz_question}</div>
      <div id="adaptcx-options-list">${optionsHtml}</div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('adaptcx-close').addEventListener('click', () => {
      overlay.remove();
    });

    const optionButtons = overlay.querySelectorAll('.adaptcx-option-btn');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const ucId = btn.getAttribute('data-uc-id');
        btn.innerText = 'Personalizing...';
        btn.disabled = true;

        try {
          const res = await fetch(`${apiBase}/public/${businessId}/select-use-case`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              use_case_id: ucId,
              session_token: sessionToken
            })
          });

          const data = await res.json();
          if (data && data.content) {
            localStorage.setItem('adaptcx_use_case_id', ucId);
            applyPersonalizedContent(data.content);
            bindCtaListeners(ucId);
          }

          overlay.innerHTML = `
            <div style="text-align: center; padding: 8px 0;">
              <div style="font-size: 13px; font-weight: 600; color: #4f46e5;">✨ Content personalized for your business!</div>
            </div>
          `;
          setTimeout(() => overlay.remove(), 2500);
        } catch (err) {
          console.error('[AdaptCX] Error selecting use case:', err);
          overlay.remove();
        }
      });
    });
  };

  // Init logic
  const init = async () => {
    try {
      const storedUseCaseId = localStorage.getItem('adaptcx_use_case_id');
      sendEvent('page_view', storedUseCaseId);

      const res = await fetch(`${apiBase}/public/${businessId}/site`);
      if (!res.ok) return;
      const siteData = await res.json();

      if (storedUseCaseId) {
        // Returning visitor: Fetch tailored variant directly
        try {
          const selectRes = await fetch(`${apiBase}/public/${businessId}/select-use-case`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              use_case_id: storedUseCaseId,
              session_token: sessionToken
            })
          });
          const selectData = await selectRes.json();
          if (selectData && selectData.content) {
            applyPersonalizedContent(selectData.content);
            bindCtaListeners(storedUseCaseId);
            return;
          }
        } catch (err) {
          console.warn('[AdaptCX] Auto-restore variant error:', err);
        }
      }

      // First time visitor: Apply baseline & show quiz
      if (siteData.baseline_blocks) {
        applyPersonalizedContent(siteData.baseline_blocks);
        bindCtaListeners(null);
      }
      renderQuizBanner(siteData);
    } catch (err) {
      console.error('[AdaptCX] Initialization failed:', err);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
