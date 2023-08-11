"use strict";
let skills = [];
let work = [];
let skuuid = 0;
let wkuuid = 0;

const icons = {
	add: '+',
	remove: '☓',
	up: '⏶',
	down: '⏷',
	edit: '✎',
	work: '✪',
	skill: '✪',
};

// Objects

const SkillItem = (desc) => {return {id: skuuid++, desc: desc}};
const WorkItem = (company, desc) => {return {id: wkuuid++, company: company, desc: desc}};

function CurriculumData() {
	updatePage();
	const data = {
		name: getInput("name").value,
		title: getInput("title").value,
		jobs: work,
		education: getInput("education").value,
		skills: skills,
		personal: getInput("personal").value,
		contact: getInput("contact").value,
		_skuuid: skuuid,
		_wkuuid: wkuuid,
	};
	data.toString = (s = null) => {return JSON.stringify(data, null, s);};
	return data;
}

// Components

function ItemButton(id, text, onclick) {
	const btn = document.createElement('button');
	btn.id = id;
	btn.innerText = text;
	btn.onclick = onclick;
	btn.classList.add('spaced-button');
	return btn;
}

function TablePair(parent, type, containerStyle) {
	const pair = [
		document.createElement(type),
		document.createElement(type)
	];
	const container = document.createElement('tr');
	container.appendChild(pair[0]);
	container.appendChild(pair[1]);
	parent.appendChild(container);
	container.style = containerStyle;
	pair[0].style = 'width: 35%; min-height: 64px;';
	pair[1].style = 'width: 60%; min-height: 64px;';
	return pair;
}

function HeaderPair(parent) {
	const pair = TablePair(parent, 'th');
	pair[0].style = 'width: 35%; height: 32px; font-size: 18pt;';
	pair[1].style = 'width: 60%; height: 32px; font-size: 18pt;';
	return pair;
}

function RowPair(parent) {
	return TablePair(parent, 'td');
}

function DataTable(name) {
	const table = document.createElement('table');
	table.style = 'width: 100%;';
	const pair = HeaderPair(table);
	pair[0].innerText = icons.edit;
	pair[1].innerText = name;
	return table;
}

function HistoryCard(company, desc) {
	const hc = document.createElement('div');
	hc.className = "cv-history-card";
	const cmp = document.createElement('h3');
	const dsc = document.createElement('p');
	hc.appendChild(cmp);
	hc.appendChild(dsc);
	cmp.innerText = company;
	dsc.innerText = desc;
	return hc;
}

// Functions

function setPalette(palette) {
	const docstyle = document.documentElement.style;
	if (palette === null) {
		docstyle.setProperty("--bg-color", "#fff");
		docstyle.setProperty("--hr-color", "#fff");
	} else {
		const style = getComputedStyle(document.querySelector(`.${palette}`));
		docstyle.setProperty("--bg-color", style.backgroundColor);
		docstyle.setProperty("--hr-color", style.borderColor);
	}
}

function getParameter(param) {
	return document.getElementById(`cv-${param}-display`);
}

function getInput(input) {
	return document.getElementById(`${input}-in`);
}

function setParameter(param, val) {
	getParameter(param).innerText = value;
}

function setParameterByInput(param) {
	const ip = document.getElementById(`${param}-in`);
	const pr = getParameter(param);
	pr.innerText = ip.value;
}

function updateSkills() {
	const skdisp = getParameter("skill");
	const sklist = document.getElementById("skill-list");
	Array.from(skdisp.children).forEach((c) => skdisp.removeChild(c));
	Array.from(sklist.children).forEach((c) => sklist.removeChild(c));
	const table = DataTable(icons.skill);
	sklist.appendChild(table);
	skills.forEach((s, idx) => {
		const i = document.createElement('li');
		i.innerText = s.desc;
		skdisp.appendChild(i);
		const btn = ItemButton (
			`skill-btn-${idx}`,
			icons.remove,
			(ev) => {
				skills.splice(skills.indexOf(skills.find((v) => v.id == s.id)), 1);
				updateSkills();
			}
		);
		const manip = [
			ItemButton(`skill-up-${idx}`, icons.up, (ev) => {moveSkill(s.id, -1)}),
			ItemButton(`skill-dn-${idx}`, icons.down, (ev) => {moveSkill(s.id, +1)})
		]
		const dsc = document.createElement('span');
		dsc.innerText = s.desc;
		const sp = RowPair(table);
		sp[0].appendChild(btn);
		sp[0].appendChild(manip[0]);
		sp[0].appendChild(manip[1]);
		sp[1].appendChild(dsc);
	});
}

