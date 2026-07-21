import getResponse from "./utils/api"
import {useState} from 'react'

export default function App(){
  const [loading,setLoading]=useState<boolean>(false)
  const [error,setError]=useState<null|string>(null)
  const [response,setResponse]=useState<null|string>(null)
  const [lastQuestion,setLastQuestion]=useState<string>('')

  async function handleSubmit(e:any){
    setLoading(true)
    setError(null)
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const search=String(formData.get('search'))
    setLastQuestion(search)
    try{
      const response=await getResponse(search)
      setResponse(response.message)
    }catch(err:any){
      setError(err?.message||'Unknown error')
      setResponse(null)
    }finally{
      setLoading(false)
    }
  }

  return(
    <div style={{
      minHeight:'100vh',
      background:'#0D0F12',
      color:'#E4E4E0',
      fontFamily:'Inter, system-ui, sans-serif',
      display:'flex',
      justifyContent:'center',
      padding:'80px 24px'
    }}>
      <div style={{width:'100%',maxWidth:'640px'}}>

        <div style={{marginBottom:'40px'}}>
          <p style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize:'13px',
            color:'#5FD68A',
            letterSpacing:'0.05em',
            margin:'0 0 8px'
          }}>No SQL. Just ask.</p>
          <h1 style={{
            fontSize:'22px',
            fontWeight:500,
            margin:0,
            color:'#E4E4E0'
          }}>Ask the database a question</h1>
        </div>

        <form onSubmit={handleSubmit} style={{marginBottom:'32px'}}>
          <div style={{
            display:'flex',
            alignItems:'center',
            background:'#15181C',
            border:'1px solid #2A2E33',
            borderRadius:'6px',
            padding:'0 4px 0 16px'
          }}>
            <span style={{
              fontFamily:'"JetBrains Mono", monospace',
              color:'#5FD68A',
              fontSize:'15px',
              marginRight:'10px',
              userSelect:'none'
            }}>{'>'}</span>
            <input
              autoComplete="off"
              required={true}
              name="search"
              placeholder="how many users have resumes"
              disabled={loading}
              style={{
                flex:1,
                background:'transparent',
                border:'none',
                outline:'none',
                color:'#E4E4E0',
                fontFamily:'"JetBrains Mono", monospace',
                fontSize:'15px',
                padding:'14px 0'
              }}
            />
            <button
              disabled={loading}
              style={{
                background:loading?'transparent':'#5FD68A',
                color:loading?'#5FD68A':'#0D0F12',
                border:'none',
                borderRadius:'4px',
                padding:'8px 16px',
                fontFamily:'"JetBrains Mono", monospace',
                fontSize:'13px',
                fontWeight:500,
                cursor:loading?'default':'pointer',
                margin:'6px'
              }}
            >
              {loading?'···':'Run'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            borderLeft:'2px solid #E24B4A',
            paddingLeft:'16px',
            marginBottom:'24px'
          }}>
            <p style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize:'12px',
              color:'#E24B4A',
              margin:'0 0 4px',
              letterSpacing:'0.05em'
            }}>ERROR</p>
            <p style={{fontSize:'14px',color:'#B8B8B4',margin:0}}>{error}</p>
          </div>
        )}

        {loading && (
          <div style={{
            fontFamily:'"JetBrains Mono", monospace',
            fontSize:'14px',
            color:'#5FD68A',
            display:'flex',
            alignItems:'center',
            gap:'4px'
          }}>
            <span>querying</span>
            <span className="blink-cursor">▍</span>
          </div>
        )}

        {response && !loading && (
          <div style={{
            borderLeft:'2px solid #5FD68A',
            paddingLeft:'16px'
          }}>
            <p style={{
              fontFamily:'"JetBrains Mono", monospace',
              fontSize:'12px',
              color:'#5FD68A',
              margin:'0 0 8px',
              letterSpacing:'0.05em'
            }}>{lastQuestion}</p>
            <p style={{
              fontSize:'16px',
              lineHeight:1.6,
              color:'#E4E4E0',
              margin:0
            }}>{response}</p>
          </div>
        )}

      </div>
    </div>
  )
}