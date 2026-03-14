import { useParams } from "react-router-dom";
import { useRef,useState,useEffect } from "react";
export default function Details() {
    const {id}=useParams();
    const videoRef=useRef(null);
    const canvasRef=useRef(null);
    const signatureRef=useRef(null);
    const [Photo,setphoto]=useState(null);
    //start webcam
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true})
        .then(stream=>{
            
                videoRef.current.srcObject=stream;
            })
            .catch(err=>{
                console.log("Error accessing webcam:",err)
            });
        
    },[]);
   
    //capture photo from video
    const capturePhoto=()=>{
        const video=videoRef.current;
        const canvas=canvasRef.current;
        if(!video||!canvas)return;
        const ctx=canvas.getContext("2d");
        canvas.width=300;
        canvas.height=200;
        ctx.drawImage(video,0,0,300,220)}
        // setphoto(canvas.toDataURL())

//signature drawing
useEffect(()=>{
    const canvas=signatureRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    //drawing logic
    ctx.lineWidth=2;
    ctx.lineCap="round";
    ctx.strokeStyle="#000";
    let drawing=false;
    const startDrawing=(e)=>{
        drawing=true;
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        ctx.moveTo(x,y);
        ctx.beginPath();
    };
    const draw=(e)=>{
        if(!drawing)return;
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        ctx.lineTo(x,y);
        ctx.stroke();
    };
    const stopDrawing=()=>{
        drawing=false;
    };
    canvas.addEventListener("mousedown",startDrawing);
    canvas.addEventListener("mousemove",draw);
    canvas.addEventListener("mouseup",stopDrawing);
    canvas.addEventListener("mouseleave",stopDrawing);
    return()=>{
        canvas.removeEventListener("mousedown",startDrawing);
        canvas.removeEventListener("mousemove",draw);
        canvas.removeEventListener("mouseup",stopDrawing);
        canvas.removeEventListener("mouseleave",stopDrawing);
    };
    canvas.onmusedown=(e)=>{drawing=true;
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        ctx.moveTo(x,y);
        ctx.beginPath();
    };
    canvas.onmouseup=()=>{drawing=false;};
    canvas.onmouseleave=()=>{drawing=false;};
    canvas.onmousemove=(e)=>{
        if(!drawing)return;
        const rect=canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        ctx.lineTo(x,y);
        ctx.stroke();
    };
},[]);

//merge photo and signature
const mergeImages=()=>{
    const photocanvas=canvasRef.current;
    const signaturecanvas=signatureRef.current;
    if(!photocanvas||!signaturecanvas)return;
    const mergedCanvas=document.createElement("canvas");
    mergedCanvas.width=300;
    mergedCanvas.height=340;
    const ctx=mergedCanvas.getContext("2d");
    //draw photo
    ctx.drawImage(photocanvas,0,0,300,220);
    //draw signature below photo
    ctx.drawImage(signaturecanvas,0,220,300,120);
    const finalimage=mergedCanvas.toDataURL("image/png");
    setphoto(finalimage);
    
}
const clearSignature=()=>{
    const signaturecanvas=signatureRef.current;
    if(!signaturecanvas)return;
    const ctx=signaturecanvas.getContext("2d");
    ctx.clearRect(0,0,signaturecanvas.width,signaturecanvas.height);
};
return (
        <div style={{padding:"20px"}}>
            <h2>Employee Details</h2>
            <p>Employee ID: {id}</p>
            //camera
            <div style={{marginBottom:"20px"}}>
              <video ref={videoRef} autoPlay width="300" height="200" />
              <br/>
              
     <button onClick={capturePhoto}>Capture Photo</button></div>
     //photo
     <div style={{marginBottom:"20px"}}>
     <canvas ref={canvasRef} width="300" height="220" style={{border:"1px solid #ccc"}}></canvas>
     </div>
     //signature
     <div style={{marginBottom:"20px"}}>
        <p>Draw your signature </p>
     <canvas ref={signatureRef} width="300" height="120" style={{border:"1px solid #000",cursor:"crosshair"}}></canvas>
     

<button onClick={clearSignature}>Clear Signature</button></div>
//merge
<div style={{marginBottom:"20px"}}>
<button onClick={mergeImages}>Merge Image</button></div>
 {Photo && ( <div>
    <h3>Merged Image</h3><img src={Photo} width="300" alt="merged"/> </div>)}

        </div>
    );
}