interface JournalEntry {
    tanggal: string,
    judul:string,
    pesan:string,
    mood:number,
    gambar?:string
}

// function hitungMoodRataRata(entry :JournalEntry[]) : number {
// let total=0
// for (const item of entry) {
// total += item.mood
// }
// return total/entry.length
// }

async function ambilEntriesBulan(bulan:number,tahun:number){
    const response = await fetch(`http://127.0.0.1:5000/entries?bulan=${bulan}&tahun=${tahun}`)
    const data = await response.json();
    return data
}

