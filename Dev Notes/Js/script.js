// Seleção de elementos //
const searchInput = document.querySelector("#search-input");
const buttonExportCsv = document.querySelector("#export-csv");
const noteContentInput = document.querySelector("#note-content");
const notesContainer = document.querySelector("#notes-container")
const addNoteButton = document.querySelector(".add-note");


// Funções //
const showNotes = () =>{
    cleanNotes();

    getNote().forEach( note => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    });
}

function cleanNotes() {
    notesContainer.replaceChildren([]);
}

const addNoteBtn = () =>{
    const notes = getNote();

    const noteObject = {
        id:generateId(),
        content:noteContentInput.value,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);

    noteContentInput.value = "";
} 

const generateId = () =>{
    return Math.floor(Math.random() * 5000)
}

const createNote = (id, content,fixed) =>{
    const element = document.createElement("div");
    
    element.classList.add("note")

    const textArea = document.createElement("textarea");

    textArea.value = content;

    textArea.placeholder = "Adicione algum texto";

    element.appendChild(textArea);

    const pinIcon = document.createElement("i");

    pinIcon.classList.add(...["bi", "bi-pin"]);

    element.appendChild(pinIcon)

    if(fixed){
        element.classList.add("fixed")
    }

    element.querySelector("textarea").addEventListener("keyup", (e) => {
    
        const noteContentInput = e.target.value;
    
        updateNote(id,noteContentInput)
    });

    /* Evento do elemento pin */
        element.querySelector(".bi-pin").addEventListener("click", () => {
            toggleFixedNote(id);
        })

    const xLogIcon = document.createElement("i");

    xLogIcon.classList.add(...["bi", "bi-x-lg"])

    element.appendChild(xLogIcon);
    /* Evento do elemento x-lg */
    element.querySelector(".bi-x-lg").addEventListener("click", () => {
            deleteNote(id,element);
        })

    const fileEarmarkIcon = document.createElement("i");
    
    fileEarmarkIcon.classList.add(...["bi", "bi-file-earmark-plus"])

    element.appendChild(fileEarmarkIcon);
    /* Evento do elemento file-earmark-plus */
    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
            copyNote(id);
        })
        
    return element;
};


//fixed
function toggleFixedNote(id) {
    const notes = getNote();

    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

// delete
function deleteNote(id,element) {
    
    const notes = getNote().filter((note) => note.id !== id);

    saveNotes(notes);

    notesContainer.removeChild(element)
}

//copy
function copyNote(id) {
    
    const notes =getNote();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id:generateId(),
        content: targetNote.content,
        fixed:false,
    }

    const noteElement = createNote(noteObject.id,noteObject.content, noteObject.fixed);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes)
}

function updateNote(id,newContent) {
    
    const notes = getNote();

    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.content = newContent;

    saveNotes(notes)

}
// localStorage
const getNote = () =>{
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1))

    return orderedNotes;
}

const saveNotes = (note) => {
    localStorage.setItem("notes", JSON.stringify(note))
}

function searchNotes(search) {
    const searchResults = getNote().filter((note) => note.content.includes(search))

    if(search !== ""){

        cleanNotes()

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content)
            notesContainer.appendChild(noteElement);
        });
        
        return
    }

    cleanNotes();

    showNotes();
};

function exportData() {
    const notes = getNote();

    // separa o dado por , quebra linha \n

    const csvString = [
        ["Id", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id,note.content,note.fixed]),
    ].map((e) => e.join(",")).join("\n")

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8" + encodeURI(csvString);

    element.target = "_";

    element.download = "notes.scv";
    
    element.click()
}


// Eventos //
addNoteButton.addEventListener("click", () => addNoteBtn())

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    searchNotes(search);
});

noteContentInput.addEventListener("keydown", (e) => {
    
    if(e.key === "Enter") {
        addNoteBtn();
    }
})

buttonExportCsv.addEventListener("click", (e) => {
    exportData()
});

// Inicialização //
showNotes();