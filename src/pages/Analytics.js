import { useState,useEffect } from "react";
export default function Analytics() {
    const [citySalary,setCitySalary]=useState([]);
    useEffect(()=>{
        
        const employees=JSON.parse(localStorage.getItem("employees"))||"[]";
            const cityMap={};
            employees.forEach(emp=>{
                const city=emp.office;
                const salary=parseInt(emp.salary.replace(/[^0-9]/g,""));
                if(!cityMap[city]){
                    cityMap[city]=0;
                }
                cityMap[city]+=salary;
            });
            const formatted=Object.keys(cityMap).map((city)=>({city,Salary:cityMap[city]}));
            setCitySalary(formatted);
        
    },[]);
    const maxSalary=Math.max(...citySalary.map(d=>d.Salary),1);
    return (
        <div style={{padding:"20px"}}>
            <h2>Salary Distribution per City</h2>
            <svg width="600" height="300">
                {citySalary.map((item,index)=>{
                    const barHEIGHT=(item.Salary/maxSalary)*200;
                    const x=index*70+50;
                    const y=250-barHEIGHT;
                    return(
                        <g key={index}>
                            <rect x={x} y={y} width="40" height={barHEIGHT} fill="#4CAF50"/>
                            
                            <text x={x} y={270} textAnchor="middle" fontSize="10">{item.city}</text>
                        </g>
                    )
                 })
                }
            </svg>
            </div>)}