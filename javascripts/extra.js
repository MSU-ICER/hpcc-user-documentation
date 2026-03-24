// Add col scope to all table headers (we don't use row headers)
// Addresses WCAG2.1 1.3.1
$('th').attr('scope', 'col');


// Wrap content tabs in labeled fieldsets
// Addresses WCAG2.1 1.3.1 and 3.3.2
$('div.tabbed-set').wrap('<fieldset class="content-tab">')
$('fieldset.content-tab').prepend('<legend>Choose tab for your situation</legend>')

// Label external links to differentiate from internal links with same text
// Addresses WCAG2.0 A 2.4.4
$('a[target=_blank]').each( function(){
	let label;
	if ($(this).attr('title')) {
		label = $(this).attr('title');
	} else {
		label = $(this).text();
	}
	$(this).attr('aria-label', 'External link to ' + label)
});