function updateWork() {
	const wkdisp = getParameter("history");
	const wklist = document.getElementById("work-list");
	Array.from(wkdisp.children).forEach((c) => wkdisp.removeChild(c));
	Array.from(wklist.children).forEach((c) => wklist.removeChild(c));
	const table = DataTable(icons.work);
	wklist.appendChild(table);
	work.forEach((w, idx) => {
		const wc = HistoryCard(w.company, w.desc);
		const space = document.createElement('br');
		wkdisp.appendChild(wc);
		wkdisp.appendChild(space);
		const btn = ItemButton(
			`work-btn-${idx}`,
			icons.remove,
			(ev) => {
				work.splice(work.indexOf(work.find((v) => v.id == w.id)), 1);
				updateWork();
			}
		)
		const manip = [
			ItemButton(`work-up-${idx}`, icons.up, (ev) => {moveWork(w.id, -1)}),
			ItemButton(`work-dn-${idx}`, icons.down, (ev) => {moveWork(w.id, +1)})
		]
		const dsc = document.createElement('span');
		dsc.innerText = w.company;
		const sp = RowPair(table);
		sp[0].appendChild(btn);
		sp[0].appendChild(manip[0]);
		sp[0].appendChild(manip[1]);
		sp[1].appendChild(dsc);
	});
}

function updatePage() {
	setParameterByInput('name');
	setParameterByInput('title');
	setParameterByInput('education');
	setParameterByInput('personal');
	setParameterByInput('contact');
	updateSkills();
	updateWork();
}

function move(arr, oldi, newi) {
	if (newi >= arr.length || newi < 0) return arr;
	arr.splice(newi, 0, arr.splice(oldi, 1)[0]);
	return arr;
}

function findIndex(arr, pred) {
	return arr.indexOf(arr.find(pred))
}

function moveWork(id, offset) {
	const at = findIndex(work, (v) => v.id == id);
	work = move(work, at, at + offset);
	updateWork();
}

function moveSkill(id, offset) {
	const at = findIndex(skills, (v) => v.id == id);
	skills = move(skills, at, at + offset);
	updateSkills();
}

function addSkill() {
	const skin = document.getElementById('skill-in');
	skills.push(SkillItem(skin.value));
	updateSkills();
}

function clearSkills() {
	skills.splice(0, skills.length);
	skuuid = 0;
	updateSkills();
}

function addWork() {
	const cmpin = document.getElementById('company-in');
	const dscin = document.getElementById('compdesc-in');
	work.push(WorkItem(cmpin.value, dscin.value));
	updateWork();
}

function clearWork() {
	work.splice(0, work.length);
	wkuuid = 0;
	updateWork();
}

function printCurriculum() {
	updatePage();
	window.print();
}

function saveFile(data, filename, type) {
	let file = new Blob([data], {type: type});
	let
		a = document.createElement("a"),
		url = URL.createObjectURL(file)
	;
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
	}, 0);
}

function saveToLocalStorage() {
	sessionStorage.setItem('cv-data', CurriculumData().toString());
}

function loadFromLocalStorage() {
	const data = sessionStorage.getItem('cv-data');
	if (data.length) {
		loadCurriculum(JSON.parse(data));
	}
}

function saveCurriculum() {
	updatePage();
	saveFile(
		CurriculumData().toString('\t'),
		"curriculum.json",
		"application/json"
	);
}

function loadFile(event) {
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onloadend = () => {
		loadCurriculum(JSON.parse(reader.result));
	};
	reader.readAsText(file);
};

function loadCurriculum(data) {
	Object.keys(data).forEach((k) => {
		if (typeof data[k] === "string")
			getInput(k).value = data[k];
	});
	work	= data["jobs"];
	wkuuid	= data["_wkuuid"];
	skills	= data["skills"];
	skuuid	= data["_skuuid"];
	updatePage();
}