import './App.css';
import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constants"; // Import the dummyNotesList from the appropriate module
import { useState, useEffect, useContext } from 'react';
import { ThemeContext, themes } from './themeContext';
import  { ToggleTheme }  from "./hooksExercise"

function App() {
  const [notes, setNotes] = useState(dummyNotesList);
  const [favoriteTitles, setFavoriteTitles] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null); // Add selectedNote state

  const initialNote = {
   id: -1,
   title: "",
   content: "",
   label: Label.other,
   favorite: false,
 };
  const [createNote, setCreateNote] = useState(initialNote);
  

  const createNoteHandler = (event: React.FormEvent) => {
   event.preventDefault();
   console.log("qtitle: ", createNote.title);
   console.log("content: ", createNote.content);
   createNote.id = notes.length + 1;
   setNotes([createNote, ...notes]);
   setCreateNote(initialNote);
 };

 const toggleFavorite = (id: number) => {
  const updatedNotes = notes.map(note => {
    if (note.id === id) {
      return { ...note, favorite: !note.favorite }; 
    }
    return note;
  });
  setNotes(updatedNotes);
};
useEffect(() => {
  const favorites = notes.filter(note => note.favorite).map(note => note.title);
  setFavoriteTitles(favorites);
}, [notes]);


const editNote = (id: number) => {
  const noteToEdit = notes.find(note => note.id === id);
  if (noteToEdit) {
    setSelectedNote(noteToEdit);
  }
};

const handleNoteChange = (field: string, value: string) => {
  if (selectedNote) {
    const updatedNote = { ...selectedNote, [field]: value };
    setSelectedNote(updatedNote);
  }
};

const deleteNote = (id: number) => {
  const updatedNotes = notes.filter(note => note.id !== id);
  setNotes(updatedNotes);
};



const saveNote = () => {
  const updatedNotes = notes.map(note => {
    if (selectedNote && note.id === selectedNote.id) {
      return selectedNote;
    }
    return note;
  });
  setNotes(updatedNotes);
  setSelectedNote(null);
};




const theme = useContext(ThemeContext);


return (
  <div className='app-container' style={{
    background: theme.background,
    color: theme.foreground,
    padding: "20px",
  }}>
    <form className="note-form" onSubmit={createNoteHandler}>
      <div>
        <input
          placeholder="Note Title"
          value={createNote.title}
          onChange={(event) =>
            setCreateNote({ ...createNote, title: event.target.value })}
          required
        />
      </div>

      <div>
        <textarea
          placeholder="Note Content"
          value={createNote.content}
          onChange={(event) =>
            setCreateNote({ ...createNote, content: event.target.value })}
          required
        />
      </div>

      <div>
        <select
          value={createNote.label}
          onChange={(event) =>
            setCreateNote({ ...createNote, label: event.target.value as Label })}
          required
        >
          <option value={Label.personal}>Personal</option>
          <option value={Label.study}>Study</option>
          <option value={Label.work}>Work</option>
          <option value={Label.other}>Other</option>
        </select>
      </div>

      <div><button type="submit">Create Note</button></div>
    </form>
    <div className="notes-grid">
      {notes.map((note) => (
        <div key={note.id} className="note-item">
          <div className="notes-header">
            <button onClick={() => toggleFavorite(note.id)}>
              {note.favorite ? "Unfavorite" : "Favorite"}
            </button>
            <button onClick={() => editNote(note.id)}>Edit</button>

            <button onClick={() => deleteNote(note.id)}>x</button>

          </div>

          {selectedNote && selectedNote.id === note.id ? (
            <div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => handleNoteChange('title', event.currentTarget.textContent || '')}
              >
                {selectedNote.title}
              </div>

              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => handleNoteChange('content', event.currentTarget.textContent || '')}
              >
                {selectedNote.content}
              </div>

              <select
                value={selectedNote.label}
                onChange={(event) => handleNoteChange('label', event.target.value as Label)}
              >
                <option value={Label.personal}>Personal</option>
                <option value={Label.study}>Study</option>
                <option value={Label.work}>Work</option>
                <option value={Label.other}>Other</option>
              </select>

              <button onClick={saveNote}>Save</button>
            </div>
          ) : (
            <div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <p>{note.label}</p>
            </div>
          )}
        </div>
      ))}
    </div>

   <ToggleTheme></ToggleTheme>
    <button style={{ background: theme.foreground, color: theme.background }}></button>
   
    <div className="favorite-notes">
      <h3>Favorite Notes:</h3>
      <ul>
        {favoriteTitles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
    </div>
  </div>
);



  
  
  
}

export default App;

