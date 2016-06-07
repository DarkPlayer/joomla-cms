/**
 * @copyright  Copyright (C) 2005 - 2017 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function() {
	"use strict";
	/**
	 * Javascript to insert the link
	 * View element calls jSelectArticle when an article is clicked
	 * jSelectArticle creates the link tag, sends it to the editor,
	 * and closes the select frame.
	 **/
	window.jSelectArticle = function (id, title, catid, object, link, lang) {
		var hreflang = '', editor, tag;

		if (!Joomla.getOptions('xtd-articles')) {
			// Something went wrong!
			window.parent.jModalClose();
			return false;
		}

		editor = Joomla.getOptions('xtd-articles').editor;

		if (lang !== '')
		{
			hreflang = ' hreflang="' + lang + '"';
		}

		/** Use the API, if editor supports it **/
		if (window.parent.Joomla && window.parent.Joomla.editors && window.parent.Joomla.editors.instances && window.parent.Joomla.editors.instances.hasOwnProperty(editor)) {
			var current_editor = window.parent.Joomla.editors.instances[editor].instance;
			var selected_elem = current_editor.selection.getNode();
			var anchor_elem = current_editor.dom.getParent(selected_elem, 'a[href]')
			if (anchor_elem)
			{
				var linkAttrs = { href: link };
				current_editor.dom.setAttribs(anchor_elem, linkAttrs);
				current_editor.selection.select(anchor_elem);
			}
			else
			{
				var selected = current_editor.selection.getContent();
				if (selected) title = selected;
				tag = '<a' + hreflang + ' href="' + link + '">' + title + '</a>';
				window.parent.Joomla.editors.instances[editor].replaceSelection(tag);
			}
		} else {
			tag = '<a' + hreflang + ' href="' + link + '">' + title + '</a>';
			window.parent.jInsertEditorText(tag, editor);
		}

		window.parent.jModalClose();
	};

	document.addEventListener('DOMContentLoaded', function(){
		// Get the elements
		var elements = document.querySelectorAll('.select-link');

		for(var i = 0, l = elements.length; l>i; i++) {
			// Listen for click event
			elements[i].addEventListener('click', function (event) {
				event.preventDefault();
				var functionName = event.target.getAttribute('data-function');

				if (functionName === 'jSelectArticle') {
					// Used in xtd_contacts
					window[functionName](event.target.getAttribute('data-id'), event.target.getAttribute('data-title'), event.target.getAttribute('data-cat-id'), null, event.target.getAttribute('data-uri'), event.target.getAttribute('data-language'));
				} else {
					// Used in com_menus
					window.parent[functionName](event.target.getAttribute('data-id'), event.target.getAttribute('data-title'), event.target.getAttribute('data-cat-id'), null, event.target.getAttribute('data-uri'), event.target.getAttribute('data-language'));
				}
			})
		}
	});
})();
