const API_BASE_URL = "https://openapi.programming-hero.com/api";

const fetchData = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data ?? [];
};

const setActiveLesson = (lessonId) => {
    document.querySelectorAll(".lesson-btn").forEach((button) => {
        button.classList.toggle("active", button.id === `lesson-btn-${lessonId}`);
    });
};

const loadLessons = async () => {
    try {
        const lessons = await fetchData("/levels/all");
        displayLessons(lessons);
    } catch (error) {
        console.error("Failed to load lessons:", error);
    }
};

const showWordDetails = async (id) => {
    const modal = document.getElementById("my_modal_5");
    const wordDetailsContainer = document.getElementById("wordDetailsContainer");

    if (!modal || !wordDetailsContainer) return;

    modal.showModal();
    wordDetailsContainer.innerHTML = '<p class="text-sm text-gray-500">Loading word details...</p>';

    try {
        const word = await fetchData(`/word/${id}`);
        const synonymsMarkup = (word.synonyms || [])
            .map((syn) => `
                <button type="button" class="bg-[#68acf020] p-2 border border-gray-200 rounded-sm">
                    ${syn}
                </button>
            `)
            .join("");

        wordDetailsContainer.innerHTML = `
            <div class="border border-[#EDF7FF] rounded-lg p-4">
                <h3 class="text-lg font-bold">${word.word || "Word not found"} (${word.pronunciation || "N/A"})</h3>
                <h4 class="py-4">Meaning</h4>
                <p>${word.meaning || "Meaning not found"}</p>
                <h4 class="py-4">Example</h4>
                <p>${word.sentence || "Example not found"}</p>
                <h4 class="py-4">সমার্থক শব্দ গুলো</h4>
                <div class="max-sm:grid flex gap-4 mt-2">
                    ${synonymsMarkup || '<p class="text-sm text-gray-500">No synonyms available</p>'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Failed to load word details:", error);
        wordDetailsContainer.innerHTML = '<p class="text-red-500">Failed to load word details.</p>';
    }
};

const showLevelWords = async (id) => {
    setActiveLesson(id);

    const wordContainer = document.getElementById("level-word-container");
    const wordSection = document.getElementById("level-word-section");

    if (!wordContainer) return;

    wordContainer.innerHTML = "";
    wordSection?.remove();

    try {
        const words = await fetchData(`/level/${id}`);
        displayLevelWords(words);
    } catch (error) {
        console.error("Failed to load level words:", error);
        wordContainer.innerHTML = '<p class="text-red-500">Failed to load words.</p>';
    }
};

const displayLevelWords = (words = []) => {
    const wordContainer = document.getElementById("level-word-container");

    if (!wordContainer) return;

    if (!Array.isArray(words) || words.length === 0) {
        wordContainer.className = "";
        wordContainer.innerHTML = `
            <div class="grid text-center gap-3 bg-gray-50 mx-auto p-10 border border-none rounded-lg w-11/12">
                <img src="assets/alert-error.png" alt="" class="mx-auto">
                <p class="text-[#79716B] text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <p class="text-[#292524] text-3xl font-semibold">নেক্সট Lesson এ যান</p>
            </div>
        `;
        return;
    }

    wordContainer.className = "bg-gray-50 w-11/12 grid md:grid-cols-3 p-4 mx-auto rounded-lg gap-4";
    wordContainer.innerHTML = "";

    words.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
            <div class="bg-white p-5 rounded-lg text-center h-full flex flex-col">
                <h2 class="text-2xl font-bold">${word.word || "word not found"}</h2>
                <p>Meaning / Pronunciation</p>
                <p>${word.meaning || "word meaning not found"} / ${word.pronunciation || "pronunciation not found"}</p>

                <div class="flex justify-between mt-auto">
                    <button onclick="showWordDetails(${word.id})" class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF80]">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF80]">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>
        `;

        wordContainer.appendChild(wordDiv);
    });
};

const displayLessons = (lessons = []) => {
    const levelContainer = document.getElementById("lesson-container");

    if (!levelContainer) return;

    levelContainer.innerHTML = "";

    lessons.forEach((lesson) => {
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="showLevelWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;

        levelContainer.appendChild(lessonDiv);
    });
};

loadLessons();