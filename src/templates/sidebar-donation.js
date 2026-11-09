/**
 * Sidebar PayPal Donation Widget
 * Base URL: https://paypal.me/scotbirchfield/
 * Options: $5, $10, $20, and custom amount
 */
function renderSidebarDonationWidget() {
  return `
          <!-- PayPal Donation Sidebar Card -->
          <div class="sidebar-widget sidebar-donate-widget">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="display:inline-flex; align-items:center; color:#0070ba;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.45a.8.8 0 0 1 .79-.675h7.672c3.54 0 6.096 1.768 5.62 5.372-.437 3.32-2.73 5.09-5.748 5.09H9.983l-1.07 6.452a.8.8 0 0 1-.79.674l-1.047-.026z" fill="#003087"/>
                    <path d="M9.13 15.688l1.196-7.575a.8.8 0 0 1 .79-.675h5.176c2.81 0 4.887 1.405 4.51 4.27-.373 2.825-2.327 4.33-4.896 4.33H11.75l-.946 5.682a.8.8 0 0 1-.79.674H6.386a.64.64 0 0 1-.632-.74l1.378-8.291L9.13 15.688z" fill="#0079C1"/>
                  </svg>
                </span>
                <strong style="font-size:0.875rem; color:var(--text-main);">Support StaticStack</strong>
              </div>
              <span style="font-size:0.65rem; font-weight:700; color:#0070ba; background:rgba(0,112,186,0.1); padding:2px 6px; border-radius:10px; letter-spacing:0.03em;">DONATE</span>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.45; margin-bottom:0.75rem;">
              Help keep this catalog free, independent, and actively maintained.
            </p>

            <div class="sidebar-donate-amounts" style="display:grid; grid-template-columns: repeat(3, 1fr) 1.25fr; gap:0.4rem; margin-bottom:0.75rem;">
              <button type="button" class="sidebar-donate-btn" data-amt="5" onclick="setSidebarDonation(this, 5)">$5</button>
              <button type="button" class="sidebar-donate-btn active" data-amt="10" onclick="setSidebarDonation(this, 10)">$10</button>
              <button type="button" class="sidebar-donate-btn" data-amt="20" onclick="setSidebarDonation(this, 20)">$20</button>
              <div style="position:relative; display:flex; align-items:center;">
                <span style="position:absolute; left:0.45rem; font-size:0.75rem; color:var(--text-muted); font-weight:700; pointer-events:none;">$</span>
                <input type="number" class="sidebar-donate-custom" placeholder="Other" min="1" step="1" oninput="setSidebarDonationCustom(this)" style="width:100%; height:100%; min-height:34px; padding:0.25rem 0.35rem 0.25rem 1.15rem; font-size:0.8rem; font-weight:600; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-body); color:var(--text-main); outline:none;">
              </div>
            </div>

            <a class="sidebar-donate-submit" href="https://paypal.me/scotbirchfield/10" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:0.45rem; width:100%; padding:0.55rem 0.85rem; background:linear-gradient(180deg, #ffc439 0%, #f4b628 100%); color:#111827; border:1px solid #e0a316; border-radius:8px; font-size:0.85rem; font-weight:700; text-decoration:none; cursor:pointer; box-shadow:0 2px 8px rgba(245,158,11,0.2); transition:all 0.15s ease;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.45a.8.8 0 0 1 .79-.675h7.672c3.54 0 6.096 1.768 5.62 5.372-.437 3.32-2.73 5.09-5.748 5.09H9.983l-1.07 6.452a.8.8 0 0 1-.79.674l-1.047-.026z"/>
              </svg>
              <span class="sidebar-donate-btn-label">Donate $10 with PayPal</span>
            </a>

            <div style="font-size:0.7rem; color:var(--text-muted); display:flex; align-items:center; justify-content:center; gap:0.3rem; margin-top:0.55rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Secure checkout on PayPal &bull; Cards accepted</span>
            </div>

            <script>
              if (typeof window.setSidebarDonation !== 'function') {
                window.setSidebarDonation = function(btnEl, amt) {
                  var widget = btnEl.closest('.sidebar-donate-widget');
                  if (!widget) return;
                  var customInput = widget.querySelector('.sidebar-donate-custom');
                  if (customInput) customInput.value = '';
                  var buttons = widget.querySelectorAll('.sidebar-donate-btn');
                  for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                  }
                  btnEl.classList.add('active');
                  var submitBtn = widget.querySelector('.sidebar-donate-submit');
                  var labelEl = widget.querySelector('.sidebar-donate-btn-label');
                  var targetUrl = 'https://paypal.me/scotbirchfield/' + amt;
                  if (submitBtn) submitBtn.href = targetUrl;
                  if (labelEl) labelEl.textContent = 'Donate $' + amt + ' with PayPal';
                };
              }

              if (typeof window.setSidebarDonationCustom !== 'function') {
                window.setSidebarDonationCustom = function(inputEl) {
                  var widget = inputEl.closest('.sidebar-donate-widget');
                  if (!widget) return;
                  var buttons = widget.querySelectorAll('.sidebar-donate-btn');
                  for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                  }
                  var val = inputEl.value ? parseInt(inputEl.value, 10) : 0;
                  var submitBtn = widget.querySelector('.sidebar-donate-submit');
                  var labelEl = widget.querySelector('.sidebar-donate-btn-label');
                  if (!isNaN(val) && val > 0) {
                    var targetUrl = 'https://paypal.me/scotbirchfield/' + val;
                    if (submitBtn) submitBtn.href = targetUrl;
                    if (labelEl) labelEl.textContent = 'Donate $' + val + ' with PayPal';
                  } else {
                    var targetUrl = 'https://paypal.me/scotbirchfield/';
                    if (submitBtn) submitBtn.href = targetUrl;
                    if (labelEl) labelEl.textContent = 'Donate with PayPal';
                  }
                };
              }
            </script>
          </div>
`;
}

module.exports = {
  renderSidebarDonationWidget
};

