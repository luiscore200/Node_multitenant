exports.generateDynamicScript = (token, raffle  , asignaciones,userID) => {

    const itemsPerPage=250;
    
    const separados = asignaciones.filter(obj => obj.status === "separado").map(obj => Number(obj.number));
    const pagados = asignaciones.filter(obj => obj.status === "pagado").map(obj => Number(obj.number));
    
    //const totalNums=Number(raffle.numbers);
    const totalNums=raffle.numbers;
    const price=raffle.price;
    const raffleID= raffle.id;
   

    const setLista= ()=>{
   
        const listDistance= 1000;
        const aa = [];
        for (let i = 0; i < totalNums; i += listDistance) {
          const page = Math.floor(i / itemsPerPage) + 1;
          aa.push({text:`${i + 1} - ${i + listDistance}`,page});
        }
        return aa;
    }

    const Lista = setLista();
  //  console.log(Lista);
    console.log(token);
    console.log(raffle);
    console.log(userID);


    const script = `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                let userID = ${userID};
                const numCeldas = 5;
                const totalNums = ${totalNums};
                const price = ${price};
                const touchable = true;
                const token = '${token}';
                const raffleID=${raffleID};
           
              
                const pagados = '${pagados}';
                const separados = '${separados}';
                const itemsPerPage = ${itemsPerPage};
                let selectedNumbers=[];
                const totalPages = Math.ceil(totalNums / itemsPerPage);
                let currentPage = 1;
                let listV = false;
                let total =0;
                let lista = ${JSON.stringify(Lista)};
                console.log(lista);
                console.log(pagados);
                let firstSection=true;
                console.log(userID);
                console.log('pagados',pagados);
                console.log('separados',separados);
        

            
            
             


                const svgPrev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgPrev.setAttribute('width', '24');
                svgPrev.setAttribute('height', '24');
                svgPrev.setAttribute('viewBox', '0 0 24 24');


                const pathPrev = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathPrev.setAttribute('d', 'M15 18l-6-6 6-6');
                pathPrev.setAttribute('fill', 'none');
                pathPrev.setAttribute('stroke', 'currentColor');
                pathPrev.setAttribute('stroke-width', '1.5');
                pathPrev.setAttribute('stroke-linecap', 'round');
                pathPrev.setAttribute('stroke-linejoin', 'round');
                svgPrev.classList.add('prev');

                svgPrev.appendChild(pathPrev);

                // SVG para el botón "next"
                const svgNext = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgNext.setAttribute('width', '24');
                svgNext.setAttribute('height', '24');
                svgNext.setAttribute('viewBox', '0 0 24 24');

                const pathNext = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathNext.setAttribute('d', 'M9 18l6-6-6-6');
                pathNext.setAttribute('fill', 'none');
                pathNext.setAttribute('stroke', 'currentColor');
                pathNext.setAttribute('stroke-width', '1.5');
                pathNext.setAttribute('stroke-linecap', 'round');
                pathNext.setAttribute('stroke-linejoin', 'round');

                svgNext.appendChild(pathNext);



                const container = document.getElementById('matrix-container');
                const container_pagination = document.getElementById('matrix-pagination');
                const totalContainer = document.getElementById("total-container");
                const selectedContainer = document.getElementById("selected-container");
                const cardBody1 = document.getElementById("card-body-1");
                const cardBody2 = document.getElementById("card-body-2");
                 const cardBody3 = document.getElementById("card-body-3");
                const confirmButton = document.getElementById("confirm-button");
                const confirmButton2 = document.getElementById("confirm-button-2");
                 const confirmButton3 = document.getElementById("confirm-button-3");
                const name = document.getElementById("name");
                const email = document.getElementById("email");
                const tel = document.getElementById("tel");
                const identificacion = document.getElementById("identificacion");
                const nameSpan = document.getElementById("name-span");
                const emailSpan = document.getElementById("email-span");
                const telSpan = document.getElementById("tel-span");
                const identificacionSpan = document.getElementById("identificacion-span");
                 
                
                const sendAssign = async ()=>{
                    
                    
                    
                        try {
                        const response = await fetch("https://app.megawins.com.co/rifa/assignNumbers/"+raffleID, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            'Authorization':"Bearer "+token, 
                            },
                            body: JSON.stringify({id_comprador:userID,numbers:selectedNumbers,method:"manual"}),
                        });
                        const data = await response.json();
                        console.log(data);
                        if (!response.ok) {
                           if(data.error){
                             alert("Formato de solicitud incorrecta, corrija el formulario");
                           }
                        }
                        return data;
                        } catch (error) {
                         console.log(error);
                        alert("Ha ocurrido un error, porfavor reintente la solicitud");
                        }
                    
                    
                    }

                      const create = async ()=>{
                    
                    
                    
                        try {
                        const response = await fetch("https://app.megawins.com.co/comprador/store", {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            'Authorization':"Bearer "+token, 
                            },
                            body: JSON.stringify({name:name.value,email:email.value,phone:tel.value,document:identificacion.value}),
                        });
                        const data = await response.json();
                        console.log(data);
                        if (!response.ok) {
                           if(data.error){
                           return data;
                             alert("Formato de solicitud incorrecta, corrija el formulario");
                           }
                             if(data.mensaje){
                             return data;
                             }
                        
                        }
                        return data;
                        } catch (error) {
                        
                        alert("Ha ocurrido un error, porfavor reintente la solicitud");
                        }
                    
                    
                    }

             const confirmForm2 = async()=>{
                        
                                if(selectedNumbers.length>0){
                                                                
                                 const aa= await  sendAssign();
                               //  console.log(aa);
                                 if(aa.mensaje){
                                       cardBody1.classList.remove('card-body');
                                         cardBody2.classList.remove('card-body');
                                        cardBody1.classList.add('card-body-hidden');
                                        cardBody2.classList.add('card-body-hidden');
                                      cardBody3.classList.remove('card-body-hidden');
                                             cardBody3.classList.add('card-body');
                                      
                                 
                                 }if(aa.error){
                                    alert(aa.error);
                                 }
                            }

                }         

                const confirmForm = async()=>{
                     
                    const rules= {
                        name: [
                            {
                            condition: (value) => value.length > 0,
                            message: 'Por favor, ingresa el nombre.',
                            },
                        ],
                          email: [
                            {
                            condition: (value) => value.length > 0,
                            message: 'Por favor, ingresa el correo electrónico.',
                            },
                            {
                            condition: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                            message: 'El formato del correo electrónico no es válido.',
                            },
                        ],
                         document: [
                            {
                            condition: (value) => value.length > 0,
                            message: 'Por favor, ingresa el documento.',
                            },
                            {
                            condition: (value) => value.length >= 6,
                            message: 'El documento debe tener al menos 6 caracteres.',
                            },
                            {
                            condition: (value) => !isNaN(value),
                            message: 'El documento debe contener solo números.',
                            },
                        ],
                        phone: [
                            {
                            condition: (value) => value.length > 0,
                            message: 'Por favor, ingresa el teléfono.',
                            },
                            {
                           condition: (value) => /^\\+\\d+ \\d+$/.test(value),
                            message: 'El teléfono debe estar en el formato "+xxx xxxxxxxxx".',
                            },
                            {
                            condition: (value) => {
                                const parts = value.split(' ');
                                return parts.length === 2 && parts[1].length >= 8;
                            },
                            message: 'El teléfono debe tener al menos 8 caracteres después del código del país.',
                            },
                        ],
  
                        
                        };
                        
                                                const validateField = (fieldName, value,validationRules) => {
                                                    const rules = validationRules[fieldName];
                                                    for (const rule of rules) {
                                                    if (!rule.condition(value)) {
                                                        return rule.message;
                                                    }
                                                    }
                                                    return '';
                                                };
                                                const validateForm = (values, touchedFields, validationRules) => {
                                                    const newErrors = {};
                                                    for (const field in touchedFields) {
                                                    if (touchedFields[field]) {
                                                        const errorMessage = validateField(field, values[field],validationRules);
                                                        if (errorMessage) {
                                                        newErrors[field] = errorMessage;
                                                        }
                                                    }
                                                    }
                                                    return newErrors;
                                                };     


                       let errors = validateForm({name:name.value,email:email.value,phone:tel.value,document:identificacion.value},{name:true,email:true,phone:true,document:true},rules);
                       console.log(errors);
                     errors.name? nameSpan.innerText=errors.name: nameSpan.innerText="";
                       errors.phone? telSpan.innerText=errors.phone: telSpan.innerText="";
                         errors.email? emailSpan.innerText=errors.email: emailSpan.innerText="";
                           errors.document? identificacionSpan.innerText=errors.document: identificacionSpan.innerText="";
                       
                         if (Object.keys(errors).length === 0) {
                         
                       
                                if(selectedNumbers.length>0){
                                
                                   const comprador = await create();
                                console.log(comprador.comprador.id);
                                comprador.comprador.id?  userID=comprador.comprador.id:undefined;
                                console.log(userID);
                                
                                 const aa= await  sendAssign();
                                 console.log(aa);
                                 if(aa.mensaje){
                                       cardBody1.classList.remove('card-body');
                                         cardBody2.classList.remove('card-body');
                                        cardBody1.classList.add('card-body-hidden');
                                        cardBody2.classList.add('card-body-hidden');
                                      cardBody3.classList.remove('card-body-hidden');
                                             cardBody3.classList.add('card-body');
                                      
                                 
                                 }



                                }else{
                                alert("para poder procesar tu solicitud primero escoje al menos 1 numero");
                                }

                           } 
                    
                    }

                     


                const changeSection = ()=>{
                    if(firstSection){
                         cardBody1.classList.remove('card-body');
                         cardBody1.classList.add('card-body-hidden');
                          cardBody2.classList.remove('card-body-hidden');
                           cardBody2.classList.add('card-body');
                    
                    }else{
                          cardBody1.classList.remove('card-body-hidden');
                         cardBody1.classList.add('card-body');
                          cardBody2.classList.remove('card-body');
                           cardBody2.classList.add('card-body-hidden');
                    }
                         firstSection = firstSection? false:true;
                    } 

                const select = (number) => {
                    if(selectedNumbers.length>=10){
                    alert("El maximo de asignaciones por invitacion es de 10, solicite otro a su provedor");
                    return;
                    }
                     const cell= document.getElementById('cell-'+number);
                    if(selectedNumbers.includes(number)){
                     selectedNumbers = selectedNumbers.filter(obj => obj!==number);
                       cell.classList.remove('selectedCell');
                     cell.classList.add('cell');
                    }else{
                     selectedNumbers.push(number);
                   
                     cell.classList.remove('cell');
                     cell.classList.add('selectedCell');
                    }
                     total = selectedNumbers.length * price;
                    
                    console.log(number);
                    list = false;
                    console.log(selectedNumbers);
                      totalContainer.innerText="$ "+total;
                      ColumnGrid();
                    
                    
                };

                          const renderCell = (number) => {
                    const cell = document.createElement('div');
                    cell.id = 'cell-' + number;

                    if (pagados.includes(number)) {
                        cell.classList.add('assignedCell');
                    } else if (separados.includes(number)) {
                        cell.classList.add('reservedCell');
                    } else {
                        cell.classList.add('cell');
                    }

                    cell.innerText = number;
                    cell.addEventListener('click', () => select(number));
                    return cell;
                };

                const renderMatrix = (startNumber) => {
                    const matrix = document.createElement('div');
                    matrix.classList.add('matrix');
           

                    for (let i = 0; i < numCeldas; i++) {
                        const row = document.createElement('div');
                        row.classList.add('row');
                        row.style.display = 'flex'; // Ensure rows display as flex
                        row.style.flexDirection = 'row'; // Display cells in row layout

                        for (let j = 0; j < numCeldas; j++) {
                            const number = startNumber + i * numCeldas + j;
                            if (number <= totalNums) {
                                row.appendChild(renderCell(number));
                            }
                        }
                        matrix.appendChild(row);
                    }
                    return matrix;
                };
                const RenderListPaginations = () => {
                                const list = document.createElement('div');
                                list.id= "container-list";
                                
                                list.classList.add(listV?'list-pagination':'list-pagination-hidden');
                                for (let i = 0; i < lista.length; i++) {
                                    const item = document.createElement('div');
                                    item.classList.add('pagination-item'); 
                                     item.addEventListener('click', () =>{ 
                                    currentPage=lista[i].page;
                                    listV=false;
                                     renderGrid();
                                    });
                                    const text = document.createElement('p');
                                     text.innerText  = lista[i].text; // Asigna el texto del elemento desde lista[i].text
                                         text.classList.add('pagination-item-text'); 

                                    item.appendChild(text); // Agrega el elemento <p> al elemento <div> 'item'
                                    list.appendChild(item); // Agrega el elemento 'item' al contenedor 'list'
                                }

                                // Agrega estilos al contenedor 'list'
                           

                           return list
                                };



                const renderPagination = () => {
                    const pagination = document.createElement('div');
                    pagination.classList.add('pagination');
               
                    const prevButton = document.createElement('div');
                    prevButton.appendChild(svgPrev);
                    prevButton.disabled = currentPage === 1;
                    prevButton.addEventListener('click', () => {
                        if (currentPage > 1) {
                            currentPage--;
                             listV=false;
                            renderGrid();
                        }
                    });
                    pagination.appendChild(prevButton);
                    const cont = document.createElement('div');
                   
                    cont.classList.add("cont_pageInfo");
                    
                    const pageInfo = document.createElement('span');
                    pageInfo.classList.add("pageInfo");
                    pageInfo.innerText = \`Página \${currentPage} de \${totalPages}\`;
                    pageInfo.addEventListener('click', () =>{ 
                        listV= listV?false:true;
                        renderGrid();
                            });
                    cont.appendChild(pageInfo);

                    const list = RenderListPaginations();
                    cont.appendChild(list);

                    pagination.appendChild(cont);

                    const nextButton = document.createElement('div');
                         nextButton.appendChild(svgNext);
                    nextButton.disabled = currentPage === totalPages;
                    nextButton.addEventListener('click', () => {
                        if (currentPage < totalPages) {
                            currentPage++;
                            listV=false;
                            renderGrid();
                        }
                    });
                    pagination.appendChild(nextButton);

                    return pagination;
                };


                     const ColumnGrid = () => {
                        selectedContainer.innerHTML="";
                    
                        let i =0;
                        while (i < selectedNumbers.length) {
                        const duo = selectedNumbers.slice(i, i + 2);
                       
                        const column = document.createElement('div');
                        column.style.display='flex';
                        column.style.flexDirection='column';

                      
                        
                        duo.map(obj=>{
                              const cell1=document.createElement('div');
                            cell1.classList.add('selectedCell');
                            const text1=document.createElement('p');
                            text1.innerText=obj;
                            cell1.appendChild(text1);
                            column.appendChild(cell1);
                            })

                        
                      

                        selectedContainer.appendChild(column);
                        i += 2;
                        }
                    
                       
                    };



                const renderGrid = () => {
                   if(userID!==null){
                   confirmButton.addEventListener('click', () => confirmForm2());
                  
                   }else{

                   confirmButton.addEventListener('click', () => changeSection());
                     confirmButton.innerHTML="";
                   const text = document.createElement("span");
                    text.classList.add('confirmButtonText');
                    text.innerText="Siguiente >";
                    confirmButton.appendChild(text);

                    confirmButton2.addEventListener('click', () => confirmForm());
                      confirmButton3.addEventListener('click', () => changeSection());

                   }

                    container.innerHTML = '';
                    container_pagination.innerHTML = '';

                    const startNumber = (currentPage - 1) * itemsPerPage + 1;
                    const maxNumber = startNumber + itemsPerPage - 1;

                    // Calculate number of matrices per row
                    const matricesPerRow = 3;

                    for (let number = startNumber; number <= maxNumber; number += numCeldas * numCeldas * matricesPerRow) {
                        const rowContainer = document.createElement('div');
                        rowContainer.classList.add('matrix-row');
                        rowContainer.style.display = 'flex'; // Ensure row container displays as flex

                        for (let i = 0; i < matricesPerRow && number + i * numCeldas * numCeldas <= maxNumber; i++) {
                            const startNum = number + i * numCeldas * numCeldas;
                            const matrix = renderMatrix(startNum);
                            rowContainer.appendChild(matrix);
                        }

                        container.appendChild(rowContainer);
                    }

                    container_pagination.appendChild(renderPagination());
                };

                renderGrid();
            });
        </script>
    `;
    
    return script;
};

