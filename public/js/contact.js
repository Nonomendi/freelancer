/* Contact form — interim WhatsApp handoff.
   TODO(checkpoint 3): replaced by a fetch() to POST /contact with real
   server-side validation. Kept here so the page keeps working in the
   meantime. */
(function () {
  'use strict';

  var form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var tierSelect = document.getElementById('packageTier');
    // The <option> value is now a stable slug (tier-01); the human-readable
    // label is the option text, which is what belongs in the message.
    var tierLabel = tierSelect.options[tierSelect.selectedIndex].text;

    var name = document.getElementById('clientName').value.trim();
    var business = document.getElementById('businessName').value.trim() || 'N/A';
    var notes =
      document.getElementById('projectNotes').value.trim() ||
      'No additional notes provided.';

    if (!name) {
      document.getElementById('clientName').focus();
      return;
    }

    var message =
      'Hi Nolundi! 👋\n\nI would like to request a project quote:\n\n' +
      '• *Name:* ' + name + '\n' +
      '• *Business:* ' + business + '\n' +
      '• *Package:* ' + tierLabel + '\n' +
      '• *Details:* ' + notes;

    var number = form.dataset.whatsapp;
    window.open(
      'https://wa.me/' + number + '?text=' + encodeURIComponent(message),
      '_blank',
      'noopener'
    );
  });
})();
