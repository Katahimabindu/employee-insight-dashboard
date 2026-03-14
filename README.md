###Intentional bug
In employee list page i.e list.js,i added a setInterval inside a useEffect hook that logs the scrollposition scrollTop for every 5 seconds.however,the dependency array of useEffect is empty,so the scrollTop value inside the interval does not update when user scrolls,so the console keeps printing the intial scroll value instead of latest one.
bug:useEffect(()=>{
    const interval=setInterval(()=>{
        console.log("Scroll top:",scrollTop);
    },5000);
    return()=>clearInterval(interval);
},[]);
it is located in list.js file
### why this bug happened
Because of stale closure in react hooks
when useEffect runs for first time,it has the current value of scrollTop and since dependence array is empty the effect never runs again and so interval keeps using old value instaed o updated state
i choose this bug because it is a common mistake when working with hooks and if we forget to ncude state variables in dependency array which can cause outdated values to be used inside asynchronous callbacks.

###Virtualization math
Employee list page is implemented with manual virtualization to improve performance while rendering employee data .if entire data is rendered at once,browser will create many dom elements and increase memory usage.To avoid ths only the rows that are currently visible inside scroll container are rendered
step 1:fixed row height =50px//each employee row has a fixed height
step 2:calculated visible rows
based on container height=400px ,it is caluclated,so no of visible rows is 400/50=8 rows
step 3:caluclated start index-when user scrolls,scrolltop value tells how far it is moved
startIndex=Math.floor(scrollTop/Row_Height)
step 4 :add buffer rows
to make scrolling smoother,a few extra row are rendered above and below vsible area,this prevents blank spaces while scrolling
step 5:caluclate endIndex-determines the last row
endIndex=startIndex+visible_rows + bufferrows *2
this ensures that viewport rows plus buffer rows are included
step 6:slice the data
instead of rendering entire list ,only portion of data is renderd
visibleRows=employees.slice(startIndex,endIndex)
step 7:position rows 
this is done using absolute positioning
top=(startindex+index)*Row_height
this creates visual effect of full list even though only a subset of rows is actually renderd.