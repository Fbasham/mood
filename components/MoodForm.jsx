const MoodForm = ({mood,moods,date,setEditing,setMoods}) => {

  async function handleSubmit(e){
    e.preventDefault()
    let res = await fetch('/api/saveMood',{
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({
        date,
        feeling: e.target.feeling.value,
        notes: e.target.notes.value,
      })
    })
    let updatedMood = await res.json()
    let i = moods.findIndex(e=>e.date===updatedMood.date || e._id===updatedMood._id)
    moods[i] = updatedMood
    setMoods([...moods])
  }

  return (
    <form onSubmit={handleSubmit}>
        <div>
          <h2 className="font-bold">Date</h2>
          <div>{mood.date.toString()}</div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="feeling" className="font-bold">Feeling</label>
          <input type='number' id="feeling" defaultValue={mood.feeling} min={0} max={4} required/>
        </div>
        <div className="flex flex-col">
          <label htmlFor='notes' className="font-bold">Notes</label>
          <textarea id='notes' defaultValue={mood.notes} className='w-full'/>
        </div>
        <div className="flex gap-2">
            <button className="px-1 bg-gray-300 rounded text-sm">save</button>
            <button
              onClick={() => setEditing(false)}
              className="px-1 bg-gray-300 rounded text-sm"
            >
              cancel
            </button>

        </div>
    </form>
  )
}

export default MoodForm