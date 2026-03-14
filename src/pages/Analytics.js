import { useState,useEffect } from "react";
import {MapContainer,TileLayer,Marker,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
export default function Analytics() {
    const [citySalary,setCitySalary]=useState([]);
    const cityCoordinates={
        Edinburgh:[55.9533,-3.1883],
        Tokyo:[35.6762,139.6503],
        London:[51.5074,-0.1278],
        SanFrancisco:[37.7749,-122.4194],
        NewYork:[40.7128,-74.006],
        Singapore:[1.3521,103.8198]}
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
            <h2>City Map</h2>
            <MapContainer center={[20,0]} zoom={2} style={{height:"400px",width:"100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {citySalary.map((item,index)=>{
                    const coords=cityCoordinates[item.city];
                    if(!coords)return null;
                    return (
                    <Marker key={index} position={coords}>
                
                <Popup>
                            {item.city} <br/> 
                            Total Salary: ${item.Salary}
                        </Popup>
                    </Marker>
                );
                })}
            </MapContainer>
        </div>
    );
}