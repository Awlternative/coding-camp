const dataProjects = [
    
    {
        channelName: "Navigation of HTML Index",
        youtubeSrc: "https://www.youtube.com/@GreatStackDev",
        path: "pages/",
        projects: {
            js_30_day: [
                {
                    title: "Aplikasi Login",
                    link: "aplikasi-login/index.html",
                },
                {
                    title: "Web Dasar",
                    link: "web-dasar/index.html",
                },
                {
                    title: "Web Dasar 2",
                    link: "about-yorushika/index.html",
                },
                {
                    title: "DOM",
                    link: "dom/index.html",
                },
                {
                    title: "To Do List",
                    link: "todo-list/index.html",
                },
                {
                    title: "Web Stroage",
                    link: "web-stroage/game.html",
                },
                {
                    title: "DBS Demo",
                    link: "ilt/dbs-demo/index.html",
                },
                {
                    title: "bookshelf",
                    link: "bookshelf-fe/index.html",
                },
            ]
        }
    },
]

const projectList = document.getElementById("project-list");
dataProjects.forEach((channel) => {
    const path = channel.path;

    const channelSection = document.createElement("section");
    channelSection.id = channel.youtubeSrc;
    channelSection.className =
        "flex flex-row gap-12 justify-start items-baseline";

    const projects = channel.projects;
    const projectSection = document.createElement("div");
    projectSection.className =
        "bg-transparent border border-[#fbbf24]/50 rounded-2xl xl:min-w-[700px] max-w-[920px] transition-all duration-300 h-full overflow-hidden p-6 gap-6 flex flex-col justify-start items-center shadow-[0_0_20px_rgba(251,191,36,0.15)]";

    const channelName = document.createElement("h2");
    channelName.textContent = channel.channelName;
    channelName.className =
        "text-4xl font-bold text-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]";
    channelSection.appendChild(projectSection);

    projectSection.appendChild(channelName);

    const wrap = document.createElement("div");
    wrap.className = "flex w-full flex-wrap gap-6 text-2xl";
    projectSection.appendChild(wrap);

    for (const projectType in projects) {
        if (Array.isArray(projects[projectType])) {
            projects[projectType].forEach((project) => {
                const projectLink = document.createElement("a");
                const buttonColor =
                    "bg-[#2a1f4d]/30 hover:bg-[#2a1f4d]/60 hover:border-[#f59e0b]/70 hover:text-[#fbbf24] hover:shadow-[0_0_15px_rgba(251,191,36,0.25)] max-md:text-xs";
                projectLink.className = `flex w-auto text-center px-12 max-md:px-4 py-2 max-md:py-1 border border-transparent text-white transition-all duration-300 rounded-xl ${buttonColor}`;
                projectLink.style =
                    "flex-grow: 1; box-sizing: border-box; text-decoration: none; align-items: center; justify-content: center; display: flex; height: 60px;";
                projectLink.href = `${path}${project.link}`;
                projectLink.textContent = `${project.title}`;

                wrap.appendChild(projectLink);
            });
        } else {
            const project = projects[projectType];
            const projectSection = document.createElement("div");
            projectSection.className =
                "bg-gradient-to-b from-[#1a1b2e]/80 to-[#2a1f4d]/80 border border-[#fbbf24]/40 transition-all duration-300 h-full max-w-[900px] overflow-hidden max-h-[80vh] p-6 rounded-2xl shadow-[0_0_15px_rgba(251,191,36,0.15)]";

            const projectLink = document.createElement("a");
            projectLink.href = `${path}${project.link}`;
            projectLink.textContent = `${project.title}`;
            projectLink.className =
                "text-[#fcd34d] hover:text-[#fbbf24] transition-colors duration-200 font-semibold";
            projectSection.appendChild(projectLink);
            channelSection.appendChild(projectSection);
        }
    }

    projectList.appendChild(channelSection);
});

