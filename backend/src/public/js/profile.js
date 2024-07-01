

//Boton cambiar rol
const changeRole = document.querySelector("#changeRole");
changeRole.addEventListener("click", (e)=>{
  const uid = changeRole.dataset.userId;
  let rol = changeRole.dataset.userRol;
  console.log(uid)
  fetch(`/api/user/premium/${uid}`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
   }) .then((result) => {
     if (result.status === 200) {
        let title;
        if(rol === "user"){
            title = "Ahora eres usuario Premium!!"
        }else{
            title = "Ya no eres usuario Premium."
        }
      Swal.fire({
        icon: "success",
        title: title,
        customClass: {
            title: 'titleSARol'
          },
        text: `En tu proximo ingreso, verás las modificaciones!`,
        width: 400,
      });

     }
     if (result.status === 400) {
      Swal.fire({
        icon: "error",
        text: `Para ser usuario Premium es necesario completar la documentación requerida.`,
        width: 400,
      });
    }
     if(result.status === 404){
       Swal.fire({
         icon: "error",
         text: `Error al intentar modificar el rol de usuario.`,
         width: 400,
       });
     }
   });  
})


//Form de Documentación
const formIdentificacion = document.getElementById("formIdentificacion");
formIdentificacion.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = e.target.dataset.form;
  const identificacion = document.getElementById("identificacion").files[0];
  console.log(identificacion)
  const formData = new FormData();
  console.log(formData)
  formData.append("file", identificacion);
  formData.set("doc", "Identificacion");
  fetching(uid, formData);
});

const formDomicilio = document.getElementById("formDomicilio");

formDomicilio.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = e.target.dataset.form;
  const domicilio = document.getElementById("domicilio").files[0];

  const formData = new FormData();
  formData.append("file", domicilio);
  formData.set("doc", "Domicilio");
  fetching(uid, formData);
});

const formCuenta = document.getElementById("formCuenta");
formCuenta.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = e.target.dataset.form;
  const cuenta = document.getElementById("cuenta").files[0];
  const formData = new FormData();
  formData.append("file", cuenta);
  formData.set("doc", "Cuenta");
  fetching(uid, formData);
});

const fetching = async (uid, formData) => {
  await fetch(`/api/user/${uid}/documents`, {
    method: "POST",
    body: formData,
  }).then((result) => {
    if (result.status === 400) {
      Swal.fire({
        icon: "error",
        text: `Debes adjuntar el documento.`,
        width: 400,
      });
    }
    if (result.status === 500) {
      Swal.fire({
        icon: "error",
        text: `Se ha producido un error al intentar cargar la documentación.`,
        width: 400,
      });
    }
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        text: `Se subió la documentacion exitosamente.`,
        width: 400,
      }).then((result) => {
        window.location.reload();
      });
    }
  });
};
