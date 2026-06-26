const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all"
    fetch(url)
    .then(res => res.json())
    .then(res => displaylessons(res.data))
}

const showLevelWords = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url).then(res => res.json()).then(data => displayLevelWords(data.data))
}

const displayLevelWords = (words) => {

    let wordSection = document.getElementById("level-word-section")
    if(wordSection){
        wordSection.remove()
    }

    const wordContainer = document.getElementById("level-word-container")
    wordContainer.innerHTML = "";
    
    // {id: 5, level: 1, word: 'Eager', meaning: 'আগ্রহী', pronunciation: 'ইগার'}

    for(let word of words){
        let wordDiv = document.createElement("div")
        wordDiv.innerHTML= `
            <div class="bg-white p-5 rounded-lg text-center h-full flex flex-col">
                <h2 class="text-2xl font-bold">${word.word}</h2>
                <p>Meaning / Pronunciation</p>
                <p>${word.meaning} / ${word.pronunciation}</p>

                <div class="flex justify-between mt-auto">
                    <button class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF80]">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF80]">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>
        `
        wordContainer.append(wordDiv)

    }
}

const displaylessons = (lessons) => {
const levelContainer = document.getElementById("lesson-container");

for (let lesson of lessons) {
    const lessonDiv = document.createElement("div");
    lessonDiv.innerHTML = `
                <button id="lesson-btn-${lesson.level_no}" onclick="showLevelWords(${lesson.level_no})"  class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
                </button>

    `;

    levelContainer.append(lessonDiv);
}
}


loadLessons()