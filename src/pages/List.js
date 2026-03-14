import { useState,useEffect } from "react";
export default function List() {
    const [employees, setEmployees] = useState([]);
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
                        salary:item[5]
                    }))
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
    return (
<div className="container">
            <h2>Employee List</h2>
            {employees.length > 0 ? ( employees.map((emp,index) => (
                <div key={index}
                className="employee-row">
                    <h3>{emp.name}</h3>
                    <p>Position: {emp.position}</p>
                    <p>Office: {emp.office}</p>
                    <p>ID: {emp.id}</p>
                    <p>Start Date: {emp.startDate}</p>
                    <p>Salary: {emp.salary}</p>
                </div>
            ))) : (
                <p>No employees found.</p>
            )}
        </div>
    );
}