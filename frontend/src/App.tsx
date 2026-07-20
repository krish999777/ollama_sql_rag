import getResponse from "./utils/api"
import {useState} from 'react'

export default function App(){
  const [loading,setLoading]=useState<boolean>(false)
  const [error,setError]=useState<null|string>(null)
  const [response,setResponse]=useState<null|string>(null)


  async function handleSubmit(e:any){
    setLoading(true)
    setError(null)
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const search=String(formData.get('search'))
    try{
      const response=await getResponse(search)
      setResponse(response)
    }catch(err:any){
      setError(err?.error||'Unknown error')
    }finally{
      setLoading(false)
    }
  }
  return(
    <div>
      {error?<div>{error}</div>:null}
      <form onSubmit={handleSubmit}>
        <input required={true} name="search"/>
        <button disabled={loading}>{loading?'Searching':'Search'}</button>
      </form>
      {response?<div>{response}</div>:null}
    </div>
  )
}