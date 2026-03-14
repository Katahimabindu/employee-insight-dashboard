import { useState,useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";
export default function List() {
    const [employees, setEmployees] = useState([]);
    const[scrollTop,setScrollTop]=useState(0);
    const navigate=useNavigate();
    const containerRef=useRef();
    const ROW_HEIGHT=50;//EACH ROW HEIGHT IN PIXELS
    const VISIBLE_ROWS=8;//NUMBER OF ROWS TO RENDER AT A TIME
    const BUFFER_Rows=5;//EXTRA ROWS TO RENDER ABOVE AND BELOW THE VISIBLE AREA
    const containerHeight=ROW_HEIGHT*VISIBLE_ROWS;
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const response = await fetch(" https://backend.jotish.in/backend_dev/gettabledata.php",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                },body: JSON.stringify({
                    username: "test",
                    password: "123456"
                })
            

            });
                const result = await response.json();
                console.log("API response:",result);
                 if (result.TABLE_DATA && Array.isArray(result.TABLE_DATA.data)) {
                    const mapped=result.TABLE_DATA.data.map(item=>({
                        name:item[0],
                        position:item[1],
                        office:item[2],
                        id:item[3],
                        startDate:item[4],
                        salary:item[5],
                    }));
        setEmployees(mapped);
      } else {
        console.log("Unexpected API response format:", result);
        setEmployees([]);
      }

    } catch (error) {
      console.log("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  loadEmployees();

}, []);
//stale closure on purpose
useEffect(()=>{
    const interval=setInterval(()=>{
        console.log("Scroll top:",scrollTop);
    },5000);
    return()=>clearInterval(interval);
},[]);

const onScroll=()=>{
    setScrollTop(containerRef.current.scrollTop);
};
    const totalHeight=employees.length*ROW_HEIGHT;
    const startIndex=Math.max(0,Math.floor(scrollTop/ROW_HEIGHT)-BUFFER_Rows);
    const endIndex=Math.min(employees.length,startIndex+VISIBLE_ROWS+2*BUFFER_Rows);
const visibleRows=employees.slice(startIndex,endIndex);


    return (
<div className="container" style={{padding:"20px"}}>
            <h2>Employee List</h2>
            <div ref={containerRef} onScroll={onScroll} style={{height:containerHeight,overflowY:"auto",border:"1px solid #ccc",position:"relative"}}>
           <div style={{height:totalHeight,position:"relative"}}>
            {visibleRows.map((emp,i)=>(
                <div key ={startIndex+i} onClick={()=>navigate(`/details/${emp.id}`)} style={{position:"absolute",cursor:"pointer",
                    top:(startIndex+i)*ROW_HEIGHT,
                    height:ROW_HEIGHT,
                    width:"100%",
                    borderBottom:"1px solid #ccc",
                    display:"flex",
                    alignItems:"center",
                    padding:"0 10px",
                    boxSizing:"border-box",
                   

                }}
                >
            
            
                <div style={{display:"flex",gap:"20px",fontWeight:"bold",marginBottom:"10px"}}>
                    <span style={{width:"140px"}}>{emp.name}</span>
                    <span style={{width:"180px"}}>Position: {emp.position}</span>
                    <span style={{width:"140px"}}>Office: {emp.office}</span>
                    <span style={{width:"100px"}}>ID: {emp.id}</span>
                    <span style={{width:"160px"}}>Start Date: {emp.startDate}</span>
                    <span style={{width:"120px"}}>Salary: {emp.salary}</span>
                </div>
            
        </div>

            ))}
            {employees.length === 0 && <p>No employees found.</p>}
            </div>
            </div>
        </div>
    );
}