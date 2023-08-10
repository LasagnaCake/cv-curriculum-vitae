"use strict";

let templateDisplay = document.getElementById("template-display");

let templates = [
	TemplateCardData("Simple", "", `templates/template1-${lang}.html`),
]

function TemplateCardData(title, image, href) {
	return {
		title: title,
		image: image,
		href: href
	}
}

function TemplateCard(title, image, href) {
	const card = {
		card: document.createElement('a'),
		title: document.createElement('h2'),
		image: document.createElement('img')
	};
	card.title.innerText = title;
	card.image.src = image;
	card.card.href = href;
	card.card.classList.add('page-card');
	card.card.appendChild(card.title);
	card.card.appendChild(card.image);
	return card.card;
}

function showTemplates() {
	templates.forEach((t) => {
		templateDisplay.appendChild(TemplateCard(t.title, t.image, t.href));
	});
}