const { ICONS } = require('../../data/icons');

/**
 * Shared default search bar component (Archive-style pill with icon, clear button, "/" shortcut badge, and Search button).
 */
function renderSearchBar({
  inputId,
  clearId = '',
  clearOnClick = '',
  buttonType = 'button',
  buttonId = '',
  buttonOnClick = '',
  placeholder = 'Search static tools by name, description, keyword...',
  extraClass = 'search-box-pill-compact',
  inputName = '',
  autofocus = false,
  spellcheck = false,
  formAction = '',
  formOnSubmit = ''
}) {
  const tag = formAction ? 'form' : 'div';
  const formAttrs = formAction
    ? ` action="${formAction}" method="GET"${formOnSubmit ? ` onsubmit="${formOnSubmit}"` : ''}`
    : '';
  const nameAttr = inputName ? ` name="${inputName}"` : '';
  const autofocusAttr = autofocus ? ' autofocus' : '';
  const spellcheckAttr = spellcheck === false ? ' spellcheck="false"' : '';
  const clearBtnHtml = clearId
    ? `<button type="button" id="${clearId}"${clearOnClick ? ` onclick="${clearOnClick}"` : ''} style="background:none; border:none; cursor:pointer; color:var(--text-subtle); display:none; align-items:center; justify-content:center; padding:2px; flex-shrink:0;" title="Clear search" aria-label="Clear search">
            ${ICONS.close}
          </button>`
    : '';
  const btnAttrs = `${buttonId ? ` id="${buttonId}"` : ''}${buttonOnClick ? ` onclick="${buttonOnClick}"` : ''}`;

  return `<${tag}${formAttrs} class="search-box-pill ${extraClass}">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text"${nameAttr} id="${inputId}" placeholder="${placeholder}" autocomplete="off"${spellcheckAttr}${autofocusAttr}>
          ${clearBtnHtml}
          <span class="search-kbd">/</span>
          <button type="${buttonType}"${btnAttrs} class="btn btn-primary search-btn">
            Search
          </button>
        </${tag}>`;
}

module.exports = { renderSearchBar };
