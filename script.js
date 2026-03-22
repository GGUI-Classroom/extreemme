const PROFILE = {
	socials: {
		discord: "https://discord.gg/GcSzNwPFMy",
		github: "https://github.com/GGUI-Classroom",
		youtube: "https://www.youtube.com/@GGUI-Games",
	},
	projects: [
		{
			id: "project-1",
			url: "https://schoolsofeasternnevada.github.io",
			title: "Open project: GGUI",
		},
	],
};

const canvas = document.getElementById("fx-canvas");
const context = canvas.getContext("2d", { alpha: true });

const pointerFine = window.matchMedia("(pointer: fine)").matches;
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const discordLink = document.getElementById("social-discord");
const githubLink = document.getElementById("social-github");
const youtubeLink = document.getElementById("social-youtube");
const toast = document.getElementById("toast");

function showToast(message) {
	if (!toast) {
		return;
	}

	toast.textContent = message;
	toast.classList.add("show");
	window.clearTimeout(showToast.timeoutId);
	showToast.timeoutId = window.setTimeout(() => {
		toast.classList.remove("show");
	}, 1800);
}

function setSocialTargets() {
	if (discordLink) {
		discordLink.href = PROFILE.socials.discord;
		discordLink.title = "Open Discord";
		discordLink.target = "_blank";
		discordLink.rel = "noopener noreferrer";
	}

	if (githubLink) {
		githubLink.href = PROFILE.socials.github;
		githubLink.title = "Open GitHub";
	}

	if (youtubeLink) {
		youtubeLink.href = PROFILE.socials.youtube;
		youtubeLink.title = "Open YouTube";
	}
}

function setProjectTargets() {
	PROFILE.projects.forEach((project) => {
		const node = document.getElementById(project.id);
		if (!node) {
			return;
		}

		node.href = project.url;
		node.setAttribute("aria-label", project.title);
		node.title = project.title;
	});
}

setSocialTargets();
setProjectTargets();

let width = 0;
let height = 0;
let stars = [];
const starCount = 85;

const mouse = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	targetX: window.innerWidth / 2,
	targetY: window.innerHeight / 2,
};

function resizeCanvas() {
	width = canvas.width = window.innerWidth * window.devicePixelRatio;
	height = canvas.height = window.innerHeight * window.devicePixelRatio;
	canvas.style.width = `${window.innerWidth}px`;
	canvas.style.height = `${window.innerHeight}px`;
	context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
	buildStars();
}

function buildStars() {
	stars = Array.from({ length: starCount }, () => ({
		x: Math.random() * window.innerWidth,
		y: Math.random() * window.innerHeight,
		size: Math.random() * 1.8 + 0.6,
		speed: Math.random() * 0.12 + 0.03,
		alpha: Math.random() * 0.6 + 0.2,
		twinkle: Math.random() * Math.PI * 2,
	}));
}

function drawBackground(time) {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	const gradient = context.createRadialGradient(
		mouse.x,
		mouse.y,
		80,
		window.innerWidth / 2,
		window.innerHeight / 2,
		Math.max(window.innerWidth, window.innerHeight)
	);
	gradient.addColorStop(0, "rgba(143,98,255,0.16)");
	gradient.addColorStop(0.35, "rgba(0,216,255,0.09)");
	gradient.addColorStop(1, "rgba(0,0,0,0)");

	context.fillStyle = gradient;
	context.fillRect(0, 0, window.innerWidth, window.innerHeight);

	for (const star of stars) {
		star.y -= star.speed;
		star.twinkle += 0.02;

		if (star.y < -4) {
			star.y = window.innerHeight + 4;
			star.x = Math.random() * window.innerWidth;
		}

		const twinkleAlpha = star.alpha + Math.sin(star.twinkle + time * 0.0012) * 0.2;
		context.beginPath();
		context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
		context.fillStyle = `rgba(198,223,255,${Math.max(0.08, twinkleAlpha)})`;
		context.fill();
	}
}

function animateBackground(time) {
	mouse.x += (mouse.targetX - mouse.x) * 0.08;
	mouse.y += (mouse.targetY - mouse.y) * 0.08;
	drawBackground(time);
	requestAnimationFrame(animateBackground);
}

window.addEventListener("mousemove", (event) => {
	mouse.targetX = event.clientX;
	mouse.targetY = event.clientY;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

if (!motionReduced) {
	requestAnimationFrame(animateBackground);
} else {
	drawBackground(0);
}

if (pointerFine && !motionReduced) {
	const glow = document.querySelector(".cursor-glow");
	const core = document.querySelector(".cursor-core");
	const trailRoot = document.getElementById("cursor-trail");

	const trailLength = 14;
	const trail = [];
	const pointer = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};

	for (let index = 0; index < trailLength; index += 1) {
		const dot = document.createElement("div");
		dot.className = "trail-dot";
		dot.style.opacity = `${1 - index / (trailLength + 2)}`;
		dot.style.transform = `scale(${1 - index / (trailLength * 1.5)})`;
		trailRoot.appendChild(dot);
		trail.push({ element: dot, x: pointer.x, y: pointer.y });
	}

	window.addEventListener("mousemove", (event) => {
		pointer.x = event.clientX;
		pointer.y = event.clientY;
	});

	const interactive = "a, button, input, textarea, select";
	document.querySelectorAll(interactive).forEach((node) => {
		node.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
		node.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
	});

	function animateCursor() {
		glow.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
		core.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

		let previousX = pointer.x;
		let previousY = pointer.y;

		trail.forEach((item, index) => {
			const ease = 0.34 - index * 0.016;
			item.x += (previousX - item.x) * ease;
			item.y += (previousY - item.y) * ease;
			item.element.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(${1 - index / (trailLength * 1.4)})`;
			previousX = item.x;
			previousY = item.y;
		});

		requestAnimationFrame(animateCursor);
	}

	requestAnimationFrame(animateCursor);
} else {
	document.querySelector(".cursor-glow")?.remove();
	document.querySelector(".cursor-core")?.remove();
	document.getElementById("cursor-trail")?.remove();
}
