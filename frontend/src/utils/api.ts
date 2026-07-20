export default async function getResponse(search:string){
    const backendUrl=import.meta.env.BACKEND_URL||'http://localhost:8000'
    try{
        if(!search||typeof search!=='string'||!search.trim()){
            throw new Error('Search cannot be empty')
        }
        const res=await fetch(`${backendUrl}?search=${search.trim()}`)
        const data=await res.json()
        if(!res.ok){
            throw new Error(data.error)
        }
        return data
    }catch(err:any){
        throw new Error(err.message)
    }
}