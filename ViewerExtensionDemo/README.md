---> to start this project - 
 1- git clone 
 
 2- npm i
 
 3- npm start
 

---> how to create/add an extension to aps  Viewer -
 
   1- create a file in public folder - ( i named this main.js)
   
   2- include it into index.html ex <script src='./main.js'><script/>
   
   3- load the extension after starting the viewer instance  take a look line no 62 in Src/Viewer component ( 
       this.viewer.loadExtension('ExtensionName'); 
       // you can find this name in main.js at the end when you register an extension ex 
   
---> To get the vertices of a drawn polygon on the surface of a viewer with the help of Draw toolkit button -
 
 1 - draw the desired shapes 
 
 2 - select any shape with the MoveButton 
 
 3 - click on the show vertices button
 
