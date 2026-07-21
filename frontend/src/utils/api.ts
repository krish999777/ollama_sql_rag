export default async function getResponse(search:string){
    const backendUrl=import.meta.env.VITE_BACKEND_URL||'http://localhost:8000'
    try{
        if(!search||typeof search!=='string'||!search.trim()){
            throw new Error('Search cannot be empty')
        }
        const params = new URLSearchParams({ search: search.trim() })
        const res=await fetch(`${backendUrl}?search=${params.toString()}`)
        const data=await res.json()
        if(!res.ok){
            throw new Error(data.error)
        }
        return data
    }catch(err:any){
        throw new Error(err.message)
    }
}